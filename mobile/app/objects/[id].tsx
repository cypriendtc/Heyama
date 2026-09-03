import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getObject, deleteObject, type ObjectItem } from '../../lib/api';

export default function ObjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getObject(id)
        .then(setObject)
        .catch(() => {
          Alert.alert('Error', 'Object not found');
          router.back();
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    if (!object) return;
    Alert.alert('Delete', 'Are you sure you want to delete this object?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteObject(object._id);
            router.back();
          } catch {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!object) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Object not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: object.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{object.title}</Text>
        <Text style={styles.date}>
          {new Date(object.createdAt).toLocaleString()}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.description}>{object.description}</Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.85}
        >
          <Text style={styles.deleteButtonText}>Delete Object</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3FF' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F3FF' },
  notFound: { fontSize: 16, color: '#6B7280' },
  image: { width: '100%', height: 300 },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3B0764' },
  date: { fontSize: 13, color: '#A78BFA', marginTop: 4, fontWeight: '500' },
  divider: {
    height: 1,
    backgroundColor: '#EDE9FE',
    marginVertical: 16,
  },
  description: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 28,
    padding: 14,
    alignItems: 'center',
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: { color: '#DC2626', fontSize: 16, fontWeight: '600' },
});
