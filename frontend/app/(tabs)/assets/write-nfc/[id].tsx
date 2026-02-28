import Button from "@/src/components/Button";
import { NfcScanModal, NfcScanModalRef } from "@/src/components/NfcScanModal";
import { useNfc } from "@/src/hooks/useNfc";
import { useColors } from "@/src/styles/globalColors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, View, ViewStyle } from "react-native";

export default function WriteNfcScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const { writeTag, cancelScan, isSupported } = useNfc();
  const modalRef = useRef<NfcScanModalRef>(null);
  const [writing, setWriting] = useState(false);

  const handleWrite = async () => {
    setWriting(true);
    modalRef.current?.show("Hold NFC tag near device to write...");
    const deepLinkUri = `apextracking://assets/${id}`;
    const success = await writeTag(deepLinkUri);
    modalRef.current?.hide();
    setWriting(false);

    if (success) {
      Alert.alert("Success", "NFC tag programmed with asset deep link");
      router.back();
    } else {
      Alert.alert("Error", "Failed to write to NFC tag. Make sure it is writable.");
    }
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: colors.backgroundPrimary,
  };

  if (!isSupported) {
    return (
      <View style={containerStyle}>
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center" }}>
          NFC is not supported on this device.
        </Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.textHeading, textAlign: "center", marginBottom: 8 }}>
        Program NFC Tag
      </Text>
      <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: "center", marginBottom: 24 }}>
        This will write a deep link to the NFC tag so tapping it opens this asset.
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: colors.textMuted,
          textAlign: "center",
          marginBottom: 24,
          fontFamily: "monospace",
        }}
      >
        URI: apextracking://assets/{id}
      </Text>
      <Button
        variant="primary"
        fullWidth
        icon="nfc"
        iosIcon="wave.3.right"
        androidIcon="nfc"
        onPress={handleWrite}
        disabled={writing}
      >
        {writing ? "Writing..." : "Write to NFC Tag"}
      </Button>
      <NfcScanModal ref={modalRef} onCancel={cancelScan} />
    </View>
  );
}
