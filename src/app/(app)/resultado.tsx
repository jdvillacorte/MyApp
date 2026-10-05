import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function valor(parametro: string | string[] | undefined) {
  return Array.isArray(parametro) ? parametro[0] ?? '' : parametro ?? '';
}

export default function Resultado() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const datos = [
    ['Nombre', valor(params.nombre)],
    ['Correo', valor(params.correo)],
    ['Telefono', valor(params.telefono)],
    ['Ciudad', valor(params.ciudad)],
    ['Tipo de compra', valor(params.tipoCompra)],
  ];

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>Informacion registrada</Text>
        <Text style={styles.subtitulo}>Datos recibidos desde el formulario.</Text>
        <View style={styles.card}>
          {datos.map(([etiqueta, dato]) => (
            <View key={etiqueta} style={styles.fila}>
              <Text style={styles.label}>{etiqueta}</Text>
              <Text style={styles.valor}>{dato}</Text>
            </View>
          ))}
        </View>
        <Pressable style={styles.boton} onPress={() => router.replace('/')}><Text style={styles.botonTexto}>Volver al inicio</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#eef2f6' },
  contenido: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 27, fontWeight: '800', color: '#121826', textAlign: 'center' },
  subtitulo: { color: '#536173', textAlign: 'center', marginTop: 8, marginBottom: 22 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 18 },
  fila: { marginBottom: 14 },
  label: { color: '#dc2626', fontSize: 13, fontWeight: '700' },
  valor: { color: '#172033', fontSize: 17, fontWeight: '600', marginTop: 4 },
  boton: { backgroundColor: '#dc2626', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  botonTexto: { color: '#ffffff', fontWeight: '800' },
});
