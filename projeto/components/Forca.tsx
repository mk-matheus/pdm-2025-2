import React from 'react';
import { View, StyleSheet } from 'react-native';

type ForcaProps = {
  numeroErros: number;
};

export default function Forca({ numeroErros }: ForcaProps) {
  return (
    <View style={styles.container}>
      {/* Estrutura da Forca */}
      <View style={styles.base} />
      <View style={styles.posteVertical} />
      <View style={styles.vigaHorizontal} />
      <View style={styles.corda} />

      {/* Partes do boneco */}
      {numeroErros > 0 && <View style={styles.cabeca} />}
      {numeroErros > 1 && <View style={styles.corpo} />}
      {numeroErros > 2 && <View style={styles.bracoEsquerdo} />}
      {numeroErros > 3 && <View style={styles.bracoDireito} />}
      {numeroErros > 4 && <View style={styles.pernaEsquerda} />}
      {numeroErros > 5 && <View style={styles.pernaDireita} />}
    </View>
  );
}

const FORCA_COLOR = '#795548'; // Cor de madeira escura
const BONECO_COLOR = '#2c3e50'; // Cor do boneco

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 250,
    position: 'relative',
    marginBottom: 20,
  },
  base: {
    height: 8,
    width: 150,
    backgroundColor: FORCA_COLOR,
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
    left: 25,
  },
  posteVertical: {
    height: 245,
    width: 8,
    backgroundColor: FORCA_COLOR,
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
    left: 50,
  },
  vigaHorizontal: {
    height: 8,
    width: 120,
    backgroundColor: FORCA_COLOR,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: 46,
  },
  corda: {
    width: 8,
    height: 40,
    backgroundColor: '#a1887f',
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 30,
  },
  cabeca: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 7,
    borderColor: BONECO_COLOR,
    position: 'absolute',
    top: 40,
    right: 3,
  },
  corpo: {
    width: 8,
    height: 80,
    backgroundColor: BONECO_COLOR,
    borderRadius: 4,
    position: 'absolute',
    top: 90,
    right: 28,
  },
  bracoEsquerdo: {
    width: 50,
    height: 8,
    backgroundColor: BONECO_COLOR,
    borderRadius: 4,
    position: 'absolute',
    top: 110,
    right: 28,
    transform: [{ rotate: '45deg' }],
  },
  bracoDireito: {
    width: 50,
    height: 8,
    backgroundColor: BONECO_COLOR,
    borderRadius: 4,
    position: 'absolute',
    top: 110,
    right: -14,
    transform: [{ rotate: '-45deg' }],
  },
  pernaEsquerda: {
    width: 50,
    height: 8,
    backgroundColor: BONECO_COLOR,
    borderRadius: 4,
    position: 'absolute',
    top: 180,
    right: 28,
    transform: [{ rotate: '45deg' }],
  },
  pernaDireita: {
    width: 50,
    height: 8,
    backgroundColor: BONECO_COLOR,
    borderRadius: 4,
    position: 'absolute',
    top: 180,
    right: -14,
    transform: [{ rotate: '-45deg' }],
  },
});