import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useMembers } from "@/src/hooks/useMembers";
import { useAuth } from "@/src/hooks/useAuth";
import { businessService } from "@/src/services/businessService";
import { apiRequest, apiUpload } from "@/src/services/api";
import { useColors } from "@/src/styles/globalColors";
import { Membership } from "@/src/types/business";
import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput as RNTextInput, TextStyle, View, ViewStyle } from "react-native";

function Avatar({
  uri,
  fallback,
  size,
  colors,
}: {
  uri?: string | null;
  fallback: string;
  size: number;
  colors: ReturnType<typeof useColors>;
}) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2, backgroundColor: colors.brandLight,
      justifyContent: "center", alignItems: "center",
    }}>
      <Text style={{ fontSize: size * 0.43, fontWeight: "700", color: colors.brandPrimary }}>
        {fallback.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

function MemberRow({
  member,
  isOwner,
  isSelf,
  onRemove,
}: {
  member: Membership;
  isOwner: boolean;
  isSelf: boolean;
  onRemove?: () => void;
}) {
  const colors = useColors();

  return (
    <View style={{
      flexDirection: "row", alignItems: "center", paddingVertical: 12,
      borderBottomWidth: 0.5, borderBottomColor: colors.divider,
    }}>
      <Avatar uri={member.user.avatarUrl} fallback={member.user.fullName} size={40} colors={colors} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textHeading }}>
          {member.user.fullName}
        </Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 1 }}>
          {member.user.email}
        </Text>
      </View>
      <View style={{
        backgroundColor: member.role === "owner" ? colors.brandLight : colors.divider,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
      }}>
        <Text style={{
          fontSize: 12, fontWeight: "600",
          color: member.role === "owner" ? colors.brandPrimary : colors.textSecondary,
          textTransform: "capitalize",
        }}>
          {member.role}
        </Text>
      </View>
      {isOwner && !isSelf && member.role !== "owner" && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          style={{ marginLeft: 10 }}
        >
          <Icon name="remove-circle-outline" iosName="minus.circle" androidName="remove-circle-outline" size={22} color={colors.statusErrorText} />
        </Pressable>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { members, refetch: refetchMembers } = useMembers();
  const { session, businessId, businessName, businessCode, role, avatarUrl, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const currentMember = members.find((m) => m.userId === session?.user?.id);
  const currentUser = {
    fullName: currentMember?.user.fullName ?? session?.user?.user_metadata?.full_name ?? "User",
    email: session?.user?.email ?? "",
  };

  const containerStyle: ViewStyle = { flex: 1, backgroundColor: colors.backgroundPrimary };
  const contentStyle: ViewStyle = { padding: 16, paddingTop: 72, paddingBottom: 48 };
  const sectionTitle: TextStyle = {
    fontSize: 14, fontWeight: "700", color: colors.textSecondary,
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10, marginLeft: 4, marginTop: 24,
  };
  const detailRow: ViewStyle = {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: colors.divider,
  };
  const labelStyle: TextStyle = { fontSize: 15, color: colors.textSecondary };
  const valueStyle: TextStyle = { fontSize: 15, fontWeight: "600", color: colors.textPrimary };

  async function handlePickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow photo library access to set a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets.length) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const formData = new FormData();
      const ext = asset.uri.split(".").pop() || "jpg";
      formData.append("photo", {
        uri: asset.uri,
        name: `avatar.${ext}`,
        type: asset.mimeType || "image/jpeg",
      } as any);

      await apiUpload("/auth/avatar", formData);
      await refreshProfile();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  }

  function handleEditName() {
    setNameInput(currentUser.fullName);
    setEditingName(true);
  }

  async function handleSaveName() {
    if (!nameInput.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    try {
      await apiRequest("/auth/profile", {
        method: "PUT",
        body: { fullName: nameInput.trim() },
      });
      setEditingName(false);
      await refreshProfile();
      refetchMembers();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to update name.");
    }
  }

  function handleCopyCode() {
    Alert.alert("Business Code", businessCode ?? "", [{ text: "OK" }]);
  }

  function handleRemoveMember(member: Membership) {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${member.user.fullName} from this business?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (!businessId) return;
            try {
              await businessService.removeMember(businessId, member.userId);
              refetchMembers();
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to remove member.");
            }
          },
        },
      ]
    );
  }

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
        },
      },
    ]);
  }

  return (
    <View style={containerStyle}>
      <ScrollView contentContainerStyle={contentStyle}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: colors.textHeading, marginBottom: 4 }}>
          Settings
        </Text>

        {/* Profile */}
        <Text style={sectionTitle}>Profile</Text>
        <Card variant="elevated" padding="none">
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16 }}>
              <Pressable onPress={handlePickAvatar} disabled={uploading}>
                <View>
                  <Avatar uri={avatarUrl} fallback={currentUser.fullName} size={56} colors={colors} />
                  <View style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 22, height: 22, borderRadius: 11,
                    backgroundColor: colors.brandPrimary,
                    justifyContent: "center", alignItems: "center",
                    borderWidth: 2, borderColor: colors.backgroundCard,
                  }}>
                    <Icon name="camera-alt" iosName="camera.fill" androidName="camera-alt" size={12} color="#FFFFFF" />
                  </View>
                </View>
              </Pressable>
              <View style={{ flex: 1, marginLeft: 14 }}>
                {editingName ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <RNTextInput
                      value={nameInput}
                      onChangeText={setNameInput}
                      autoFocus
                      style={{
                        flex: 1, fontSize: 18, fontWeight: "700", color: colors.textHeading,
                        borderBottomWidth: 1.5, borderBottomColor: colors.brandPrimary,
                        paddingVertical: 4,
                      }}
                      onSubmitEditing={handleSaveName}
                      returnKeyType="done"
                    />
                    <Pressable onPress={handleSaveName} hitSlop={8}>
                      <Icon name="check" iosName="checkmark" androidName="check" size={22} color={colors.brandPrimary} />
                    </Pressable>
                    <Pressable onPress={() => setEditingName(false)} hitSlop={8}>
                      <Icon name="close" iosName="xmark" androidName="close" size={22} color={colors.textSecondary} />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={handleEditName} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textHeading }}>
                      {currentUser.fullName}
                    </Text>
                    <Icon name="edit" iosName="pencil" androidName="edit" size={16} color={colors.textSecondary} />
                  </Pressable>
                )}
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>
                  {currentUser.email}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Business */}
        <Text style={sectionTitle}>Business</Text>
        <Card variant="elevated" padding="none">
          <View style={{ paddingHorizontal: 16 }}>
            <View style={detailRow}>
              <Text style={labelStyle}>Name</Text>
              <Text style={valueStyle}>{businessName ?? "—"}</Text>
            </View>
            <View style={detailRow}>
              <Text style={labelStyle}>Code</Text>
              <Pressable onPress={handleCopyCode} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[valueStyle, { color: colors.brandPrimary }]}>{businessCode ?? "—"}</Text>
                <Icon name="content-copy" iosName="doc.on.doc" androidName="content-copy" size={16} color={colors.brandPrimary} />
              </Pressable>
            </View>
            <View style={[detailRow, { borderBottomWidth: 0 }]}>
              <Text style={labelStyle}>Your Role</Text>
              <View style={{
                backgroundColor: colors.brandLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
              }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.brandPrimary, textTransform: "capitalize" }}>
                  {role ?? "owner"}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Members */}
        <Text style={sectionTitle}>Members ({members.length})</Text>
        <Card variant="elevated" padding="none">
          <View style={{ paddingHorizontal: 16 }}>
            {members.map((member, idx) => (
              <View key={member.id} style={idx === members.length - 1 ? { borderBottomWidth: 0 } : {}}>
                <MemberRow
                  member={member}
                  isOwner={role === "owner"}
                  isSelf={member.userId === session?.user?.id}
                  onRemove={() => handleRemoveMember(member)}
                />
              </View>
            ))}
          </View>
        </Card>

        {/* Sign Out */}
        <View style={{ marginTop: 32 }}>
          <Button variant="ghost" status="error" fullWidth onPress={handleSignOut}>
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
