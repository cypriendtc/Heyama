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
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getObjects, deleteObject, type ObjectItem } from '../lib/api';
import { socket } from '../lib/socket';
import { useTranslation } from '../lib/i18n';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  const loadObjects = useCallback(async (p: number, s: string, append = false) => {
    try {
      const res = await getObjects(p, 12, s || undefined);
      setObjects((prev) => append ? [...prev, ...res.data] : res.data);
      setTotalPages(res.totalPages);
      setPage(res.page);
    } catch (e) {
      Alert.alert('Error', t('home.alert.error'));
    }
  }, [t]);

  useEffect(() => {
    loadObjects(1, search);
  }, [search]);

  useEffect(() => {
    socket.connect();

    socket.on('object:created', (obj: ObjectItem) => {
      if (page === 1 && !search) {
        setObjects((prev) => [obj, ...prev]);
      }
    });

    socket.on('object:deleted', (id: string) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    });

    return () => {
      socket.off('object:created');
      socket.off('object:deleted');
      socket.disconnect();
    };
  }, [page, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadObjects(1, search);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    await loadObjects(page + 1, search, true);
    setLoadingMore(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(t('home.alert.delete'), t('home.alert.confirm'), [
      { text: t('home.alert.cancel'), style: 'cancel' },
      {
        text: t('home.alert.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteObject(id);
            setObjects((prev) => prev.filter((o) => o._id !== id));
          } catch {
            Alert.alert('Error', t('home.alert.error'));
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
      activeOpacity={0.8}
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

  const renderHeader = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={(text) => { setSearch(text); setPage(1); }}
        placeholder={t('home.search')}
        placeholderTextColor="#A78BFA"
        returnKeyType="search"
      />
    </View>
  );

  const renderFooter = () => {
    if (page >= totalPages) return null;
    return (
      <TouchableOpacity style={styles.loadMore} onPress={loadMore} activeOpacity={0.8}>
        <Text style={styles.loadMoreText}>
          {loadingMore ? '...' : t('home.load_more')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={objects}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7C3AED']}
            tintColor="#7C3AED"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyHeart}>♥</Text>
            </View>
            <Text style={styles.emptyText}>
              {search ? t('home.no_results') : t('home.empty')}
            </Text>
            {!search && (
              <Text style={styles.emptySubtext}>{t('home.empty.sub')}</Text>
            )}
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3FF' },
  list: { padding: 16 },
  searchContainer: { marginBottom: 16 },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  image: { width: '100%', height: 180 },
  cardBody: { padding: 14 },
  title: { fontSize: 18, fontWeight: '700', color: '#3B0764' },
  description: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  date: { fontSize: 12, color: '#A78BFA', marginTop: 8, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyHeart: { fontSize: 32, color: '#7C3AED' },
  emptyText: { fontSize: 18, color: '#6B7280', fontWeight: '600' },
  emptySubtext: { fontSize: 14, color: '#A78BFA', marginTop: 8 },
  loadMore: {
    backgroundColor: '#EDE9FE',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadMoreText: { color: '#7C3AED', fontSize: 14, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabText: { fontSize: 28, color: '#fff', lineHeight: 30 },
});
