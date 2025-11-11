// app/_layout.js
import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { LogBox } from "react-native";

// Opcional: Ignora um aviso comum, mas não crítico, do Expo Router
LogBox.ignoreLogs([
  "Warning: Stack: Options for screen '...' were not MASKED...",
]);

// Tema customizado (opcional, mas recomendado)
// Você pode mover isso para /constants/theme.js
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "rgb(0, 95, 175)",
    onPrimary: "rgb(255, 255, 255)",
    // ... adicione mais cores
  },
};

export default function RootLayout() {
  return (
    // Envolve todo o app no Provider do React Native Paper
    <PaperProvider theme={theme}>
      <Stack>
        {/* O layout (tabs) é a tela principal */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Aqui você pode adicionar telas de Modal, Login, etc. */}
      </Stack>
    </PaperProvider>
  );
}
