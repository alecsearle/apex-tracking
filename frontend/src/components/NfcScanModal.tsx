import { useColors } from "@/src/styles/globalColors";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Animated, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface NfcScanModalRef {
  show: (hint?: string) => void;
  hide: () => void;
}

export const NfcScanModal = forwardRef<NfcScanModalRef, { onCancel: () => void }>(
  ({ onCancel }, ref) => {
    const [visible, setVisible] = useState(false);
    const [hint, setHint] = useState("Ready to scan NFC tag");
    const colors = useColors();
    const opacity = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      show: (h?: string) => {
        if (h) setHint(h);
        setVisible(true);
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      },
      hide: () => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
          setVisible(false);
        });
      },
    }));

    // iOS uses native NFC prompt
    if (Platform.OS === "ios") return null;

    return (
      <Modal visible={visible} transparent animationType="none">
        <Animated.View style={[styles.overlay, { opacity }]}>
          <View style={[styles.card, { backgroundColor: colors.backgroundCard }]}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: colors.textHeading, marginBottom: 8 }}>
              NFC Scan
            </Text>
            <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 24, textAlign: "center" }}>
              {hint}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                onCancel();
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: colors.brandPrimary,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.brandPrimary }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  card: {
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
});
