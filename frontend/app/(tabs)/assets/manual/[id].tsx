import Button from "@/src/components/Button";
import Icon from "@/src/components/Icon";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { useAsset } from "@/src/hooks/useAsset";
import { useColors } from "@/src/styles/globalColors";
import { Asset as ExpoAsset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sampleManual = require("@/assets/manuals/sample-manual.pdf");

async function openLocalPdf(): Promise<void> {
  const [asset] = await ExpoAsset.loadAsync(sampleManual);
  if (!asset.localUri) throw new Error("Failed to load bundled PDF");

  // Copy to cache so it has a .pdf extension (needed for OS to recognise the file type)
  const dest = `${FileSystem.cacheDirectory}sample-manual.pdf`;
  await FileSystem.copyAsync({ from: asset.localUri, to: dest });
  await WebBrowser.openBrowserAsync(dest);
}

async function openRemotePdf(url: string): Promise<void> {
  await WebBrowser.openBrowserAsync(url);
}

export default function ManualViewerScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { asset, loading } = useAsset(id);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-open the PDF when the screen mounts
  useEffect(() => {
    if (!asset?.manualUrl || opening) return;

    let cancelled = false;

    async function open() {
      setOpening(true);
      setError(null);
      try {
        if (asset!.manualUrl!.startsWith("local:")) {
          await openLocalPdf();
        } else {
          await openRemotePdf(asset!.manualUrl!);
        }
        // After the browser closes, go back to asset detail
        if (!cancelled) router.back();
      } catch (err) {
        if (!cancelled) setError(String(err));
      } finally {
        if (!cancelled) setOpening(false);
      }
    }

    open();
    return () => { cancelled = true; };
  }, [asset?.manualUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || opening) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary }}>
        <LoadingIndicator />
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: 16 }}>Opening PDF...</Text>
      </View>
    );
  }

  if (!asset || !asset.manualUrl) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary }}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>No manual available</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.backgroundPrimary, padding: 24 }}>
        <Icon name="error-outline" iosName="exclamationmark.triangle" androidName="error-outline" size={40} color={colors.statusErrorText} />
        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textHeading, marginTop: 16 }}>
          Failed to open PDF
        </Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: "center" }}>
          {error}
        </Text>
        <View style={{ marginTop: 24, gap: 12 }}>
          <Button
            variant="primary"
            onPress={async () => {
              setOpening(true);
              setError(null);
              try {
                if (asset.manualUrl!.startsWith("local:")) {
                  await openLocalPdf();
                } else {
                  await openRemotePdf(asset.manualUrl!);
                }
                router.back();
              } catch (err) {
                setError(String(err));
              } finally {
                setOpening(false);
              }
            }}
          >
            Try Again
          </Button>
          <Button variant="ghost" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return null;
}
