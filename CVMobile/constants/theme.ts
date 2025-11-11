import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
} from "react-native-paper";
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";

// --- CORES BASE ---
const PRIMARY_COLOR = "rgb(0, 95, 175)";
const LIGHT_BACKGROUND = "rgb(245, 245, 245)";
const DARK_BACKGROUND = "rgb(18, 18, 18)";
const DARK_SURFACE = "rgb(30, 30, 30)"; // Cor dos Cards no modo escuro

// --- TEMA CLARO UNIFICADO ---
export const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: PRIMARY_COLOR,
    onPrimary: "rgb(255, 255, 255)",
    background: LIGHT_BACKGROUND,
    surface: "rgb(255, 255, 255)",
  },
};

export const NavLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: PRIMARY_COLOR,
    background: LIGHT_BACKGROUND,
    card: "rgb(255, 255, 255)",
    text: "rgb(0, 0, 0)",
  },
};

// --- TEMA ESCURO UNIFICADO ---
export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: PRIMARY_COLOR,
    onPrimary: "rgb(255, 255, 255)",
    background: DARK_BACKGROUND,
    surface: DARK_SURFACE, // Cards escuros
  },
};

export const NavDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: PRIMARY_COLOR,
    background: DARK_BACKGROUND,
    card: DARK_SURFACE, // Header escuro
    text: "rgb(255, 255, 255)",
  },
};
