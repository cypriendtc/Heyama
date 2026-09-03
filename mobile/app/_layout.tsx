import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { I18nProvider, useTranslation } from '../lib/i18n';
import Svg, { Circle, Path } from 'react-native-svg';

function HeyamaLogo() {
  return (
    <Svg width={28} height={28} viewBox="0 0 100 100" fill="none">
      <Circle cx="50" cy="50" r="46" stroke="white" strokeWidth="5" fill="none" />
      <Path
        d="M50 75C50 75 25 58 25 42C25 34 31 28 39 28C44 28 47.5 31 50 35C52.5 31 56 28 61 28C69 28 75 34 75 42C75 58 50 75 50 75Z"
        fill="white"
      />
    </Svg>
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
