import { useColors } from "@/src/styles/globalColors";
import { Text } from "react-native";

const Heading = ({ content }: { content: string }) => {
  const colors = useColors();

  const styleSheet = {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: colors.textPrimary,
  };

  return <Text style={styleSheet}>{content}</Text>;
};

export default Heading;
