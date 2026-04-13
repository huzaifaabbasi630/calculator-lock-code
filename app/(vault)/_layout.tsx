import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function VaultLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: Colors.dark.background },
      headerTintColor: Colors.dark.text,
      headerTitleStyle: { fontWeight: 'bold' },
      contentStyle: { backgroundColor: Colors.dark.background },
      animation: 'slide_from_bottom',
    }}>
      <Stack.Screen name="dashboard" options={{ title: 'Vault Dashboard', headerLeft: () => null }} />
      <Stack.Screen name="gallery" options={{ title: 'Images' }} />
      <Stack.Screen name="videos" options={{ title: 'Videos' }} />
      <Stack.Screen name="browser" options={{ title: 'Private Browser' }} />
      <Stack.Screen name="settings" options={{ title: 'Security Settings' }} />
    </Stack>
  );
}
