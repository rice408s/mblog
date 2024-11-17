import { API_BASE_URL } from '../config/api';

export const getAllPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('获取文章列表失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw error;
  }
};

// 其他 API 调用方法... 