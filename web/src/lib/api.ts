import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
});

export interface ObjectItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export async function getObjects(): Promise<ObjectItem[]> {
  const { data } = await api.get<ObjectItem[]>('/objects');
  return data;
}

export async function getObject(id: string): Promise<ObjectItem> {
  const { data } = await api.get<ObjectItem>(`/objects/${id}`);
  return data;
}

export async function createObject(formData: FormData): Promise<ObjectItem> {
  const { data } = await api.post<ObjectItem>('/objects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteObject(id: string): Promise<void> {
  await api.delete(`/objects/${id}`);
}
