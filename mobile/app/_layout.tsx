import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Heyama Objects' }}
        />
        <Stack.Screen
          name="create"
          options={{ title: 'New Object' }}
        />
        <Stack.Screen
          name="objects/[id]"
          options={{ title: 'Object Details' }}
        />
      </Stack>
    </>
  );
}
