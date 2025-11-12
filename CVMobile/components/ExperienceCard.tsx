// CVMobile/components/ExperienceCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, IconButton, useTheme, Text } from "react-native-paper";
import { Briefcase, Trash2 } from "lucide-react-native";

// 1. Interface para o Experience (baseado no seu backend)
//
interface Experience {
  objectId: string;
  companyName: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  personId: string;
}

// 2. Propriedades que o Card espera receber
type ExperienceCardProps = {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
};

// 3. Função auxiliar para formatar datas (YYYY-MM-DD para MM/YYYY)
const formatDate = (dateString?: string) => {
  if (!dateString) return "?";
  //
  try {
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  } catch (e) {
    return dateString; // Fallback
  }
};

// 4. O Componente do Card
const ExperienceCard = ({
  experience,
  onEdit,
  onDelete,
}: ExperienceCardProps) => {
  const theme = useTheme();

  const period =
    experience.startDate || experience.endDate
      ? `${formatDate(experience.startDate)} - ${
          experience.endDate ? formatDate(experience.endDate) : "Atual"
        }`
      : "Período não informado";

  return (
    // O Card inteiro é clicável para EDITAR
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onEdit}
    >
      <View style={styles.cardContent}>
        {/* Ícone (fixo para Experiência) */}
        <View style={styles.leftIcon}>
          <Briefcase color={theme.colors.primary} size={32} />
        </View>

        {/* Textos */}
        <View style={styles.textContainer}>
          {/* Título Principal (Cargo) */}
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface }}
            numberOfLines={2}
          >
            {experience.role}
          </Text>

          {/* Subtítulo (Empresa) */}
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}
            numberOfLines={1}
          >
            {experience.companyName}
          </Text>

          {/* Período */}
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurfaceVariant,
              fontStyle: "italic",
            }}
          >
            {period}
          </Text>

          {/* Descrição (só aparece se existir) */}
          {experience.description && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
              numberOfLines={3} // Limita a 3 linhas no card
              ellipsizeMode="tail"
            >
              {experience.description}
            </Text>
          )}
        </View>

        {/* Botão de Deletar */}
        <View style={styles.rightAction}>
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

// --- Estilos ---
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    // Usamos 'flex-start' para o botão de lixo ficar alinhado ao topo
    // caso a descrição seja muito grande.
    alignItems: "flex-start",
  },
  leftIcon: {
    padding: 16,
    paddingTop: 20, // Um pouco mais de padding superior para o ícone
    justifyContent: "flex-start",
  },
  textContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 8,
  },
  rightAction: {
    marginLeft: "auto",
    paddingRight: 8,
    paddingTop: 8, // Alinha o botão de lixo com o topo do texto
  },
});

export default ExperienceCard;
