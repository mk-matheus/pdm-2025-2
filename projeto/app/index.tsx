import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import Teclado from '@/components/Teclado';
import Forca from '@/components/Forca';

const palavras: string[] = [
  // Tecnologia e Programação
  'ALGORITMO', 'INTERFACE', 'BACKEND', 'FRONTEND', 'DATABASE', 'JAVASCRIPT',
  'PYTHON', 'FRAMEWORK', 'COMPILADOR', 'DEBUG', 'HARDWARE', 'SOFTWARE',
  'PROCESSADOR', 'MEMORIA', 'ROTEADOR', 'SERVIDOR', 'NUVEM', 'PIXEL',

  // Natureza e Meio Ambiente
  'CACHOEIRA', 'FLORESTA', 'OCEANO', 'GELEIRA', 'PANTANAL', 'AMAZONIA',
  'CATARATA', 'RECIFE', 'MANGUEZAL', 'ECOSSISTEMA', 'BIODIVERSIDADE',
  'SUSTENTABILIDADE', 'RECICLAGEM', 'POLUICAO', 'EROSAO', 'REFLORESTAMENTO',

  // Corpo Humano
  'CORACAO', 'CEREBRO', 'PULMAO', 'ESTOMAGO', 'INTESTINO', 'ESQUELETO',
  'MUSCULO', 'ARTERIA', 'NEURONIO', 'RETINA', 'FIGADO', 'PANCREAS',
  'ESOFAGO', 'TRAQUEIA', 'VERTEBRA', 'CUTICULA', 'DIAFRAGMA',

  // Cultura Pop (Filmes, Séries, Músicas)
  'JEDI', 'GANDALF', 'HOMIRANHA', 'BATMAN', 'MATRIX', 'HOGWARTS', 'JURASSIC',
  'TERMINATOR', 'AVENGERS', 'POKEMON', 'MARIO', 'ZELDA', 'SONIC', 'VADER',
  'SPOCK', 'SHERLOCK', 'DRACULA', 'FRANKENSTEIN', 'KINGKONG',

  // Culinária Brasileira
  'FEIJOADA', 'ACARAJE', 'MOQUECA', 'PAMONHA', 'VATAPA', 'COXINHA',
  'BRIGADEIRO', 'GUARANA', 'CAIPIRINHA', 'FAROFA', 'TAPIOCA', 'CARURU',
  'CHURRASCO', 'PAODEQUEIJO', 'CANJICA', 'DOBRADINHA', 'GALINHADA',

  // Instrumentos Musicais
  'VIOLAO', 'GUITARRA', 'BATERIA', 'TECLADO', 'FLAUTA', 'VIOLINO',
  'SAXOFONE', 'PANDEIRO', 'ACORDEAO', 'UKULELE', 'BERIMBAU', 'CAVAQUINHO',
  'CONTRABAIXO', 'TROMBONE', 'HARPA', 'GAITA', 'XILOFONE',

  // Mitologia e Folclore
  'SACI', 'CURUPIRA', 'IARA', 'LOBISOMEM', 'BOITATA', 'BOTOCORDEROSA',
  'ZEUS', 'THOR', 'ODIN', 'ANUBIS', 'MEDUSA', 'CENTAURO', 'MINOTAURO',
  'POSEIDON', 'HADES', 'PEGASO', 'CICLOPE', 'QUIMERA', 'FENIX',

  // Palavras mais complexas
  'ONOMATOPEIA', 'PROTAGONISTA', 'AMBIGUIDADE', 'DICOTOMIA', 'PARADIGMA',
  'METAMORFOSE', 'PROLIXO', 'UBIQUIDADE', 'CONCISO', 'EFEMERO', 'ANACRONISMO',
  'DETERMINISMO', 'FENOMENOLOGIA', 'PRAGMATISMO', 'EXISTENCIALISMO',
  'ESTRUTURALISMO', 'PARADOXO', 'JURISPRUDENCIA', 'EQUILIBRISTA',

  // Profissões
  'ASTRONAUTA', 'CIENTISTA', 'ARQUITETO', 'DESIGNER', 'ENGENHEIRO',
  'JORNALISTA', 'PSICOLOGO', 'ADVOGADO', 'DESENVOLVEDOR', 'GEOLOGO',
  'CONTADOR', 'ATOR', 'DIRETOR', 'ROTEIRISTA', 'ESCRITOR'
];

const MAX_ERROS = 10;

export default function App() {
  const [palavraSecreta, setPalavraSecreta] = useState('');
  const [letrasCorretas, setLetrasCorretas] = useState<string[]>([]);
  const [letrasIncorretas, setLetrasIncorretas] = useState<string[]>([]);
  const [statusJogo, setStatusJogo] = useState('jogando');

  const iniciarJogo = () => {
    const indiceAleatorio = Math.floor(Math.random() * palavras.length);
    const palavraSorteada = palavras[indiceAleatorio];
    setPalavraSecreta(palavraSorteada);
    setLetrasCorretas([]);
    setLetrasIncorretas([]);
    setStatusJogo('jogando');
  };

  useEffect(() => {
    iniciarJogo();
  }, []);

  useEffect(() => {
    if (palavraSecreta && statusJogo === 'jogando') {
      const todasLetrasAdivinhadas = palavraSecreta.split('').every(letra => letrasCorretas.includes(letra));
      if (todasLetrasAdivinhadas) {
        setStatusJogo('vitoria');
        Alert.alert('Parabéns!', 'Você acertou a palavra!');
      }

      if (letrasIncorretas.length >= MAX_ERROS) {
        setStatusJogo('derrota');
        Alert.alert('Que pena!', `Você perdeu! A palavra era: ${palavraSecreta}`);
      }
    }
  }, [letrasCorretas, letrasIncorretas, palavraSecreta, statusJogo]);


  const palavraMascarada = () => {
    if (!palavraSecreta) return '';
    if (statusJogo !== 'jogando') {
      return palavraSecreta.split('').join(' ');
    }
    return palavraSecreta
      .split('')
      .map(letra => (letrasCorretas.includes(letra) ? letra : '_'))
      .join(' ');
  };

  const handleLetraPressionada = (letra: string) => {
    if (statusJogo !== 'jogando' || letrasCorretas.includes(letra) || letrasIncorretas.includes(letra)) {
      return;
    }

    if (palavraSecreta.includes(letra)) {
      setLetrasCorretas([...letrasCorretas, letra]);
    } else {
      setLetrasIncorretas([...letrasIncorretas, letra]);
    }
  };

  const fimDeJogo = statusJogo !== 'jogando';

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Jogo da Forca</Text>

      <Forca numeroErros={letrasIncorretas.length} />
      
      <Text style={styles.palavra}>{palavraMascarada()}</Text>
      
      <View style={styles.letrasContainer}>
        <Text style={styles.letrasTexto}>
          Letras erradas: {letrasIncorretas.join(', ')}
        </Text>
      </View>
      
      {fimDeJogo ? (
        <>
          <Text style={[
              styles.mensagemFimDeJogo, 
              { color: statusJogo === 'vitoria' ? '#2ecc71' : '#e74c3c' }
            ]}>
            {statusJogo === 'vitoria' ? 'Você venceu! 🎉' : 'Você perdeu! 😢'}
          </Text>
          <TouchableOpacity style={styles.botaoReiniciar} onPress={iniciarJogo}>
            <Text style={styles.textoBotaoReiniciar}>Jogar Novamente</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Teclado 
          onLetraPressionada={handleLetraPressionada}
          letrasDesabilitadas={[...letrasCorretas, ...letrasIncorretas]} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC', // Um fundo branco-azulado suave
    padding: 10,
  },
  titulo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#34495e', // Azul escuro
    marginBottom: 20,
  },
  palavra: {
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 10,
    marginBottom: 20,
    color: '#2c3e50', // Quase preto
    textAlign: 'center'
  },
  letrasContainer: {
    minHeight: 30,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  letrasTexto: {
    fontSize: 18,
    color: '#e74c3c', // Vermelho para letras erradas
    fontWeight: '600',
    textAlign: 'center',
  },
  mensagemFimDeJogo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  botaoReiniciar: {
    backgroundColor: '#3498db', // Azul primário
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBotaoReiniciar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});