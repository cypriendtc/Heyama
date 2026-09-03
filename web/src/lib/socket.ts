'use client';

import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getSocketUrl() {
  if (API_URL) return API_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:3001';
}

export const socket = io(getSocketUrl(), {
  autoConnect: false,
  path: '/socket.io',
});
