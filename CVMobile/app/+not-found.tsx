// CVMobile/app/+not-found.tsx (CORREÇÃO FINAL)
import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native"; // 1. Apenas react-native

export default function NotFoundScreen() {
  // 2. Não podemos usar useTheme() aqui
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      {/* 3. Usamos um estilo simples, sem tema */}
      <View style={styles.container}>
        <Text style={styles.title}>Esta tela não existe.</Text>

        {/* AQUI ESTÁ A CORREÇÃO: href="/home" */}
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Ir para a tela inicial</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", // Fundo branco "chumbado"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000", // Texto preto "chumbado"
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7", // Cor de link padrão
  },
});
