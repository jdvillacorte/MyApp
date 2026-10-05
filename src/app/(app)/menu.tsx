import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { vehiculos } from '@/constants/vehiculos';

export default function MenuScreen() {
  return (
    <SafeAreaView style={styles.pantalla}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>Catalogo de autos</Text>
        <Text style={styles.descripcion}>
          Selecciona el vehiculo que deseas conocer en detalle.
        </Text>

        {vehiculos.map((vehiculo) => (
          <View key={vehiculo.id} style={styles.tarjeta}>
            <Image
              source={vehiculo.imagenLocal ?? { uri: vehiculo.imagen }}
              style={styles.imagen}
              resizeMode="cover"
            />

            <View style={styles.info}>
              <Text style={styles.producto}>{vehiculo.marca}</Text>
              <Text style={styles.detalle}>{vehiculo.modelo}</Text>
              <Text style={styles.precio}>{vehiculo.precio}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.boton,
                pressed && styles.botonPresionado,
              ]}
              onPress={() =>
                router.push({
                  pathname: '/producto/[id]',
                  params: {
                    id: vehiculo.id,
                    marca: vehiculo.marca,
                    modelo: vehiculo.modelo,
                    version: vehiculo.version,
                    precio: vehiculo.precio,
                    descripcion: vehiculo.descripcion,
                    imagen: vehiculo.imagen,
                  },
                })
              }
            >
              <Text style={styles.botonTexto}>Ver</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.regresar} onPress={() => router.back()}>
          <Text style={styles.regresarTexto}>Regresar al inicio</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    backgroundColor: '#eef2f6',
    flex: 1,
  },
  scroll: {
    backgroundColor: '#eef2f6',
    flex: 1,
  },
  contenido: {
    padding: 22,
    paddingBottom: 42,
  },
  titulo: {
    color: '#121826',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 18,
  },
  descripcion: {
    color: '#536173',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
    marginTop: 8,
  },
  tarjeta: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    marginBottom: 16,
    overflow: 'hidden',
    padding: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  imagen: {
    backgroundColor: '#d9e0ea',
    borderRadius: 8,
    height: 88,
    width: 110,
  },
  info: {
    flex: 1,
    marginLeft: 13,
  },
  producto: {
    color: '#0f172a',
    fontSize: 19,
    fontWeight: '900',
  },
  detalle: {
    color: '#5b6677',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  precio: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 7,
  },
  boton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botonPresionado: {
    opacity: 0.76,
  },
  botonTexto: {
    color: '#ffffff',
    fontWeight: '900',
  },
  regresar: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 12,
  },
  regresarTexto: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '900',
  },
});
