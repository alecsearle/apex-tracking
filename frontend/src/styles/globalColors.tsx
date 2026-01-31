import { useColorScheme } from "react-native";

export const lightColors = {
  // Text hierarchy
  textHeading: "#1A1A1A",
  textPrimary: "#3A3A3A",
  textSecondary: "#6A6A6A",
  textMuted: "#c4c4c4",

  // Backgrounds
  backgroundPrimary: "#F8F8F8",
  backgroundCard: "#FFFFFF",
  backgroundHeader: "#FFFFFF",

  // Brand/Accent
  brandPrimary: "#8BBBBA",
  brandLight: "#D6F0F0",

  // Borders & Dividers
  border: "#E0E0E0",
  divider: "#E5E5E5",

  // Interactive states
  tabActive: "#1A1A1A",
  tabInactive: "rgba(0, 0, 0, 0.5)",

  // Status colors
  statusActiveText: "#7CB342",
  statusActiveBg: "#F1F8E9",
  statusWarningText: "#FFA726",
  statusWarningBg: "#FFF8E1",
  statusErrorText: "#E57373",
  statusErrorBg: "#FFF5F5",
};

export const darkColors = {
  // Text hierarchy
  textHeading: "#FFFFFF",
  textPrimary: "#E5E5E5",
  textSecondary: "#A0A0A0",
  textMuted: "#6A6A6A",

  // Backgrounds
  backgroundPrimary: "#1A1A1A",
  backgroundCard: "#2C2C2C",
  backgroundHeader: "#2C2C2C",

  // Brand/Accent
  brandPrimary: "#8BBBBA",
  brandLight: "#D6F0F0",

  // Borders & Dividers
  border: "#333333",
  divider: "#3A3A3A",

  // Interactive states
  tabActive: "#FFFFFF",
  tabInactive: "rgba(255, 255, 255, 0.6)",

  // Status colors (for tool sessions/maintenance)
  statusActiveText: "#A5D6A7",
  statusActiveBg: "#1B5E20",
  statusWarningText: "#FFCC80",
  statusWarningBg: "#E65100",
  statusErrorText: "#EF9A9A",
  statusErrorBg: "#B71C1C",
};

export const useColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkColors : lightColors;
};
