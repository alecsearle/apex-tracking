import SignOutButton from "@/src/components/authentication/SignOutButton";
import { Text, View } from "react-native";

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Settings</Text>
      <SignOutButton />
    </View>
  );
}
