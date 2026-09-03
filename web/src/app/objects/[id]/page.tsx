'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getObject, deleteObject, type ObjectItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function ObjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      getObject(params.id as string)
        .then(setObject)
        .catch(() => {
          toast({ title: t('detail.toast.not_found'), variant: 'destructive' });
          router.push('/');
        })
        .finally(() => setLoading(false));
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    if (!object) return;
    setDeleting(true);
    try {
      await deleteObject(object._id);
      toast({ title: t('detail.toast.deleted') });
      router.push('/');
    } catch {
      toast({ title: t('detail.toast.delete_fail'), variant: 'destructive' });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
    );
  }

  if (!object) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">{t('detail.not_found')}</p>
        <a
          href="/"
          className="inline-block mt-4 text-purple-600 hover:text-purple-700 font-medium"
        >
          {t('detail.go_home')}
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-5 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('detail.back')}
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <img
          src={object.imageUrl}
          alt={object.title}
          loading="lazy"
          className="w-full max-h-96 object-cover"
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-purple-900">{object.title}</h1>
              <p className="text-xs text-purple-400 mt-1 font-medium">
                {new Date(object.createdAt).toLocaleString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              {deleting ? t('detail.deleting') : t('detail.delete')}
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-purple-100">
            <p className="text-gray-600 leading-relaxed">{object.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
