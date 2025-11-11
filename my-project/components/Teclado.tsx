import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type TecladoProps = {
  onLetraPressionada: (letra: string) => void;
  letrasDesabilitadas: string[];
};

export default function Teclado({ onLetraPressionada, letrasDesabilitadas }: TecladoProps) {
  return (
    <View style={styles.container}>
      {LETRAS.map((letra) => {
        const desabilitado = letrasDesabilitadas.includes(letra);

        return (
          <TouchableOpacity
            key={letra}
            style={[styles.botao, desabilitado && styles.botaoDesabilitado]}
            onPress={() => onLetraPressionada(letra)}
            disabled={desabilitado}
          >
            <Text style={[styles.textoBotao, desabilitado && styles.textoBotaoDesabilitado]}>{letra}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  botao: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 4,
    borderRadius: 12,
    // Sombra para um efeito "saltado"
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  botaoDesabilitado: {
    backgroundColor: '#bdc3c7', // Cinza claro
    elevation: 0,
  },
  textoBotao: {
    color: '#3498db', // Azul
    fontSize: 22,
    fontWeight: 'bold',
  },
  textoBotaoDesabilitado: {
    color: '#7f8c8d' // Cinza escuro
  }
});