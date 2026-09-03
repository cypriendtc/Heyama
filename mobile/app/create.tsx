import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { createObjectFromForm } from '../lib/api';
import { useTranslation } from '../lib/i18n';

export default function CreateScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !image) {
      Alert.alert('Error', t('create.alert.fill'));
      return;
    }

    setSubmitting(true);
    try {
      const fileName = image.uri.split('/').pop() || 'photo.jpg';
      const fileType = image.mimeType || 'image/jpeg';
      await createObjectFromForm(title, description, image.uri, fileName, fileType);
      Alert.alert('Success', t('create.alert.success'), [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Error', t('create.alert.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>{t('create.label.title')}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={t('create.placeholder.title')}
          placeholderTextColor="#A78BFA"
        />

        <Text style={styles.label}>{t('create.label.description')}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder={t('create.placeholder.description')}
          placeholderTextColor="#A78BFA"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>{t('create.label.image')}</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>🖼</Text>
              <Text style={styles.placeholderText}>{t('create.placeholder.image')}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('create.btn.submit')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3FF' },
  form: { padding: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B0764',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  imagePicker: { marginTop: 4 },
  preview: { width: '100%', height: 200, borderRadius: 12 },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C4B5FD',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE9FE',
  },
  placeholderIcon: { fontSize: 32, marginBottom: 8 },
  placeholderText: { color: '#7C3AED', fontSize: 15, fontWeight: '500' },
  button: {
    backgroundColor: '#7C3AED',
    borderRadius: 28,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
