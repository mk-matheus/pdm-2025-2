// CVMobile/app/_layout.tsx (CORRIGIDO PARA SUPORTAR DARK/LIGHT)
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

// --- NOSSAS MUDANÇAS ---
import { PaperProvider } from "react-native-paper";
// Importa NOSSOS temas centralizados
import {
  NavLightTheme,
  PaperLightTheme,
  NavDarkTheme,
  PaperDarkTheme,
} from "@/constants/theme";
// Importa o hook para detectar o tema do celular
import { useColorScheme } from "@/components/useColorScheme";
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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // AQUI ESTÁ A MÁGICA:
  // Detectamos o tema do celular (light ou dark)
  const colorScheme = useColorScheme();

  // Escolhemos o conjunto de temas correto
  const paperTheme = colorScheme === "dark" ? PaperDarkTheme : PaperLightTheme;
  const navTheme = colorScheme === "dark" ? NavDarkTheme : NavLightTheme;

  return (
    // Passamos os temas dinâmicos para os providers corretos
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
