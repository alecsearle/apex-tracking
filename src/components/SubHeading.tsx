import { useColors } from "@/src/styles/globalColors";
import { Text } from "react-native";

const SubHeading = ({ content }: { content: string }) => {
  const colors = useColors();

  const styleSheet = {
    fontSize: 18,
    color: colors.textPrimary,
  };

  return <Text style={styleSheet}>{content}</Text>;
};

export default SubHeading;
