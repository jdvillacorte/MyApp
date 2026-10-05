import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  const crearCuenta = async () => {
    if (!supabase) {
      setMensaje('Falta configurar la clave publica de Supabase.');
      return;
    }

    if (!nombre.trim() || !correo.trim() || !contrasena) {
      setMensaje('Completa todos los campos.');
      return;
    }

    if (contrasena.length < 6) {
      setMensaje('La contrasena debe tener minimo 6 caracteres.');
      return;
    }

    setGuardando(true);
    setMensaje('');
    const { data, error } = await supabase.auth.signUp({
      email: correo.trim(),
      password: contrasena,
      options: { data: { nombre: nombre.trim() } },
    });

    if (error) {
      setGuardando(false);
      setMensaje(error.message);
      return;
    }

    if (data.session) {
      await supabase.auth.signOut();
    }

    setGuardando(false);
    router.replace({
      pathname: '/login',
      params: { registro: 'exitoso' },
    });
  };

  return (
    <SafeAreaView style={styles.pantalla} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Crear cuenta AutoSport</Text>
        <Text style={styles.subtitulo}>Registra tus datos para ingresar a la zona privada.</Text>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          autoComplete="name"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Correo electronico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Contrasena</Text>
        <TextInput
          style={styles.input}
          placeholder="Minimo 6 caracteres"
          secureTextEntry
          autoComplete="new-password"
          value={contrasena}
          onChangeText={setContrasena}
        />

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        <Pressable style={styles.boton} onPress={crearCuenta} disabled={guardando}>
          {guardando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.botonTexto}>Crear cuenta</Text>
          )}
        </Pressable>

        <Pressable style={styles.enlace} onPress={() => router.replace('/login')}>
          <Text style={styles.enlaceTexto}>Ya tengo una cuenta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { backgroundColor: '#eef2f6', flex: 1 },
  contenido: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  titulo: { color: '#121826', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  subtitulo: { color: '#536173', lineHeight: 21, marginBottom: 26, marginTop: 7, textAlign: 'center' },
  label: { color: '#172033', fontWeight: '800', marginBottom: 7 },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#121826',
    fontSize: 16,
    marginBottom: 15,
    padding: 14,
  },
  mensaje: { color: '#b91c1c', lineHeight: 20, marginBottom: 13, textAlign: 'center' },
  boton: { alignItems: 'center', backgroundColor: '#dc2626', borderRadius: 8, padding: 15 },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  enlace: { alignItems: 'center', marginTop: 18, padding: 10 },
  enlaceTexto: { color: '#dc2626', fontWeight: '800' },
});
