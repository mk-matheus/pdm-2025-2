// CVMobile/components/EducationCard.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, IconButton, useTheme, Text } from "react-native-paper";
import { GraduationCap, Trash2 } from "lucide-react-native";

// 1. Interface para o Education (baseado no seu backend)
//
interface Education {
  objectId: string;
  institutionName: string;
  course: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  personId: string;
}

// 2. Propriedades que o Card espera receber
type EducationCardProps = {
  education: Education;
  onEdit: () => void;
  onDelete: () => void;
};

// 3. Função auxiliar para formatar datas (opcional, mas melhora a UI)
const formatDate = (dateString?: string) => {
  if (!dateString) return "?";
  // O backend salva como DATEONLY (YYYY-MM-DD)
  //
  try {
    const [year, month] = dateString.split("-");
    return `${month}/${year}`;
  } catch (e) {
    return dateString; // Fallback
  }
};

// 4. O Componente do Card
const EducationCard = ({ education, onEdit, onDelete }: EducationCardProps) => {
  const theme = useTheme();

  const period =
    education.startDate || education.endDate
      ? `${formatDate(education.startDate)} - ${
          education.endDate ? formatDate(education.endDate) : "Atual"
        }`
      : "Período não informado";

  return (
    // O Card inteiro é clicável para EDITAR
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onEdit}
    >
      <View style={styles.cardContent}>
        {/* Ícone (fixo para Formação) */}
        <View style={styles.leftIcon}>
          <GraduationCap color={theme.colors.primary} size={32} />
        </View>

        {/* Textos */}
        <View style={styles.textContainer}>
          {/* Título Principal (Curso) */}
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface }}
            numberOfLines={2}
          >
            {education.course}
          </Text>

          {/* Subtítulo (Instituição) */}
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
            numberOfLines={1}
          >
            {education.institutionName}
          </Text>

          {/* Período e Status */}
          <View style={styles.detailsContainer}>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {period}
            </Text>
            {/* Mostra o status apenas se ele existir */}
            {education.status && (
              <Text
                variant="bodySmall"
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                    color: theme.colors.onPrimaryContainer,
                  },
                ]}
              >
                {education.status}
              </Text>
            )}
          </View>
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
    alignItems: "center",
  },
  leftIcon: {
    padding: 16,
    justifyContent: "center",
  },
  textContainer: {
    flex: 1, // Ocupa o espaço disponível
    paddingVertical: 16,
    paddingRight: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap", // Permite que o status quebre a linha se necessário
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    overflow: "hidden", // Garante o borderRadius
    fontWeight: "bold",
  },
  rightAction: {
    marginLeft: "auto", // Empurra para a direita
    paddingRight: 8,
  },
});

export default EducationCard;
