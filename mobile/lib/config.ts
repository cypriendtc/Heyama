import { Platform } from 'react-native';

const DEV_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export const API_URL = DEV_API_URL;
