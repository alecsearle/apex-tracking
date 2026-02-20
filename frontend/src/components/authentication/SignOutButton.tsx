import { supabase } from "@/lib/supabase";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) Alert.alert(error.message);
}

export default function SignOutButton() {
  return (
    <Pressable style={styles.button} onPress={signOut}>
      <Text style={styles.text}>Sign Out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff3b30",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    margin: 24,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
