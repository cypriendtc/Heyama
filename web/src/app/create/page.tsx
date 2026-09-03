'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createObject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !file) {
      toast({ title: 'Please fill all fields and select an image', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', file);
      await createObject(formData);
      toast({ title: 'Object created successfully!' });
      router.push('/');
    } catch {
      toast({ title: 'Failed to create object', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-fuchsia-600 px-6 py-5">
          <h1 className="text-xl font-bold text-white">Create New Object</h1>
          <p className="text-purple-200 text-sm mt-1">Add an object to your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-purple-900 font-medium">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="rounded-xl border-purple-200 focus-visible:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-900 font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="rounded-xl border-purple-200 focus-visible:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-purple-900 font-medium">Image</Label>
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-xl max-h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
                <span className="text-purple-500 text-sm font-medium">Tap to select image</span>
              </button>
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFileChange}
              className="hidden"
              required={!file}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full h-11 font-medium"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Object'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="rounded-full h-11 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
