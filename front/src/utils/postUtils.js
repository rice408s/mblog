import { POST_API, API_CONFIG, API_METHODS } from '../config/api';

export async function savePost(post) {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('未登录');
    }

    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const markdown = `---
title: ${post.title}
date: ${post.date}
time: ${time}
summary: ${post.summary || ''}
category: ${post.category || '未分类'}
tags:${post.tags.length > 0 ? post.tags.map(tag => `\n  - ${tag}`).join('') : '\n  - 未分类'}
---

${post.content}`;

    const response = await fetch(POST_API.LIST, {
      ...API_CONFIG,
      method: API_METHODS.POST,
      headers: {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: post.title,
        content: markdown,
        category: post.category || '未分类',
        summary: post.summary || '',
        tags: post.tags || [],
        createdAt: post.date || new Date().toISOString().split('T')[0],
        time: time
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '保存失败');
    }

    return await response.json();
  } catch (error) {
    console.error('保存文章失败:', error);
    throw error;
  }
} 