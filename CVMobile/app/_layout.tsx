// CVMobile/app/_layout.tsx (ATUALIZADO)
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import {
  NavLightTheme,
  PaperLightTheme,
  NavDarkTheme,
  PaperDarkTheme,
} from "@/constants/theme"; // Nossos temas definidos

// --- NOSSAS MUDANÇAS ---
// 1. Importamos nosso novo Provedor e Hook
import { CustomThemeProvider, useCustomTheme } from "@/contexts/ThemeContext";
// --------------------

export { ErrorBoundary } from "expo-router";
export const unstable_settings = { initialRouteName: "(tabs)" };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // 2. Envolvemos o App no CustomThemeProvider
  return (
    <CustomThemeProvider>
      <RootLayoutNav />
    </CustomThemeProvider>
  );
}

function RootLayoutNav() {
  // 3. Usamos nosso hook para saber qual tema está ATIVO
  const { effectiveTheme } = useCustomTheme();

  // 4. Escolhemos o conjunto de temas correto
  const paperTheme =
    effectiveTheme === "dark" ? PaperDarkTheme : PaperLightTheme;
  const navTheme = effectiveTheme === "dark" ? NavDarkTheme : NavLightTheme;

  return (
    // 5. Passamos os temas dinâmicos para os providers
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
