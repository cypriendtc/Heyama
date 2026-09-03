'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let listeners: Array<(toasts: Toast[]) => void> = [];
let toastState: Toast[] = [];
let count = 0;

function dispatch(toasts: Toast[]) {
  toastState = toasts;
  listeners.forEach((listener) => listener(toasts));
}

export function toast({
  title,
  description,
  variant = 'default',
}: Omit<Toast, 'id'>) {
  const id = String(count++);
  const newToast = { id, title, description, variant };
  dispatch([...toastState, newToast]);
  setTimeout(() => {
    dispatch(toastState.filter((t) => t.id !== id));
  }, 3000);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastState);

  useState(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  });

  return { toasts, toast };
}
