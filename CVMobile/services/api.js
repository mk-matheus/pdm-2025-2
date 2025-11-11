// services/api.js
import axios from "axios";

// Pega a URL base das variáveis de ambiente
const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.error("ERRO: EXPO_PUBLIC_API_URL não está definida no .env");
  // Você pode lançar um erro ou definir uma URL padrão de fallback aqui
}

const api = axios.create({
  baseURL: baseURL,
  timeout: 15000, // 15 segundos de timeout
});

// Interceptor para lidar com erros de forma global (opcional, mas bom)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode adicionar lógica para toasts de erro
    console.error("Erro na requisição API:", error);
    return Promise.reject(error);
  }
);

export default api;
