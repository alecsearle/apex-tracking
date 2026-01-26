import { useColors } from "@/src/styles/globalColors";
import { Text } from "react-native";

const DefaultText = ({ content }: { content: string }) => {
  const colors = useColors();

  const styleSheet = {
    fontSize: 16,
    color: colors.textPrimary,
  };

  return <Text style={styleSheet}>{content}</Text>;
};

export default DefaultText;
