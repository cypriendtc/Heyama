import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Locale = 'fr' | 'en';

const translations = {
  fr: {
    'home.title': 'Heyama',
    'home.empty': 'Aucun objet pour le moment',
    'home.empty.sub': 'Appuyez sur + pour en créer un',
    'home.alert.delete': 'Supprimer',
    'home.alert.confirm': 'Êtes-vous sûr ?',
    'home.alert.cancel': 'Annuler',
    'home.alert.error': 'Échec de la suppression',
    'create.title': 'Nouvel Objet',
    'create.label.title': 'Titre',
    'create.label.description': 'Description',
    'create.label.image': 'Image',
    'create.placeholder.title': 'Entrez le titre',
    'create.placeholder.description': 'Entrez la description',
    'create.placeholder.image': 'Appuyez pour sélectionner une image',
    'create.btn.submit': 'Créer l\'objet',
    'create.alert.fill': 'Veuillez remplir tous les champs et sélectionner une image',
    'create.alert.success': 'Objet créé !',
    'create.alert.error': 'Échec de la création',
    'detail.title': 'Détails',
    'detail.delete': 'Supprimer l\'objet',
    'detail.alert.title': 'Supprimer',
    'detail.alert.confirm': 'Voulez-vous vraiment supprimer cet objet ?',
    'detail.alert.cancel': 'Annuler',
    'detail.alert.error': 'Échec de la suppression',
    'detail.not_found': 'Objet introuvable',
    'lang.switch': 'EN',
  },
  en: {
    'home.title': 'Heyama',
    'home.empty': 'No objects yet',
    'home.empty.sub': 'Tap the + button to create one',
    'home.alert.delete': 'Delete',
    'home.alert.confirm': 'Are you sure?',
    'home.alert.cancel': 'Cancel',
    'home.alert.error': 'Failed to delete',
    'create.title': 'New Object',
    'create.label.title': 'Title',
    'create.label.description': 'Description',
    'create.label.image': 'Image',
    'create.placeholder.title': 'Enter title',
    'create.placeholder.description': 'Enter description',
    'create.placeholder.image': 'Tap to select image',
    'create.btn.submit': 'Create Object',
    'create.alert.fill': 'Please fill all fields and select an image',
    'create.alert.success': 'Object created!',
    'create.alert.error': 'Failed to create object',
    'detail.title': 'Details',
    'detail.delete': 'Delete Object',
    'detail.alert.title': 'Delete',
    'detail.alert.confirm': 'Are you sure you want to delete this object?',
    'detail.alert.cancel': 'Cancel',
    'detail.alert.error': 'Failed to delete',
    'detail.not_found': 'Object not found',
    'lang.switch': 'FR',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextValue {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'fr',
  toggleLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'fr' ? 'en' : 'fr'));
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] || key,
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
