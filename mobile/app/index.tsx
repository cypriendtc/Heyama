import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getObjects, deleteObject, type ObjectItem } from '../lib/api';
import { socket } from '../lib/socket';

export default function HomeScreen() {
  const router = useRouter();
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadObjects = useCallback(async () => {
    try {
      const data = await getObjects();
      setObjects(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load objects');
    }
  }, []);

  useEffect(() => {
    loadObjects();
  }, [loadObjects]);

  useEffect(() => {
    socket.connect();

    socket.on('object:created', (obj: ObjectItem) => {
      setObjects((prev) => [obj, ...prev]);
    });

    socket.on('object:deleted', (id: string) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    });

    return () => {
      socket.off('object:created');
      socket.off('object:deleted');
      socket.disconnect();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadObjects();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteObject(id);
            setObjects((prev) => prev.filter((o) => o._id !== id));
          } catch {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ObjectItem }): React.JSX.Element => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/objects/${item._id}`)}
      onLongPress={() => handleDelete(item._id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={objects}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No objects yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create one
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 180 },
  cardBody: { padding: 12 },
  title: { fontSize: 18, fontWeight: '600', color: '#111' },
  description: { fontSize: 14, color: '#666', marginTop: 4 },
  date: { fontSize: 12, color: '#999', marginTop: 8 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, color: '#999' },
  emptySubtext: { fontSize: 14, color: '#bbb', marginTop: 8 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: { fontSize: 28, color: '#fff', lineHeight: 30 },
});
