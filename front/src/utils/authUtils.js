import { AUTH_API, API_CONFIG, API_METHODS } from '../config/api';

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

export function initiateGitHubLogin() {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user`;
  window.location.href = githubAuthUrl;
}

export function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return !!token;
}

export function setAuthenticated(value) {
  sessionStorage.setItem('isAuthenticated', value);
}

export function clearAuth() {
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('auth_token');
}

export function logout() {
  clearAuth();
  window.location.href = '/';
}

export async function validatePassphrase(passphrase) {
  try {
    const response = await fetch(AUTH_API.VALIDATE, {
      ...API_CONFIG,
      method: API_METHODS.POST,
      body: JSON.stringify({ passphrase })
    });
    
    if (!response.ok) {
      throw new Error('验证请求失败');
    }
    
    const data = await response.json();
    if (data.isValid) {
      localStorage.setItem('authToken', 'valid_token');
      setAuthenticated(true);
    }
    return data.isValid;
  } catch (error) {
    console.error('验证出错:', error);
    return false;
  }
}

export function getAuthToken() {
  return sessionStorage.getItem('isAuthenticated') === 'true' ? 'valid_token' : null;
}

export function setAuthToken(token) {
  sessionStorage.setItem('auth_token', token);
}

export function clearAuthToken() {
  sessionStorage.removeItem('auth_token');
}



