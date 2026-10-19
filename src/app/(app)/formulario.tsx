import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { vehiculos } from '@/constants/vehiculos';
import { camposCliente, type Cliente } from '@/types/cliente';

const tiposCompra = ['Contado', 'Credito', 'Leasing', 'Permuta', 'Otro'];

export default function Formulario() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [tipoCompra, setTipoCompra] = useState('');
  const [vehiculoFavorito, setVehiculoFavorito] = useState('');
  const [registroGuardado, setRegistroGuardado] = useState<Cliente | null>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const mostrarResultado = (cliente: Cliente) => router.push({ pathname: '/resultado', params: {
    id: cliente.id,
    nombre: cliente.nombre,
    correo: cliente.correo,
    telefono: cliente.telefono,
    ciudad: cliente.ciudad,
    vehiculoFavorito: cliente.vehiculo_favorito,
    tipoCompra: cliente.tipo_compra,
    creadoEn: cliente.creado_en,
  } });

  const enviar = async () => {
    if (enviando || registroGuardado) return;
    if (!supabase) {
      setError('Supabase no esta configurado. No se guardaron los datos.');
      return;
    }
    if (![nombre, correo, telefono, ciudad, tipoCompra, vehiculoFavorito].every((valor) => valor.trim())) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (nombre.trim().length < 2 || nombre.trim().length > 100
      || ciudad.trim().length < 2 || ciudad.trim().length > 100
      || telefono.trim().length < 7 || telefono.trim().length > 20
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      setError('Revisa el correo, nombre y ciudad (2 a 100 caracteres), y telefono (7 a 20 caracteres).');
      return;
    }
    setError('');
    setEnviando(true);

    try {
      const { data: usuario, error: errorUsuario } = await supabase.auth.getUser();
      if (errorUsuario || !usuario.user) {
        setError('No fue posible validar tu sesion. Inicia sesion nuevamente.');
        return;
      }
      const { data, error: errorSupabase } = await supabase.from('clientes').insert({
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        ciudad: ciudad.trim(),
        tipo_compra: tipoCompra,
        vehiculo_favorito: vehiculoFavorito,
        usuario_id: usuario.user.id,
      }).select(camposCliente).single<Cliente>();

      if (errorSupabase || !data) {
        setError('No fue posible registrar los datos. Intenta nuevamente.');
        return;
      }
      setRegistroGuardado(data);
      mostrarResultado(data);
    } catch {
      setError('No fue posible conectar con Supabase. No se confirmo el registro.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.pantalla} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Registro de cliente</Text>
        <Text style={styles.subtitulo}>Completa tus datos para recibir asesoria sobre tu proximo deportivo.</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} placeholder="Tu nombre" value={nombre} onChangeText={setNombre} editable={!enviando && !registroGuardado} />
          <Text style={styles.label}>Correo</Text>
          <TextInput style={styles.input} placeholder="correo@dominio.com" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} editable={!enviando && !registroGuardado} />
          <Text style={styles.label}>Telefono</Text>
          <TextInput style={styles.input} placeholder="3001234567" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} editable={!enviando && !registroGuardado} />
          <Text style={styles.label}>Ciudad</Text>
          <TextInput style={styles.input} placeholder="Ej. Pasto" value={ciudad} onChangeText={setCiudad} editable={!enviando && !registroGuardado} />
          <Text style={styles.label}>Vehiculo de interes</Text>
          <View style={styles.opciones}>
            {vehiculos.map((vehiculo) => (
              <Pressable
                key={vehiculo.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: vehiculoFavorito === vehiculo.modelo }}
                disabled={enviando || Boolean(registroGuardado)}
                style={[styles.opcion, vehiculoFavorito === vehiculo.modelo && styles.opcionActiva]}
                onPress={() => setVehiculoFavorito(vehiculo.modelo)}
              >
                <Text style={[styles.opcionTexto, vehiculoFavorito === vehiculo.modelo && styles.opcionTextoActivo]}>{vehiculo.marca}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>Tipo de compra</Text>
          <View style={styles.opciones}>
            {tiposCompra.map((tipo) => (
              <Pressable
                key={tipo}
                accessibilityRole="radio"
                accessibilityState={{ checked: tipoCompra === tipo }}
                style={[styles.opcion, tipoCompra === tipo && styles.opcionActiva]}
                disabled={enviando || Boolean(registroGuardado)}
                onPress={() => setTipoCompra(tipo)}
              >
                <Text style={[styles.opcionTexto, tipoCompra === tipo && styles.opcionTextoActivo]}>{tipo}</Text>
              </Pressable>
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={styles.boton} onPress={enviar} disabled={enviando || Boolean(registroGuardado)}>
            {enviando ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.botonTexto}>Enviar informacion</Text>}
          </Pressable>
        </View>
        {registroGuardado ? (
          <View style={styles.confirmacion}>
            <Text style={styles.label}>Registro guardado</Text>
            <Text>{registroGuardado.nombre}</Text>
            <Text>{registroGuardado.vehiculo_favorito}</Text>
            <Text>{registroGuardado.tipo_compra} - {registroGuardado.ciudad}</Text>
            <Pressable style={styles.boton} onPress={() => mostrarResultado(registroGuardado)}>
              <Text style={styles.botonTexto}>Ver resultado</Text>
            </Pressable>
            <Pressable style={styles.boton} onPress={() => setRegistroGuardado(null)}>
              <Text style={styles.botonTexto}>Nuevo registro</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#eef2f6' },
  contenido: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 28, fontWeight: '800', color: '#121826', textAlign: 'center' },
  subtitulo: { color: '#536173', textAlign: 'center', marginTop: 8, marginBottom: 20, lineHeight: 21 },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { color: '#172033', fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 14, color: '#121826' },
  opciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  opcion: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f8fafc' },
  opcionActiva: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  opcionTexto: { color: '#334155', fontWeight: '700' },
  opcionTextoActivo: { color: '#ffffff' },
  error: { color: '#b91c1c', marginBottom: 12 },
  confirmacion: { backgroundColor: '#f0fdf4', borderColor: '#86efac', borderWidth: 1, borderRadius: 8, padding: 20, marginTop: 16, gap: 8 },
  boton: { backgroundColor: '#dc2626', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  botonTexto: { color: '#ffffff', fontWeight: '800' },
});
