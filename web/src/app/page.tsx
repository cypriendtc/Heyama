'use client';

import { useEffect, useState } from 'react';
import { getObjects, deleteObject, type ObjectItem } from '@/lib/api';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function HomePage() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getObjects()
      .then(setObjects)
      .catch(() => toast({ title: t('home.toast.error'), variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on('object:created', (obj: ObjectItem) => {
      setObjects((prev) => [obj, ...prev]);
      toast({ title: t('home.toast.added'), description: obj.title });
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

  const handleDelete = async (id: string) => {
    try {
      await deleteObject(id);
      setObjects((prev) => prev.filter((o) => o._id !== id));
      toast({ title: t('home.toast.deleted') });
    } catch {
      toast({ title: t('home.toast.delete_fail'), variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
    );
  }

  if (objects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="#9333EA" strokeWidth="4" fill="none" opacity="0.4" />
            <path
              d="M50 75C50 75 25 58 25 42C25 34 31 28 39 28C44 28 47.5 31 50 35C52.5 31 56 28 61 28C69 28 75 34 75 42C75 58 50 75 50 75Z"
              fill="#9333EA"
              opacity="0.4"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-lg">{t('home.empty')}</p>
        <a
          href="/create"
          className="inline-block mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-700 transition-colors"
        >
          {t('home.empty.cta')}
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-purple-900">{t('home.title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {objects.map((obj) => (
          <div
            key={obj._id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-purple-100"
          >
            <a href={`/objects/${obj._id}`}>
              <img
                src={obj.imageUrl}
                alt={obj.title}
                className="w-full h-48 object-cover"
              />
            </a>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <a
                    href={`/objects/${obj._id}`}
                    className="font-semibold text-lg text-purple-900 hover:text-purple-600 transition-colors"
                  >
                    {obj.title}
                  </a>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {obj.description}
                  </p>
                  <p className="text-xs text-purple-400 mt-2 font-medium">
                    {new Date(obj.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(obj._id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
