// CVMobile/components/ProjectCard.tsx
import React from "react";
import { View, Linking, Alert } from "react-native";
import { Card, IconButton, useTheme, Text } from "react-native-paper";
import {
  Github,
  Linkedin,
  Link,
  Trash2,
  ExternalLink,
} from "lucide-react-native";

// 1. Interface para o ExternalLink
interface ExternalLink {
  objectId: string;
  type: string;
  url: string;
  personId: string;
}

// 2. Propriedades do Card
type ProjectCardProps = {
  link: ExternalLink;
  onEdit: () => void;
  onDelete: () => void;
};

// 3. Helper para escolher o ícone certo
const getIconForType = (type: string, color: string, size: number) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("github")) {
    return <Github color={color} size={size} />;
  }
  if (lowerType.includes("linkedin")) {
    return <Linkedin color={color} size={size} />;
  }
  return <Link color={color} size={size} />; // Ícone padrão
};

// 4. Componente Card
const ProjectCard = ({ link, onEdit, onDelete }: ProjectCardProps) => {
  const theme = useTheme();

  // Função para abrir o link no navegador
  const handleOpenUrl = async () => {
    try {
      const supported = await Linking.canOpenURL(link.url);
      if (supported) {
        await Linking.openURL(link.url);
      } else {
        Alert.alert("Erro", `Não é possível abrir esta URL: ${link.url}`);
      }
    } catch (error) {
      console.error("Erro ao abrir URL", error);
      Alert.alert("Erro", "Não foi possível abrir o link.");
    }
  };

  return (
    // Card inteiro é clicável para EDITAR
    <Card
      style={{ marginHorizontal: 16, marginVertical: 8, elevation: 3 }}
      onPress={onEdit}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 8,
        }}
      >
        {/* Ícone e Textos */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {getIconForType(link.type, theme.colors.primary, 28)}
          <View style={{ paddingVertical: 16, marginLeft: 16, flexShrink: 1 }}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {link.type}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {link.url}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={{ flexDirection: "row" }}>
          {/* Botão de Abrir Link */}
          <IconButton
            icon={() => (
              <ExternalLink color={theme.colors.secondary} size={24} />
            )}
            onPress={handleOpenUrl}
            onPressIn={(e) => e.stopPropagation()} // Impede o "onEdit"
          />
          {/* Botão de Deletar */}
          <IconButton
            icon={() => <Trash2 color={theme.colors.error} size={24} />}
            onPress={onDelete}
            onPressIn={(e) => e.stopPropagation()} // Impede o "onEdit"
          />
        </View>
      </View>
    </Card>
  );
};

export default ProjectCard;
