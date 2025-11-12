import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import {
  ActivityIndicator,
  Text,
  List,
  Button,
  FAB,
  Modal,
  Portal,
  TextInput,
  useTheme,
  Snackbar,
  IconButton,
} from "react-native-paper";
import {
  Package,
  Plus,
  AlertCircle,
  Trash2,
  ListChecks,
} from "lucide-react-native";
import api from "../../services/api"; // Nosso serviço Axios
import SkillCard from "@/components/SkillCard"; // Importando o novo Card
import { MY_PERSON_ID } from "@/constants/Config";

// Substitua pelo ID de uma pessoa que EXISTE no seu banco de dados
const PERSON_ID = MY_PERSON_ID;

// Definindo o tipo de uma Skill
interface Skill {
  objectId: string;
  name: string;
  level: string;
  personId: string;
}

export default function ProjectsScreen() {
  const theme = useTheme();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estado do Modal ---
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("");

  // Guarda a skill que está sendo editada (ou null se for criação)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // --- Estado do Snackbar (Toast) ---
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  // --- Funções de API ---

  // R (Read): Busca todas as skills
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // A API de busca é: GET /people/:personId/skills
      const response = await api.get<Skill[]>(`/people/${PERSON_ID}/skills`);
      setSkills(response.data);
    } catch (e: any) {
      console.error(e);
      if (e.response?.status === 404) {
        setError(`Pessoa com ID ${PERSON_ID} não encontrada. Verifique o ID.`);
      } else {
        setError("Falha ao carregar habilidades. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Chama o fetch inicial
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // --- Funções Auxiliares do Modal ---

  // Abre o modal para EDITAR uma skill existente
  const handleOpenUpdateModal = (skill: Skill) => {
    setEditingSkill(skill); // Define a skill que estamos editando
    setNewSkillName(skill.name); // Preenche o formulário
    setNewSkillLevel(skill.level); // Preenche o formulário
    setModalVisible(true); // Abre o modal
  };

  // Abre o modal para CRIAR uma nova skill
  const handleOpenCreateModal = () => {
    setEditingSkill(null); // Garante que não estamos editando
    setNewSkillName(""); // Limpa o formulário
    setNewSkillLevel(""); // Limpa o formulário
    setModalVisible(true); // Abre o modal
  };

  // C (Create) e U (Update): Salva a skill (nova ou editada)
  const handleSaveSkill = async () => {
    if (!newSkillName || !newSkillLevel) {
      setSnackbar({ visible: true, message: "Preencha todos os campos." });
      return;
    }

    setIsSubmitting(true);
    const skillData = {
      name: newSkillName,
      level: newSkillLevel,
    };

    try {
      if (editingSkill) {
        // --- LÓGICA DE UPDATE (PUT) ---
        // A API de update é: PUT /people/:personId/skills/:skillId
        await api.put(
          `/people/${PERSON_ID}/skills/${editingSkill.objectId}`,
          skillData
        );
        setSnackbar({ visible: true, message: "Habilidade atualizada!" });
      } else {
        // --- LÓGICA DE CREATE (POST) ---
        // A API de create é: POST /people/:personId/skills
        await api.post(`/people/${PERSON_ID}/skills`, skillData);
        setSnackbar({ visible: true, message: "Habilidade adicionada!" });
      }

      setModalVisible(false);
      await fetchSkills(); // Re-busca a lista atualizada
    } catch (e: any) {
      console.error(e);
      let errorMsg = "Erro ao salvar. Tente novamente.";
      if (e.response?.data?.errors) {
        // Pega o erro de validação do express-validator
        errorMsg = e.response.data.errors[0].msg;
      }
      setSnackbar({
        visible: true,
        message: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
      setEditingSkill(null); // Limpa o estado de edição
      setNewSkillName("");
      setNewSkillLevel("");
    }
  };

  // D (Delete): Deleta uma skill
  const handleDelete = (skillId: string, skillName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir a habilidade "${skillName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // A API de delete é: DELETE /people/:personId/skills/:skillId
              await api.delete(`/people/${PERSON_ID}/skills/${skillId}`);
              setSnackbar({ visible: true, message: "Habilidade excluída!" });
              await fetchSkills(); // Recarrega a lista
            } catch (e: any) {
              console.error("Erro ao deletar:", e);
              setSnackbar({
                visible: true,
                message: "Erro ao excluir. Tente novamente.",
              });
            }
          },
        },
      ]
    );
  };

  // --- Renderização ---

  // Renderiza o conteúdo principal (Loading, Erro ou a Lista)
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true} size="large" />
          <Text style={{ marginTop: 10 }}>Carregando habilidades...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <AlertCircle color={theme.colors.error} size={48} />
          <Text
            style={{
              color: theme.colors.error,
              textAlign: "center",
              marginVertical: 15,
            }}
            variant="bodyLarge"
          >
            {error}
          </Text>
          <Button mode="contained" onPress={fetchSkills}>
            Tentar Novamente
          </Button>
        </View>
      );
    }

    return (
      <FlatList
        data={skills}
        keyExtractor={(item) => item.objectId}
        // Usamos nosso novo componente SkillCard
        renderItem={({ item }) => (
          <SkillCard
            skill={item}
            onEdit={() => handleOpenUpdateModal(item)}
            onDelete={() => handleDelete(item.objectId, item.name)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Nenhuma habilidade cadastrada.</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchSkills}
        // Adicionamos padding para o FAB não cobrir o último card
        contentContainerStyle={
          skills.length === 0
            ? styles.container // Mantém o "Nenhum item" centralizado
            : { paddingTop: 8, paddingBottom: 80 } // Adiciona espaço
        }
      />
    );
  };

  // JSX Principal do Componente
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* 1. Portal para o Modal flutuar */}
      <Portal>
        {/* 2. Modal de Adicionar/Editar */}
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            setEditingSkill(null); // Limpa o estado ao fechar
          }}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {editingSkill ? "Editar Habilidade" : "Nova Habilidade"}
          </Text>
          <TextInput
            label="Nome da Habilidade (ex: React Native)"
            value={newSkillName}
            onChangeText={setNewSkillName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Nível (ex: Avançado)"
            value={newSkillLevel}
            onChangeText={setNewSkillLevel}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button
              onPress={() => {
                setModalVisible(false);
                setEditingSkill(null); // Limpa o estado ao cancelar
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              // Ação de CREATE (C) / UPDATE (U)
              onPress={handleSaveSkill}
              loading={isSubmitting}
              style={{ marginLeft: 10 }}
            >
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* 3. A Lista de Skills (R) */}
      {renderContent()}

      {/* 4. O Botão Flutuante (FAB) para Ação de CREATE (C) */}
      {!error && (
        <FAB
          icon={() => <Plus color={theme.colors.onPrimary} />}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleOpenCreateModal}
          color={theme.colors.onPrimary}
        />
      )}

      {/* 5. O Snackbar (Toast de feedback) */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
});
