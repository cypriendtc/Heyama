import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { I18nProvider, useTranslation } from '../lib/i18n';

function HeyamaLogo() {
  return (
    <Image
      source={require('../assets/logo.webp')}
      style={{ width: 30, height: 30, borderRadius: 15 }}
    />
  );
}

function LangButton() {
  const { locale, toggleLocale } = useTranslation();
  return (
    <TouchableOpacity onPress={toggleLocale} style={styles.langBtn}>
      <Text style={styles.langText}>{locale === 'fr' ? 'EN' : 'FR'}</Text>
    </TouchableOpacity>
  );
}

function AppStack() {
  const { t } = useTranslation();
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#7C3AED' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
          headerRight: () => <LangButton />,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Heyama',
            headerLeft: () => <HeyamaLogo />,
          }}
        />
        <Stack.Screen
          name="create"
          options={{ title: t('create.title') }}
        />
        <Stack.Screen
          name="objects/[id]"
          options={{ title: t('detail.title') }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <I18nProvider>
      <AppStack />
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  langBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  langText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
