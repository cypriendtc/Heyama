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
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!object) {
    return (
      <View style={styles.centered}>
        <Text>Object not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: object.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{object.title}</Text>
        <Text style={styles.description}>{object.description}</Text>
        <Text style={styles.date}>
          Created: {new Date(object.createdAt).toLocaleString()}
        </Text>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Object</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 300 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  description: { fontSize: 16, color: '#555', marginTop: 12, lineHeight: 24 },
  date: { fontSize: 12, color: '#999', marginTop: 16 },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
