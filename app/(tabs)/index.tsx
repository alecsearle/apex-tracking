import DefaultText from "@/src/components/DefaultText";
import Heading from "@/src/components/Heading";
import SubHeading from "@/src/components/SubHeading";
import { useColors } from "@/src/styles/globalColors";
import { View } from "react-native";

export default function Index() {
  const colors = useColors();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.backgroundPrimary,
      }}
    >
      <Heading content="Apex Tracking" />
      <SubHeading content="Apex Tracking" />
      <DefaultText content="Welcome to Apex Tracking " />
    </View>
  );
}
