// CVMobile/app/(tabs)/about.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
import { Plus, AlertCircle, Pencil } from "lucide-react-native";
import api from "../../services/api"; // Nosso serviço Axios
import { MY_PERSON_ID } from "@/constants/Config"; // Nosso ID central

// Usamos a constante global
const PERSON_ID = MY_PERSON_ID;

// Interface para o Resume (baseado no seu backend)
//
interface Resume {
  objectId: string;
  title: string;
  summary: string;
  personId: string;
}

export default function AboutScreen() {
  const theme = useTheme();
  // Estados da tela
  // Como só temos UM resumo, não é um array
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [resumeSummary, setResumeSummary] = useState("");

  // Estado do Snackbar (Toast)
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  // --- Funções de API (CRUD) ---

  // R (Read): Busca o resumo
  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // API: GET /people/:personId/resumes
      const response = await api.get<Resume[]>(`/people/${PERSON_ID}/resumes`);
      // Pega o *primeiro* resumo da lista, se existir
      if (response.data && response.data.length > 0) {
        setResume(response.data[0]);
      } else {
        setResume(null); // Nenhum resumo encontrado
      }
    } catch (e: any) {
      console.error(e);
      setError("Falha ao carregar o resumo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Chama o fetch inicial
  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  // --- Funções Auxiliares do Modal ---

  // Abre o modal, preenchendo com dados existentes (se houver)
  const handleOpenModal = () => {
    if (resume) {
      // Estamos editando: preenche o formulário
      setResumeTitle(resume.title);
      setResumeSummary(resume.summary);
    } else {
      // Estamos criando: limpa o formulário
      setResumeTitle("");
      setResumeSummary("");
    }
    setModalVisible(true);
  };

  // C (Create) e U (Update): Salva o resumo
  const handleSaveResume = async () => {
    if (!resumeTitle || !resumeSummary) {
      setSnackbar({ visible: true, message: "Preencha todos os campos." });
      return;
    }

    setIsSubmitting(true);
    const resumeData = {
      title: resumeTitle,
      summary: resumeSummary,
    };

    try {
      if (resume) {
        // --- LÓGICA DE UPDATE (PUT) ---
        // API: PUT /people/:personId/resumes/:resumeId
        await api.put(
          `/people/${PERSON_ID}/resumes/${resume.objectId}`,
          resumeData
        );
        setSnackbar({ visible: true, message: "Resumo atualizado!" });
      } else {
        // --- LÓGICA DE CREATE (POST) ---
        // API: POST /people/:personId/resumes
        await api.post(`/people/${PERSON_ID}/resumes`, resumeData);
        setSnackbar({ visible: true, message: "Resumo criado!" });
      }

      setModalVisible(false);
      await fetchResume(); // Recarrega os dados
    } catch (e: any) {
      console.error(e);
      let errorMsg = "Erro ao salvar. Tente novamente.";
      if (e.response?.data?.errors) {
        errorMsg = e.response.data.errors[0].msg;
      }
      setSnackbar({ visible: true, message: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderização ---

  // Sub-componente para renderizar o conteúdo (Loading, Erro ou Texto)
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <AlertCircle color={theme.colors.error} size={48} />
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchResume}>
            Tentar Novamente
          </Button>
        </View>
      );
    }

    if (!resume) {
      return (
        <View style={styles.center}>
          <Text variant="bodyLarge">
            Nenhum resumo profissional cadastrado.
          </Text>
          <Text variant="bodySmall" style={{ marginTop: 8 }}>
            Clique no botão '+' para adicionar um.
          </Text>
        </View>
      );
    }

    // Se tiver dados, exibe o resumo
    return (
      <View style={styles.contentContainer}>
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          {resume.title}
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.summary, { color: theme.colors.onBackground }]}
        >
          {resume.summary}
        </Text>
      </View>
    );
  };

  // JSX Principal da Tela
  return (
    // Usamos ScrollView para o caso do texto ser muito longo
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {resume ? "Editar Resumo" : "Criar Resumo"}
          </Text>
          <TextInput
            label="Seu Título Profissional"
            value={resumeTitle}
            onChangeText={setResumeTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Seu Resumo (Sobre mim)"
            value={resumeSummary}
            onChangeText={setResumeSummary}
            mode="outlined"
            style={styles.input}
            multiline // Permite múltiplas linhas
            numberOfLines={10} // Define uma altura inicial
          />
          <View style={styles.modalButtons}>
            <Button
              onPress={() => setModalVisible(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveResume}
              loading={isSubmitting}
              style={{ marginLeft: 10 }}
            >
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Renderiza o conteúdo (Loading/Erro/Resumo) */}
      {renderContent()}

      {/* Botão Flutuante (FAB) */}
      {!loading && !error && (
        <FAB
          // Ícone muda: 'Pencil' (Editar) se já existe, 'Plus' (Adicionar) se não
          icon={() =>
            resume ? (
              <Pencil color={theme.colors.onPrimary} />
            ) : (
              <Plus color={theme.colors.onPrimary} />
            )
          }
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleOpenModal}
          color={theme.colors.onPrimary}
        />
      )}

      {/* Snackbar (Toast) */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Importante para o ScrollView
  },
  contentContainer: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24, // Melhora a legibilidade
  },
  errorText: {
    color: "red", // Cor de erro (será sobreposta pelo tema, mas bom ter)
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
