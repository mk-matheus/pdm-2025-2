// CVMobile/app/(tabs)/_layout.tsx (ATUALIZADO COM HEADER DINÂMICO)
import { Tabs } from "expo-router";
import { Appbar, useTheme } from "react-native-paper";
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  ListChecks,
  Github,
  Sun, // 1. Ícone para Modo Claro
  Moon, // 2. Ícone para Modo Escuro
} from "lucide-react-native";
import { useCustomTheme } from "@/contexts/ThemeContext"; // 3. Importamos o hook do tema

// 4. Componente auxiliar para o Header da Home (necessário para usar o hook)
const HomeHeader = () => {
  const theme = useTheme();
  // 5. Pegamos o tema ATIVO e a função para MUDAR
  const { effectiveTheme, setThemePreference } = useCustomTheme();
  const isDark = effectiveTheme === "dark";

  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.surface,
        elevation: 2,
      }}
    >
      <Appbar.Content title="Início" />
      {/* 6. Este é o novo "botão" (Switch) de tema */}
      <Appbar.Action
        icon={() =>
          isDark ? (
            <Sun color={theme.colors.onSurface} />
          ) : (
            <Moon color={theme.colors.onSurface} />
          )
        }
        onPress={() => setThemePreference(isDark ? "light" : "dark")}
      />
    </Appbar.Header>
  );
};

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
      {/* --- TELA INÍCIO (ATUALIZADA) --- */}
      <Tabs.Screen
        name="index" //
        options={{
          // 7. Usamos nosso novo componente de Header
          header: () => <HomeHeader />,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      {/* --- TELA SOBRE --- */}
      <Tabs.Screen
        name="about"
        options={{
          header: () => (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.surface, elevation: 2 }}
            >
              <Appbar.Content title="Sobre" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

      {/* ... (Restante das suas abas: experience, education, skills, projects) ... */}
      {/* ... (Certifique-se de que elas também usam o Appbar.Header) ... */}

      <Tabs.Screen
        name="experience"
        options={{
          header: () => (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.surface, elevation: 2 }}
            >
              <Appbar.Content title="Experiência" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => (
            <Briefcase color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          header: () => (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.surface, elevation: 2 }}
            >
              <Appbar.Content title="Formação" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => (
            <GraduationCap color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          header: () => (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.surface, elevation: 2 }}
            >
              <Appbar.Content title="Habilidades" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => (
            <ListChecks color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          header: () => (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.surface, elevation: 2 }}
            >
              <Appbar.Content title="Projetos" />
            </Appbar.Header>
          ),
          tabBarIcon: ({ color, size }) => <Github color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
