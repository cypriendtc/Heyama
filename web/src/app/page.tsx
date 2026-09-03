'use client';

import { useEffect, useState } from 'react';
import { getObjects, deleteObject, type ObjectItem } from '@/lib/api';
import { socket } from '@/lib/socket';
import { Card, CardContent } from '@/components/ui/card';
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
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }

  if (objects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No objects yet.</p>
        <a href="/create" className="text-primary underline mt-2 inline-block">
          Create your first object
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Objects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {objects.map((obj) => (
          <Card key={obj._id} className="overflow-hidden">
            <a href={`/objects/${obj._id}`}>
              <img
                src={obj.imageUrl}
                alt={obj.title}
                className="w-full h-48 object-cover"
              />
            </a>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <a
                    href={`/objects/${obj._id}`}
                    className="font-semibold text-lg hover:text-primary"
                  >
                    {obj.title}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {obj.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(obj.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(obj._id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
