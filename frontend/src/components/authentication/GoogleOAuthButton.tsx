import { supabase } from "@/lib/supabase";
import { useColors } from "@/src/styles/globalColors";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
};

export default function GoogleOAuthButton() {
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const redirectTo = makeRedirectUri(); // no arguments

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo, // pass it here
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;
    const res = await WebBrowser.openAuthSessionAsync(data?.url ?? "", redirectTo);
    if (res.type === "success") {
      await createSessionFromUrl(res.url);
    }
  }

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
        },
      ]}
      onPress={signInWithGoogle}
    >
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, { color: colors.textPrimary }]}>G</Text>
      </View>
      <Text style={[styles.text, { color: colors.textPrimary }]}>Continue with Google</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
    fontWeight: "700",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
