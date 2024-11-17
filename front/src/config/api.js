const API_BASE_URL = import.meta.env.PROD 
    ? 'https://innov.ink/api'  // 生产环境
    : 'http://localhost:8080/api';  // 开发环境

export const API_ENDPOINTS = {
    POSTS: `${API_BASE_URL}/posts`,
    PHOTOS: `${API_BASE_URL}/photos`,
    VALIDATE_PASSPHRASE: `${API_BASE_URL}/validate-passphrase`,
    UPLOAD: `${API_BASE_URL}/upload`,
    AUTH: `${API_BASE_URL}/auth`,  // 添加认证端点
}; 

// 添加认证相关的配置
export const AUTH_API = {
    LOGIN: `${API_ENDPOINTS.AUTH}/login`,
    LOGOUT: `${API_ENDPOINTS.AUTH}/logout`,
    CALLBACK: `${API_ENDPOINTS.AUTH}/callback`,
};

// 添加 API 方法配置
export const API_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
};

// 添加通用 API 配置
export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
}; 