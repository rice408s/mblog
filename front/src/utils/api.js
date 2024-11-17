import { API_CONFIG } from '../config/config';

export const API = {
  validatePassphrase: `${API_CONFIG.BASE_URL}/validate-passphrase`,
  posts: `${API_CONFIG.BASE_URL}/posts`,
  upload: `${API_CONFIG.BASE_URL}/upload`,
  photos: `${API_CONFIG.BASE_URL}/photos`,
  trash: `${API_CONFIG.BASE_URL}/trash`
}; 