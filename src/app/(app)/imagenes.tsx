import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vehiculos } from '@/constants/vehiculos';

export default function Imagenes() {
  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>Galeria de autos</Text>
        <Text style={styles.subtitulo}>Mustang, Corvette, Ferrari y Toyota.</Text>
        {vehiculos.map((vehiculo) => (
          <View key={vehiculo.id} style={styles.card}>
            <Image source={vehiculo.imagenLocal ?? { uri: vehiculo.imagen }} style={styles.imagen} resizeMode="cover" />
            <View style={styles.info}>
              <Text style={styles.modelo}>{vehiculo.modelo}</Text>
              <Text style={styles.version}>{vehiculo.version}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#eef2f6' },
  contenido: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 28, fontWeight: '800', color: '#121826' },
  subtitulo: { color: '#536173', marginTop: 6, marginBottom: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 18 },
  imagen: { width: '100%', height: 210, backgroundColor: '#d9e0ea' },
  info: { padding: 14 },
  modelo: { color: '#121826', fontSize: 17, fontWeight: '800' },
  version: { color: '#536173', marginTop: 4 },
});
