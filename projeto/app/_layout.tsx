import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // 1. Adicionado um título de texto no lugar do ícone
          title: 'Jogo da Forca',
          
          // 2. A propriedade 'headerTitle' com o ícone foi removida
          
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}