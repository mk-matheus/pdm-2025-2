// CVMobile/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Appbar, useTheme } from "react-native-paper";
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  ListChecks,
} from "lucide-react-native";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}
    >
      {/* --- TELA INÍCIO --- */}
      <Tabs.Screen
        name="index"
        options={{
          header: () => (
            <Appbar.Header
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 2, // Movido para dentro do 'style'
              }}
            >
              <Appbar.Content title="Início" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      {/* --- TELA SOBRE --- */}
      <Tabs.Screen
        name="about"
        options={{
          header: () => (
            <Appbar.Header
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 2, // Movido para dentro do 'style'
              }}
            >
              <Appbar.Content title="Sobre" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

      {/* --- TELA EXPERIÊNCIA --- */}
      <Tabs.Screen
        name="experience"
        options={{
          header: () => (
            <Appbar.Header
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 2, // Movido para dentro do 'style'
              }}
            >
              <Appbar.Content title="Experiência" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => (
            <Briefcase color={color} size={size} />
          ),
        }}
      />

      {/* --- TELA FORMAÇÃO --- */}
      <Tabs.Screen
        name="education"
        options={{
          header: () => (
            <Appbar.Header
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 2, // Movido para dentro do 'style'
              }}
            >
              <Appbar.Content title="Formação" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => (
            <GraduationCap color={color} size={size} />
          ),
        }}
      />

      {/* --- TELA HABILIDADES (ANTIGA PROJETOS) --- */}
      <Tabs.Screen
        name="projects"
        options={{
          header: () => (
            <Appbar.Header
              style={{
                backgroundColor: theme.colors.surface,
                elevation: 2, // Movido para dentro do 'style'
              }}
            >
              <Appbar.Content title="Habilidades" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => (
            <ListChecks color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
