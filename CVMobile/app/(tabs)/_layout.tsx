// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react-native"; // Nossos ícones

export default function TabsLayout() {
  const theme = useTheme(); // Agora podemos usar o hook do Paper!

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Tabs.Screen
        name="index" // aponta para app/(tabs)/index.tsx
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="about" // **ERRO 2:** Crie este arquivo! (app/(tabs)/about.tsx)
        options={{
          title: "Sobre",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="experience" // **ERRO 3:** Crie este arquivo! (app/(tabs)/experience.tsx)
        options={{
          title: "Experiência",
          tabBarIcon: ({ color, size }) => (
            <Briefcase color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="education" // **ERRO 4:** Crie este arquivo! (app/(tabs)/education.tsx)
        options={{
          title: "Formação",
          tabBarIcon: ({ color, size }) => (
            <GraduationCap color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects" // **ERRO 5:** Renomeie 'two.tsx' para 'projects.tsx'
        options={{
          title: "Projetos",
          tabBarIcon: ({ color, size }) => (
            <Sparkles color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
