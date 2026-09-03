'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getObject, deleteObject, type ObjectItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export default function ObjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [object, setObject] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const confirmDelete = async () => {
    if (!object) return;
    setDeleting(true);
    try {
      await deleteObject(object._id);
      toast({ title: t('detail.toast.deleted') });
      router.push('/');
    } catch {
      toast({ title: t('detail.toast.delete_fail'), variant: 'destructive' });
      setDeleting(false);
      setShowDeleteDialog(false);
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
              onClick={() => setShowDeleteDialog(true)}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-red-100">
          <AlertDialogHeader>
            <div className="mx-auto sm:mx-0 w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <AlertDialogTitle className="text-purple-900">
              {t('detail.confirm_delete_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('detail.confirm_delete_desc')}{' '}
              <span className="font-semibold text-purple-700">{object.title}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              {t('detail.confirm_cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {deleting ? t('detail.deleting') : t('detail.confirm_delete_btn')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
