import { useRouter } from 'expo-router';
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

const recomendados = vehiculos.slice(0, 2);

function OpcionMenu({ titulo, onPress }: { titulo: string; onPress: () => void }) {
  return (
    <Pressable style={styles.opcion} onPress={onPress}>
      <Text style={styles.opcionTitulo} numberOfLines={2} adjustsFontSizeToFit>
        {titulo}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.pantalla}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>AutoSport</Text>
          <Text style={styles.titulo}>Venta de autos deportivos</Text>
          <Text style={styles.descripcion}>
            Encuentra deportivos de alto rendimiento, revisa su detalle y
            confirma tu compra desde el celular.
          </Text>
        </View>

        <Text style={styles.seccionTitulo}>Explorar AutoSport</Text>
        <ScrollView
          horizontal
          style={styles.opcionesScroll}
          contentContainerStyle={styles.opcionesGrid}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
        >
          <OpcionMenu titulo="Catalogo" onPress={() => router.push('/menu')} />
          <OpcionMenu titulo="Formulario" onPress={() => router.push('/formulario')} />
          <OpcionMenu titulo="Galeria" onPress={() => router.push('/imagenes')} />
          <OpcionMenu titulo="Contacto" onPress={() => router.push('/contacto')} />
          <OpcionMenu titulo="Ingresar" onPress={() => router.push('/login')} />
          <OpcionMenu titulo="Clientes AutoSport" onPress={() => router.push('/registros')} />
        </ScrollView>

        <Text style={styles.seccionTitulo}>Recomendados</Text>

        {recomendados.map((vehiculo) => (
          <View key={vehiculo.id} style={styles.tarjeta}>
            <Image
              source={vehiculo.imagenLocal ?? { uri: vehiculo.imagen }}
              style={styles.imagen}
              resizeMode="cover"
            />
            <View style={styles.infoTarjeta}>
              <Text style={styles.productoTitulo}>{vehiculo.marca}</Text>
              <Text style={styles.productoDescripcion}>{vehiculo.modelo}</Text>
              <Text style={styles.precio}>{vehiculo.precio}</Text>
            </View>
          </View>
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => router.push('/menu')}
        >
          <Text style={styles.botonTexto}>Ver catalogo completo</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.botonSecundario,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => router.push('/contacto')}
        >
          <Text style={styles.botonSecundarioTexto}>Contacto</Text>
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
  header: {
    marginBottom: 26,
    marginTop: 18,
  },
  opcionesScroll: {
    marginBottom: 22,
  },
  opcionesGrid: {
    gap: 8,
    paddingRight: 12,
  },
  opcion: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    padding: 6,
    width: 112,
  },
  opcionTitulo: {
    color: '#121826',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  logo: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  titulo: {
    color: '#121826',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 6,
  },
  descripcion: {
    color: '#536173',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },
  seccionTitulo: {
    color: '#121826',
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 14,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  imagen: {
    backgroundColor: '#d9e0ea',
    height: 170,
    width: '100%',
  },
  infoTarjeta: {
    padding: 16,
  },
  productoTitulo: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '900',
  },
  productoDescripcion: {
    color: '#5b6677',
    fontSize: 14,
    marginTop: 5,
  },
  precio: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 10,
  },
  boton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    marginTop: 14,
    paddingVertical: 16,
  },
  botonPresionado: {
    opacity: 0.76,
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  botonSecundario: {
    alignItems: 'center',
    borderColor: '#dc2626',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    paddingVertical: 16,
  },
  botonSecundarioTexto: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '900',
  },
});
