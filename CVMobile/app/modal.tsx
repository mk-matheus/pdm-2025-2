// CVMobile/app/modal.tsx (CORRIGIDO)
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper"; // 1. Usando Paper

export default function ModalScreen() {
  const theme = useTheme(); // 2. Pegando nosso tema (aqui funciona!)

  return (
    // 3. Aplicando a cor de fundo do tema
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Modal
      </Text>
      <View
        style={[
          styles.separator,
          { backgroundColor: theme.colors.onSurfaceVariant }, // Cor do tema
        ]}
      />
      <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
        Esta é uma tela modal global.
      </Text>

      {/* 4. Removemos o 'EditScreenInfo' */}

      {/* O Status bar deve ser 'light' em fundos escuros e 'dark' em fundos claros */}
      <StatusBar style={theme.dark ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
