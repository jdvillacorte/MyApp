import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#dc2626' }, headerTintColor: '#ffffff', headerTitleStyle: { fontWeight: 'bold' }, contentStyle: { backgroundColor: '#eef2f6' } }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'AutoSport',
          }}
        />
        <Stack.Screen
          name="menu"
          options={{
            title: 'Catalogo de autos',
          }}
        />
        <Stack.Screen name="formulario" options={{ title: 'Registro' }} />
        <Stack.Screen name="login" options={{ title: 'Cuenta' }} />
        <Stack.Screen name="resultado" options={{ title: 'Datos registrados' }} />
        <Stack.Screen name="registros" options={{ title: 'Clientes AutoSport' }} />
        <Stack.Screen name="imagenes" options={{ title: 'Galeria de autos' }} />
        <Stack.Screen
          name="contacto"
          options={{
            title: 'Contacto',
          }}
        />
        <Stack.Screen
          name="producto/[id]"
          options={{
            title: 'Detalle del vehiculo',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
