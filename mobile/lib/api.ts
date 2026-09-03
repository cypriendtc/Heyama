import axios from 'axios';
import { API_URL } from './config';

export { API_URL };

export const api = axios.create({ baseURL: API_URL });

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

export async function createObjectFromForm(
  title: string,
  description: string,
  imageUri: string,
  imageName: string,
  imageType: string,
): Promise<ObjectItem> {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('image', {
    uri: imageUri,
    name: imageName || 'photo.jpg',
    type: imageType || 'image/jpeg',
  } as any);

  const { data } = await api.post<ObjectItem>('/objects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteObject(id: string): Promise<void> {
  await api.delete(`/objects/${id}`);
}
