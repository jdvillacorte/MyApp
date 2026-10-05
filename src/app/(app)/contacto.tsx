import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactoScreen() {
  return (
    <SafeAreaView style={styles.pantalla}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        <Text style={styles.titulo}>AutoSport</Text>
        <Text style={styles.subtitulo}>Informacion y contacto</Text>

        <View style={styles.tarjeta}>
          <Text style={styles.label}>Ciudad</Text>
          <Text style={styles.texto}>Pasto, Colombia</Text>

          <Text style={styles.label}>Correo</Text>
          <Text style={styles.texto}>contacto@autosport.com</Text>

          <Text style={styles.label}>Horario</Text>
          <Text style={styles.texto}>Lunes a sabado de 8:00 a.m. a 6:00 p.m.</Text>

          <Text style={styles.label}>Servicio</Text>
          <Text style={styles.texto}>
            Venta de autos deportivos, asesoria comercial y financiacion.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.botonTexto}>Regresar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    backgroundColor: '#eef2f6',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  titulo: {
    color: '#121826',
    fontSize: 32,
    fontWeight: '900',
  },
  subtitulo: {
    color: '#536173',
    fontSize: 18,
    marginBottom: 24,
    marginTop: 6,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
    padding: 22,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  label: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  texto: {
    color: '#172033',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 4,
  },
  boton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    marginTop: 24,
    paddingVertical: 15,
  },
  botonPresionado: {
    opacity: 0.76,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});
