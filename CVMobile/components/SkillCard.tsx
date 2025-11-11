// components/SkillCard.tsx
import React from "react";
import { View } from "react-native";
import { Card, IconButton, useTheme, Text } from "react-native-paper";
import { Package, Trash2 } from "lucide-react-native";

// Precisamos saber o "formato" (shape) da skill
// Esta é a mesma interface do seu projects.tsx
interface Skill {
  objectId: string;
  name: string;
  level: string;
  personId: string;
}

// Definimos as propriedades que o Card espera receber
type SkillCardProps = {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
};

const SkillCard = ({ skill, onEdit, onDelete }: SkillCardProps) => {
  const theme = useTheme();

  return (
    // O Card inteiro é clicável para EDITAR
    <Card
      style={{ marginHorizontal: 16, marginVertical: 8, elevation: 3 }}
      onPress={onEdit}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16, // Espaço para o ícone
          paddingRight: 8, // Espaço para o botão
        }}
      >
        {/* Ícone e Textos */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Package
            color={theme.colors.primary}
            size={28}
            style={{ marginRight: 16 }}
          />
          <View style={{ paddingVertical: 16 }}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {skill.name}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {skill.level}
            </Text>
          </View>
        </View>

        {/* Botão de Deletar */}
        <IconButton
          icon={() => <Trash2 color={theme.colors.error} size={24} />}
          onPress={onDelete}
          // Esta é a parte mágica: impede que o clique no lixo
          // acione o "onPress" de edição do Card.
          onPressIn={(e) => e.stopPropagation()}
        />
      </View>
    </Card>
  );
};

export default SkillCard;
