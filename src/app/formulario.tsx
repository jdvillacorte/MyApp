import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';

export default function Formulario() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    if (![nombre, correo, telefono, ciudad].every((valor) => valor.trim())) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setError('');
    setEnviando(true);

    if (supabase) {
      const { data: usuario } = await supabase.auth.getUser();
      const { error: errorSupabase } = await supabase.from('clientes').insert({
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono.trim(),
        ciudad: ciudad.trim(),
        usuario_id: usuario.user?.id ?? null,
      });

      if (errorSupabase) {
        setEnviando(false);
        setError('No fue posible registrar los datos. Intenta nuevamente.');
        return;
      }
    }

    setEnviando(false);
    router.push({ pathname: '/resultado', params: { nombre: nombre.trim(), correo: correo.trim(), telefono: telefono.trim(), ciudad: ciudad.trim() } });
  };

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Registro de cliente</Text>
        <Text style={styles.subtitulo}>Completa tus datos para recibir asesoria sobre tu proximo deportivo.</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} placeholder="Tu nombre" value={nombre} onChangeText={setNombre} />
          <Text style={styles.label}>Correo</Text>
          <TextInput style={styles.input} placeholder="correo@dominio.com" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} />
          <Text style={styles.label}>Telefono</Text>
          <TextInput style={styles.input} placeholder="3001234567" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
          <Text style={styles.label}>Ciudad</Text>
          <TextInput style={styles.input} placeholder="Ej. Pasto" value={ciudad} onChangeText={setCiudad} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={styles.boton} onPress={enviar} disabled={enviando}>
            {enviando ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.botonTexto}>Enviar informacion</Text>}
          </Pressable>
        </View>
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
  error: { color: '#b91c1c', marginBottom: 12 },
  boton: { backgroundColor: '#dc2626', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  botonTexto: { color: '#ffffff', fontWeight: '800' },
});
