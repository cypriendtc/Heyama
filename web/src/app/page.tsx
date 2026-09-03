'use client';

import { useEffect, useState } from 'react';
import { getObjects, deleteObject, type ObjectItem } from '@/lib/api';
import { socket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

export default function HomePage() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getObjects()
      .then(setObjects)
      .catch(() => toast({ title: 'Error loading objects', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on('object:created', (obj: ObjectItem) => {
      setObjects((prev) => [obj, ...prev]);
      toast({ title: 'New object added!', description: obj.title });
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
      toast({ title: 'Object deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
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
            <path
              d="M50 80C50 80 20 60 20 40C20 30 28 22 38 22C44 22 48 26 50 30C52 26 56 22 62 22C72 22 80 30 80 40C80 60 50 80 50 80Z"
              fill="#9333EA"
              opacity="0.4"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-lg">No objects yet</p>
        <a
          href="/create"
          className="inline-block mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-700 transition-colors"
        >
          Create your first object
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-purple-900">All Objects</h1>
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
