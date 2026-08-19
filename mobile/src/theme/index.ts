import { Platform } from "react-native";

export const colors = {
  background: "#E3D4B8",
  surface: "#F8F1E3",
  appSurface: "#EFE4CF",
  softSurface: "#E3D4B8",
  border: "#D2C2A5",
  text: "#2D3938",
  textSubtle: "#3F4C4A",
  textMuted: "#5F675C",
  action: "#36513F",
  onAction: "#EFE4CF",
  accent: "#A7B8A6",
  error: "#9B4D4D"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
} as const;

export const radii = {
  sm: 10,
  md: 16,
  round: 999
} as const;

export const typography = {
  body: Platform.select({ ios: "System", default: "sans-serif" }),
  heading: Platform.select({ ios: "Georgia", default: "serif" })
} as const;
