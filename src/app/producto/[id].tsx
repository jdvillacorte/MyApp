import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { vehiculos } from '@/constants/vehiculos';
import { supabase } from '@/lib/supabase';

type PasoCompra = 'formulario' | 'confirmado';

function obtenerParametro(valor: string | string[] | undefined) {
  if (Array.isArray(valor)) {
    return valor[0] ?? '';
  }

  return valor ?? '';
}

export default function ProductoScreen() {
  const params = useLocalSearchParams();
  const id = obtenerParametro(params.id);
  const vehiculoGuardado = vehiculos.find((vehiculo) => vehiculo.id === id);
  const marca = obtenerParametro(params.marca) || vehiculoGuardado?.marca || '';
  const modelo = obtenerParametro(params.modelo) || vehiculoGuardado?.modelo || '';
  const version = obtenerParametro(params.version) || vehiculoGuardado?.version || '';
  const precio = obtenerParametro(params.precio) || vehiculoGuardado?.precio || '';
  const descripcion = obtenerParametro(params.descripcion) || vehiculoGuardado?.descripcion || '';
  const imagen = obtenerParametro(params.imagen) || vehiculoGuardado?.imagen || '';
  const imagenLocal = vehiculoGuardado?.imagenLocal;

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [financiado, setFinanciado] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [pasoCompra, setPasoCompra] = useState<PasoCompra>('formulario');

  const abrirCompra = () => {
    setModalVisible(true);
    setPasoCompra('formulario');
    setError('');
  };

  const cerrarVentana = () => {
    setModalVisible(false);
    setProcesando(false);
    setError('');
  };

  const confirmarCompra = async () => {
    if (
      nombre.trim() === '' ||
      telefono.trim() === '' ||
      ciudad.trim() === ''
    ) {
      setError('Completa tu nombre, telefono y ciudad para continuar.');
      return;
    }

    setError('');
    setProcesando(true);

    if (supabase) {
      const { error: errorSupabase } = await supabase.from('pedidos').insert({
        vehiculo_id: id,
        marca,
        modelo,
        precio,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        ciudad: ciudad.trim(),
        financiado,
      });

      if (errorSupabase) {
        setProcesando(false);
        setError('No fue posible registrar la compra. Intenta nuevamente.');
        return;
      }
    }

    setProcesando(false);
    setPasoCompra('confirmado');
  };

  return (
    <SafeAreaView style={styles.pantalla}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.etiqueta}>Vehiculo #{id}</Text>
        <Text style={styles.titulo}>{marca}</Text>

        <Image source={imagenLocal ?? { uri: imagen }} style={styles.imagen} resizeMode="cover" />

        <Text style={styles.modelo}>{modelo}</Text>
        <Text style={styles.version}>{version}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
        <Text style={styles.precio}>{precio}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPresionado,
          ]}
          onPress={abrirCompra}
        >
          <Text style={styles.botonTexto}>Comprar vehiculo</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.botonSecundario,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.botonSecundarioTexto}>Regresar al catalogo</Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={cerrarVentana}
      >
        <KeyboardAvoidingView
          style={styles.fondoModal}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.ventanaModal}>
            <View style={styles.encabezadoModal}>
              <Text style={styles.tituloModal}>
                {pasoCompra === 'formulario'
                  ? 'Datos de compra'
                  : 'Compra registrada'}
              </Text>

              <Pressable
                style={styles.botonCerrar}
                onPress={cerrarVentana}
                accessibilityLabel="Cerrar ventana"
              >
                <View style={styles.iconoCerrar}>
                  <View style={[styles.lineaCerrar, styles.lineaCerrarUno]} />
                  <View style={[styles.lineaCerrar, styles.lineaCerrarDos]} />
                </View>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.contenidoModal}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={imagenLocal ?? { uri: imagen }}
                style={styles.imagenModal}
                resizeMode="cover"
              />

              <Text style={styles.modeloModal}>{modelo}</Text>
              <Text style={styles.precioModal}>{precio}</Text>

              {pasoCompra === 'formulario' ? (
                <View style={styles.formulario}>
                  <Text style={styles.label}>Nombre del comprador</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Escribe tu nombre"
                    placeholderTextColor="#8b95a5"
                    value={nombre}
                    onChangeText={setNombre}
                  />

                  <Text style={styles.label}>Telefono</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="phone-pad"
                    placeholder="Ej. 3001234567"
                    placeholderTextColor="#8b95a5"
                    value={telefono}
                    onChangeText={setTelefono}
                  />

                  <Text style={styles.label}>Ciudad de entrega</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Medellin"
                    placeholderTextColor="#8b95a5"
                    value={ciudad}
                    onChangeText={setCiudad}
                  />

                  <View style={styles.filaSwitch}>
                    <View style={styles.textosSwitch}>
                      <Text style={styles.switchTitulo}>Pago financiado</Text>
                      <Text style={styles.switchDescripcion}>
                        Activalo si deseas separar el vehiculo con credito.
                      </Text>
                    </View>
                    <Switch
                      value={financiado}
                      onValueChange={setFinanciado}
                      trackColor={{ false: '#cbd5e1', true: '#fecaca' }}
                      thumbColor={financiado ? '#dc2626' : '#f8fafc'}
                    />
                  </View>

                  {error !== '' ? (
                    <Text style={styles.errorTexto}>{error}</Text>
                  ) : null}

                  <Pressable
                    style={({ pressed }) => [
                      styles.botonAceptar,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={confirmarCompra}
                    disabled={procesando}
                  >
                    {procesando ? (
                      <View style={styles.cargandoBoton}>
                        <ActivityIndicator color="#ffffff" />
                        <Text style={styles.botonTexto}>Procesando...</Text>
                      </View>
                    ) : (
                      <Text style={styles.botonTexto}>Confirmar compra</Text>
                    )}
                  </Pressable>
                </View>
              ) : (
                <View style={styles.confirmacion}>
                  <Text style={styles.textoModal}>
                    YA ESTA EN CAMINO TU VEHICULO
                  </Text>
                  <Text style={styles.resumenCompra}>
                    Comprador: {nombre.trim()}
                  </Text>
                  <Text style={styles.resumenCompra}>
                    Entrega: {ciudad.trim()}
                  </Text>
                  <Text style={styles.resumenCompra}>
                    Metodo: {financiado ? 'pago financiado' : 'pago de contado'}
                  </Text>

                  <Pressable
                    style={({ pressed }) => [
                      styles.botonAceptar,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={cerrarVentana}
                  >
                    <Text style={styles.botonTexto}>Aceptar</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  etiqueta: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 18,
    textTransform: 'uppercase',
  },
  titulo: {
    color: '#121826',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 7,
  },
  imagen: {
    backgroundColor: '#d9e0ea',
    borderRadius: 8,
    height: 225,
    marginTop: 20,
    width: '100%',
  },
  modelo: {
    color: '#172033',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 18,
  },
  version: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
  },
  descripcion: {
    color: '#536173',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
  },
  precio: {
    color: '#dc2626',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 22,
  },
  boton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    marginTop: 28,
    paddingVertical: 15,
  },
  botonSecundario: {
    alignItems: 'center',
    borderColor: '#dc2626',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
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
  botonSecundarioTexto: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '900',
  },
  fondoModal: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  ventanaModal: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxHeight: '88%',
    maxWidth: 430,
    overflow: 'hidden',
    width: '100%',
  },
  encabezadoModal: {
    alignItems: 'center',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  tituloModal: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
  },
  botonCerrar: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  iconoCerrar: {
    height: 16,
    position: 'relative',
    width: 16,
  },
  lineaCerrar: {
    backgroundColor: '#ffffff',
    borderRadius: 2,
    height: 2,
    left: 1,
    position: 'absolute',
    top: 7,
    width: 14,
  },
  lineaCerrarUno: {
    transform: [{ rotate: '45deg' }],
  },
  lineaCerrarDos: {
    transform: [{ rotate: '-45deg' }],
  },
  contenidoModal: {
    padding: 18,
  },
  imagenModal: {
    backgroundColor: '#d9e0ea',
    borderRadius: 8,
    height: 170,
    width: '100%',
  },
  modeloModal: {
    color: '#172033',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },
  precioModal: {
    color: '#dc2626',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
    textAlign: 'center',
  },
  formulario: {
    marginTop: 18,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#0f172a',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  filaSwitch: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 12,
  },
  textosSwitch: {
    flex: 1,
  },
  switchTitulo: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '800',
  },
  switchDescripcion: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  errorTexto: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  botonAceptar: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 8,
    marginTop: 18,
    paddingVertical: 13,
    width: '100%',
  },
  cargandoBoton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  confirmacion: {
    alignItems: 'center',
  },
  textoModal: {
    color: '#1e3a8a',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 25,
    marginTop: 18,
    textAlign: 'center',
  },
  resumenCompra: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 7,
    textAlign: 'center',
  },
});
