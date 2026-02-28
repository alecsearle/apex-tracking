import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

export function useNfc() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    async function init() {
      const supported = await NfcManager.isSupported();
      setIsSupported(supported);
      if (supported) {
        await NfcManager.start();
        if (Platform.OS === "android") {
          const enabled = await NfcManager.isEnabled();
          setIsEnabled(enabled);
        } else {
          setIsEnabled(true);
        }
      }
    }
    init();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const readTag = useCallback(async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      return tag;
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }, []);

  const writeTag = useCallback(async (uri: string) => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(uri)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
      }
      return true;
    } catch {
      return false;
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }, []);

  const cancelScan = useCallback(async () => {
    await NfcManager.cancelTechnologyRequest().catch(() => {});
  }, []);

  const parseUri = useCallback((tag: any): string | null => {
    if (!tag?.ndefMessage?.length) return null;
    const record = tag.ndefMessage[0];
    if (record.tnf === Ndef.TNF_WELL_KNOWN) {
      const typeStr = String.fromCharCode(...(record.type as number[]));
      if (typeStr === "U") {
        return Ndef.uri.decodePayload(record.payload as unknown as Uint8Array);
      }
    }
    return null;
  }, []);

  return { isSupported, isEnabled, readTag, writeTag, cancelScan, parseUri };
}
