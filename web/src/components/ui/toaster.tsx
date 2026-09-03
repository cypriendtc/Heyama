'use client';

import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border px-4 py-3 shadow-lg bg-white text-sm ${
            toast.variant === 'destructive' ? 'border-red-500 text-red-700' : 'border-border'
          }`}
        >
          {toast.title && <p className="font-medium">{toast.title}</p>}
          {toast.description && <p className="text-muted-foreground">{toast.description}</p>}
        </div>
      ))}
    </div>
  );
}
