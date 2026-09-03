import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL || '',
});

export interface ObjectItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface PaginatedResponse {
  data: ObjectItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getObjects(
  page = 1,
  limit = 12,
  search?: string,
): Promise<PaginatedResponse> {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;
  const { data } = await api.get<PaginatedResponse>('/api/objects', { params });
  return data;
}

export async function getObject(id: string): Promise<ObjectItem> {
  const { data } = await api.get<ObjectItem>(`/api/objects/${id}`);
  return data;
}

export async function createObject(formData: FormData): Promise<ObjectItem> {
  const { data } = await api.post<ObjectItem>('/api/objects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteObject(id: string): Promise<void> {
  await api.delete(`/api/objects/${id}`);
}
