import Button from "@/src/components/Button";
import Card from "@/src/components/Card";
import Icon from "@/src/components/Icon";
import { useMembers } from "@/src/hooks/useMembers";
import { CURRENT_USER, MOCK_BUSINESS, MOCK_MEMBERSHIPS } from "@/src/mocks/mockData";
import { useColors } from "@/src/styles/globalColors";
import { Membership } from "@/src/types/business";
import { supabase } from "@/lib/supabase";
import { Alert, Pressable, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native";

function MemberRow({ member }: { member: Membership }) {
  const colors = useColors();

  return (
    <View style={{
      flexDirection: "row", alignItems: "center", paddingVertical: 12,
      borderBottomWidth: 0.5, borderBottomColor: colors.divider,
    }}>
      <View style={{
        width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brandLight,
        justifyContent: "center", alignItems: "center", marginRight: 12,
      }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.brandPrimary }}>
          {member.user.fullName.charAt(0)}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
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
    </View>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { members } = useMembers();

  const currentMembership = MOCK_MEMBERSHIPS.find((m) => m.userId === CURRENT_USER.id);

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

  function handleCopyCode() {
    Alert.alert("Business Code", MOCK_BUSINESS.businessCode, [{ text: "OK" }]);
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
              <View style={{
                width: 56, height: 56, borderRadius: 28, backgroundColor: colors.brandLight,
                justifyContent: "center", alignItems: "center", marginRight: 14,
              }}>
                <Text style={{ fontSize: 24, fontWeight: "700", color: colors.brandPrimary }}>
                  {CURRENT_USER.fullName.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textHeading }}>
                  {CURRENT_USER.fullName}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>
                  {CURRENT_USER.email}
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
              <Text style={valueStyle}>{MOCK_BUSINESS.name}</Text>
            </View>
            <View style={detailRow}>
              <Text style={labelStyle}>Code</Text>
              <Pressable onPress={handleCopyCode} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[valueStyle, { color: colors.brandPrimary }]}>{MOCK_BUSINESS.businessCode}</Text>
                <Icon name="content-copy" iosName="doc.on.doc" androidName="content-copy" size={16} color={colors.brandPrimary} />
              </Pressable>
            </View>
            <View style={[detailRow, { borderBottomWidth: 0 }]}>
              <Text style={labelStyle}>Your Role</Text>
              <View style={{
                backgroundColor: colors.brandLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
              }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.brandPrimary, textTransform: "capitalize" }}>
                  {currentMembership?.role ?? "owner"}
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
                <MemberRow member={member} />
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
