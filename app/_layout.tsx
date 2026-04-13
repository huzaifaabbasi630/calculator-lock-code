import { Stack } from 'expo-router';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: Colors.dark.background },
      animation: 'fade',
    }}>
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(vault)" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}
