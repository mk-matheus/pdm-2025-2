// CVMobile/app/(tabs)/education.tsx
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
import EducationCard from "@/components/EducationCard"; // Nosso Card de Formação
import { MY_PERSON_ID } from "@/constants/Config"; // Nosso ID central

// Usamos a constante global
const PERSON_ID = MY_PERSON_ID;

// Interface para o Education (baseado no seu backend)
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

export default function EducationScreen() {
  const theme = useTheme();
  // Estados da tela
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  // Estados do Formulário
  const [institutionName, setInstitutionName] = useState("");
  const [course, setCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  // Estado do Snackbar (Toast)
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  // --- Funções de API (CRUD) ---

  // R (Read): Busca todas as formações
  const fetchEducations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // API: GET /people/:personId/educations
      const response = await api.get<Education[]>(
        `/people/${PERSON_ID}/educations`
      );
      setEducations(response.data);
    } catch (e: any) {
      console.error(e);
      setError("Falha ao carregar formações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Chama o fetch inicial
  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  // Limpa os campos do formulário
  const clearForm = () => {
    setInstitutionName("");
    setCourse("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setEditingEducation(null);
  };

  // --- Funções Auxiliares do Modal ---

  // Abre o modal para EDITAR
  const handleOpenUpdateModal = (education: Education) => {
    setEditingEducation(education);
    setInstitutionName(education.institutionName);
    setCourse(education.course);
    setStartDate(education.startDate || "");
    setEndDate(education.endDate || "");
    setStatus(education.status || "");
    setModalVisible(true);
  };

  // Abre o modal para CRIAR
  const handleOpenCreateModal = () => {
    clearForm();
    setModalVisible(true);
  };

  // C (Create) e U (Update): Salva a formação
  const handleSaveEducation = async () => {
    // Validação básica
    if (!institutionName || !course) {
      setSnackbar({
        visible: true,
        message: "Instituição e Curso são obrigatórios.",
      });
      return;
    }

    setIsSubmitting(true);
    //
    const educationData = {
      institutionName,
      course,
      startDate: startDate || null, // Envia null se a string estiver vazia
      endDate: endDate || null,
      status: status || null,
    };

    try {
      if (editingEducation) {
        // --- LÓGICA DE UPDATE (PUT) ---
        // API: PUT /people/:personId/educations/:educationId
        await api.put(
          `/people/${PERSON_ID}/educations/${editingEducation.objectId}`,
          educationData
        );
        setSnackbar({ visible: true, message: "Formação atualizada!" });
      } else {
        // --- LÓGICA DE CREATE (POST) ---
        // API: POST /people/:personId/educations
        await api.post(`/people/${PERSON_ID}/educations`, educationData);
        setSnackbar({ visible: true, message: "Formação adicionada!" });
      }

      setModalVisible(false);
      await fetchEducations(); // Recarrega a lista
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

  // D (Delete): Deleta uma formação
  const handleDeleteEducation = (educationId: string, courseName: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Você tem certeza que deseja excluir a formação "${courseName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              // API: DELETE /people/:personId/educations/:educationId
              await api.delete(
                `/people/${PERSON_ID}/educations/${educationId}`
              );
              setSnackbar({ visible: true, message: "Formação excluída!" });
              await fetchEducations(); // Recarrega a lista
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
          <Text style={{ marginTop: 10 }}>Carregando formações...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <AlertCircle color={theme.colors.error} size={48} />
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchEducations}>
            Tentar Novamente
          </Button>
        </View>
      );
    }

    return (
      <FlatList
        data={educations}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <EducationCard
            education={item}
            onEdit={() => handleOpenUpdateModal(item)}
            onDelete={() => handleDeleteEducation(item.objectId, item.course)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Nenhuma formação acadêmica cadastrada.</Text>
          </View>
        }
        refreshing={loading}
        onRefresh={fetchEducations}
        contentContainerStyle={
          educations.length === 0
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
        {/* O Modal usa ScrollView para caber os 5 campos */}
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
              {editingEducation ? "Editar Formação" : "Nova Formação"}
            </Text>
            <TextInput
              label="Instituição"
              value={institutionName}
              onChangeText={setInstitutionName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Curso"
              value={course}
              onChangeText={setCourse}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Data de Início (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: 2020-01-30"
            />
            <TextInput
              label="Data de Término (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
              mode="outlined"
              style={styles.input}
              placeholder="Deixe em branco se estiver cursando"
            />
            <TextInput
              label="Status"
              value={status}
              onChangeText={setStatus}
              mode="outlined"
              style={styles.input}
              placeholder="Ex: Concluído, Cursando"
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
                onPress={handleSaveEducation}
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
