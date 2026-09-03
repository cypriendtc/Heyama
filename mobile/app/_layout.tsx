import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#7C3AED' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Heyama' }}
        />
        <Stack.Screen
          name="create"
          options={{ title: 'New Object' }}
        />
        <Stack.Screen
          name="objects/[id]"
          options={{ title: 'Details' }}
        />
      </Stack>
    </>
  );
}
