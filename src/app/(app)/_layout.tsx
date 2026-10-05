import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#eef2f6' },
        headerStyle: { backgroundColor: '#dc2626' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'AutoSport' }} />
      <Stack.Screen name="menu" options={{ title: 'Catalogo de autos' }} />
      <Stack.Screen name="formulario" options={{ title: 'Registro' }} />
      <Stack.Screen name="resultado" options={{ title: 'Datos registrados' }} />
      <Stack.Screen name="registros" options={{ title: 'Clientes AutoSport' }} />
      <Stack.Screen name="imagenes" options={{ title: 'Galeria de autos' }} />
      <Stack.Screen name="contacto" options={{ title: 'Contacto' }} />
      <Stack.Screen name="producto/[id]" options={{ title: 'Detalle del vehiculo' }} />
    </Stack>
  );
}
