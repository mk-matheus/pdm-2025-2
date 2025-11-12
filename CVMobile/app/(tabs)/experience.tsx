// CVMobile/app/(tabs)/experience.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert, ScrollView } from "react-native";
import {
  ActivityIndicator,
  Text,
  Button,
  FAB,
  Modal,
  Portal,
  TextInput,
  useTheme,
  Snackbar,
} from "react-native-paper";
import { Plus, AlertCircle } from "lucide-react-native";
import api from "../../services/api"; // Nosso serviço Axios
import ExperienceCard from "@/components/ExperienceCard"; // Nosso Card de Experiência
import { MY_PERSON_ID } from "@/constants/Config"; // Nosso ID central

// Usamos a constante global
const PERSON_ID = MY_PERSON_ID;

// Interface para o Experience (baseado no seu backend)
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

export default function ExperienceScreen() {
  const theme = useTheme();
  // Estados da tela
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  // Estados do Formulário (baseado no modelo)
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  // Estado do Snackbar (Toast)
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  // --- Funções de API (CRUD) ---

  // R (Read): Busca todas as experiências
  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // API: GET /people/:personId/experiences
      const response = await api.get<Experience[]>(
        `/people/${PERSON_ID}/experiences`
      );
      setExperiences(response.data);
    } catch (e: any) {
      console.error(e);
      setError("Falha ao carregar experiências. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Chama o fetch inicial
  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Limpa os campos do formulário
  const clearForm = () => {
    setCompanyName("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setEditingExperience(null);
  };

  // --- Funções Auxiliares do Modal ---

  // Abre o modal para EDITAR
  const handleOpenUpdateModal = (experience: Experience) => {
    setEditingExperience(experience);
    setCompanyName(experience.companyName);
    setRole(experience.role);
    setStartDate(experience.startDate || "");
    setEndDate(experience.endDate || "");
    setDescription(experience.description || "");
    setModalVisible(true);
  };

  // Abre o modal para CRIAR
  const handleOpenCreateModal = () => {
    clearForm();
    setModalVisible(true);
  };

  // C (Create) e U (Update): Salva a experiência
  const handleSaveExperience = async () => {
    // Validação básica
    if (!companyName || !role) {
      setSnackbar({
        visible: true,
        message: "Empresa e Cargo são obrigatórios.",
      });
      return;
    }

    setIsSubmitting(true);
    //
    const experienceData = {
      companyName,
      role,
      startDate: startDate || null, // Envia null se a string estiver vazia
      endDate: endDate || null,
      description: description || null,
    };

    try {
      if (editingExperience) {
        // --- LÓGICA DE UPDATE (PUT) ---
        // API: PUT /people/:personId/experiences/:experienceId
        await api.put(
          `/people/${PERSON_ID}/experiences/${editingExperience.objectId}`,
          experienceData
        );
        setSnackbar({ visible: true, message: "Experiência atualizada!" });
      } else {
        // --- LÓGICA DE CREATE (POST) ---
        // API: POST /people/:personId/experiences
        await api.post(`/people/${PERSON_ID}/experiences`, experienceData);
        setSnackbar({ visible: true, message: "Experiência adicionada!" });
      }

      setModalVisible(false);
      await fetchExperiences(); // Recarrega a lista
    } catch (e: any) {
      console.error(e);
      let errorMsg = "Erro ao salvar. Tente novamente.";
      if (e.response?.data?.errors) {
        errorMsg = e.response.data.errors[0].msg;
      }
      setSnackbar({ visible: true, message: errorMsg });
    } finally {
      setIsSubmitting(false);
      clearForm();
    }
  };

  // D (Delete): Deleta uma experiência
  const handleDeleteExperience = (experienceId: string, roleName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir a experiência "${roleName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // API: DELETE /people/:personId/experiences/:experienceId
              await api.delete(
                `/people/${PERSON_ID}/experiences/${experienceId}`
              );
              setSnackbar({ visible: true, message: "Experiência excluída!" });
              await fetchExperiences(); // Recarrega a lista
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
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true} size="large" />
          <Text style={{ marginTop: 10 }}>Carregando experiências...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <AlertCircle color={theme.colors.error} size={48} />
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchExperiences}>
            Tentar Novamente
          </Button>
        </View>
      );
    }

    return (
      <FlatList
        data={experiences}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <ExperienceCard
            experience={item}
            onEdit={() => handleOpenUpdateModal(item)}
            onDelete={() => handleDeleteExperience(item.objectId, item.role)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Nenhuma experiência profissional cadastrada.</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchExperiences}
        contentContainerStyle={
          experiences.length === 0
            ? styles.container
            : { paddingTop: 8, paddingBottom: 80 }
        }
      />
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Portal>
        {/* O Modal usa ScrollView para caber todos os campos */}
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            clearForm();
          }}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <ScrollView>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {editingExperience ? "Editar Experiência" : "Nova Experiência"}
            </Text>
            <TextInput
              label="Empresa"
              value={companyName}
              onChangeText={setCompanyName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Cargo"
              value={role}
              onChangeText={setRole}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Data de Início (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: 2022-01-30"
            />
            <TextInput
              label="Data de Término (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
              mode="outlined"
              style={styles.input}
              placeholder="Deixe em branco se for o atual"
            />
            <TextInput
              label="Descrição das Atividades"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={5}
            />
            <View style={styles.modalButtons}>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  clearForm();
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveExperience}
                loading={isSubmitting}
                style={{ marginLeft: 10 }}
              >
                Salvar
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {renderContent()}

      {!error && (
        <FAB
          icon={() => <Plus color={theme.colors.onPrimary} />}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleOpenCreateModal}
          color={theme.colors.onPrimary}
        />
      )}

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
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
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
    maxHeight: "90%", // Garante que o modal não saia da tela
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
