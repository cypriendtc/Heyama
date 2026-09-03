'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Locale = 'fr' | 'en';

const translations = {
  fr: {
    'nav.new': '+ Nouvel Objet',
    'home.title': 'Tous les Objets',
    'home.empty': 'Aucun objet pour le moment',
    'home.empty.cta': 'Créer votre premier objet',
    'home.toast.added': 'Nouvel objet ajouté !',
    'home.toast.deleted': 'Objet supprimé',
    'home.toast.error': 'Erreur de chargement',
    'home.toast.delete_fail': 'Échec de la suppression',
    'home.confirm_delete': 'Voulez-vous vraiment supprimer cet objet ?',
    'home.search': 'Rechercher...',
    'home.no_results': 'Aucun résultat pour',
    'home.page_of': 'Page {page} sur {total}',
    'home.prev': 'Précédent',
    'home.next': 'Suivant',
    'create.title': 'Nouvel Objet',
    'create.subtitle': 'Ajouter un objet à votre collection',
    'create.label.title': 'Titre',
    'create.label.description': 'Description',
    'create.label.image': 'Image',
    'create.placeholder.title': 'Entrez le titre',
    'create.placeholder.description': 'Entrez la description',
    'create.placeholder.image': 'Appuyez pour sélectionner une image',
    'create.btn.submit': 'Créer l\'objet',
    'create.btn.submitting': 'Création...',
    'create.btn.cancel': 'Annuler',
    'create.toast.success': 'Objet créé avec succès !',
    'create.toast.error': 'Échec de la création',
    'create.toast.fill': 'Veuillez remplir tous les champs et sélectionner une image',
    'detail.back': 'Retour à la liste',
    'detail.delete': 'Supprimer',
    'detail.deleting': 'Suppression...',
    'detail.not_found': 'Objet introuvable',
    'detail.go_home': 'Retour à l\'accueil',
    'detail.toast.not_found': 'Objet introuvable',
    'detail.toast.deleted': 'Objet supprimé',
    'detail.toast.delete_fail': 'Échec de la suppression',
    'detail.confirm_delete': 'Voulez-vous vraiment supprimer cet objet ?',
  },
  en: {
    'nav.new': '+ New Object',
    'home.title': 'All Objects',
    'home.empty': 'No objects yet',
    'home.empty.cta': 'Create your first object',
    'home.toast.added': 'New object added!',
    'home.toast.deleted': 'Object deleted',
    'home.toast.error': 'Error loading objects',
    'home.toast.delete_fail': 'Failed to delete',
    'home.confirm_delete': 'Are you sure you want to delete this object?',
    'home.search': 'Search...',
    'home.no_results': 'No results for',
    'home.page_of': 'Page {page} of {total}',
    'home.prev': 'Previous',
    'home.next': 'Next',
    'create.title': 'New Object',
    'create.subtitle': 'Add an object to your collection',
    'create.label.title': 'Title',
    'create.label.description': 'Description',
    'create.label.image': 'Image',
    'create.placeholder.title': 'Enter title',
    'create.placeholder.description': 'Enter description',
    'create.placeholder.image': 'Tap to select image',
    'create.btn.submit': 'Create Object',
    'create.btn.submitting': 'Creating...',
    'create.btn.cancel': 'Cancel',
    'create.toast.success': 'Object created successfully!',
    'create.toast.error': 'Failed to create object',
    'create.toast.fill': 'Please fill all fields and select an image',
    'detail.back': 'Back to list',
    'detail.delete': 'Delete',
    'detail.deleting': 'Deleting...',
    'detail.not_found': 'Object not found',
    'detail.go_home': 'Go back home',
    'detail.toast.not_found': 'Object not found',
    'detail.toast.deleted': 'Object deleted',
    'detail.toast.delete_fail': 'Failed to delete',
    'detail.confirm_delete': 'Are you sure you want to delete this object?',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'fr',
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] || key,
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
