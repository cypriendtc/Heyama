'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getObject, deleteObject, type ObjectItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function ObjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getObject(params.id as string)
        .then(setObject)
        .catch(() => {
          toast({ title: 'Object not found', variant: 'destructive' });
          router.push('/');
        })
        .finally(() => setLoading(false));
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!object) return;
    try {
      await deleteObject(object._id);
      toast({ title: 'Object deleted' });
      router.push('/');
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }

  if (!object) {
    return <p className="text-center text-muted-foreground">Object not found</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
      </Button>

      <Card className="overflow-hidden">
        <img
          src={object.imageUrl}
          alt={object.title}
          className="w-full max-h-96 object-cover"
        />
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{object.title}</CardTitle>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{object.description}</p>
          <p className="text-xs text-muted-foreground mt-4">
            Created: {new Date(object.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
