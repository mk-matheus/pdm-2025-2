// CVMobile/contexts/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// A preferência do usuário pode ser 'claro', 'escuro' ou 'automático'
type ThemePreference = "system" | "light" | "dark";
const THEME_STORAGE_KEY = "themePreference";

// 1. Define o "formato" do nosso contexto
interface ThemeContextType {
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  // O effectiveTheme é o tema que está REALMENTE ativo
  // (ex: 'light' ou 'dark')
  effectiveTheme: "light" | "dark";
}

// 2. Cria o Contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Cria o "Provedor" (CustomThemeProvider)
export const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("system");
  const systemTheme = useColorScheme() ?? "light"; // Pega o tema do celular

  // Este useEffect roda UMA VEZ quando o app é iniciado
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedPreference = (await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        )) as ThemePreference;
        if (storedPreference) {
          setThemePreference(storedPreference);
        }
      } catch (e) {
        console.error("Falha ao carregar preferência de tema", e);
      }
    };
    loadThemePreference();
  }, []);

  // Salva a preferência no AsyncStorage sempre que ela mudar
  const handleSetThemePreference = async (preference: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
      setThemePreference(preference);
    } catch (e) {
      console.error("Falha ao salvar preferência de tema", e);
    }
  };

  // Esta é a lógica principal:
  // Se a preferência for 'system', usamos o tema do celular.
  // Senão, forçamos o tema 'light' ou 'dark'.
  const effectiveTheme =
    themePreference === "system" ? systemTheme : themePreference;

  const value = {
    themePreference,
    setThemePreference: handleSetThemePreference,
    effectiveTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// 4. Cria o "Hook" (useCustomTheme)
export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useCustomTheme deve ser usado dentro de um CustomThemeProvider"
    );
  }
  return context;
};
