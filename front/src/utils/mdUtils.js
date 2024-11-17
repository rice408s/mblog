export async function getAllPosts() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
    if (!response.ok) {
      throw new Error('获取文章列表失败');
    }
    const data = await response.json();
    
    const posts = Array.isArray(data) ? data : [];
    
    const validPosts = posts.map(post => ({
      id: post.id || '',
      title: post.title || '无标题',
      created: post.created || '',
      updated: post.updated || '',
      category: post.category || '随笔',
      summary: post.summary || '',
      tags: Array.isArray(post.tags) ? post.tags : [],
      content: post.content || ''
    }));
    
    return validPosts.sort((a, b) => {
      const dateA = new Date(a.created.replace(' ', 'T'));
      const dateB = new Date(b.created.replace(' ', 'T'));
      return dateB - dateA;
    });
  } catch (error) {
    console.error('加载文章列表失败:', error);
    return [];
  }
}

export async function getPostById(id) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error('获取文章失败');
    }
    const post = await response.json();
    return {
      id: post.id || '',
      title: post.title || '无标题',
      created: post.created || '',
      updated: post.updated || '',
      category: post.category || '随笔',
      summary: post.summary || '',
      tags: Array.isArray(post.tags) ? post.tags : [],
      content: post.content || ''
    };
  } catch (error) {
    console.error('加载文章失败:', error);
    return null;
  }
} 