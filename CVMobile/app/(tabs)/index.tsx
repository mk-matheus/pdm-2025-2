// CVMobile/app/(tabs)/index.tsx (VERSÃO FINAL)
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme, Avatar } from "react-native-paper";
// Não precisamos mais do useCustomTheme ou Switch aqui

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Imagem de Perfil */}
      <Avatar.Image
        size={140} // Um pouco maior para destaque
        source={require("@/assets/images/profile.jpg")}
        style={{ marginBottom: 24 }}
      />

      {/* Saudação (Como você pediu) */}
      <Text
        variant="headlineMedium"
        style={[styles.title, { color: theme.colors.onBackground }]}
      >
        Olá, eu sou Matheus!
      </Text>

      {/* Subtítulo */}
      <Text
        variant="bodyLarge"
        style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        Desenvolvedor Fullstack
      </Text>

      {/* Rodapé (Como você pediu) */}
      <View style={styles.footer}>
        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Desenvolvido com React Native, Expo e React Native Paper
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
  },
  footer: {
    position: "absolute", // Fixa o rodapé na base
    bottom: 20,
  },
});
