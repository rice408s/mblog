import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPost } from '../components/BlogPost';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export function BlogPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`);
        if (!response.ok) {
          throw new Error('获取文章失败');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('加载文章失败:', error);
        toast.error('加载文章失败');
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60">文章不存在</p>
      </div>
    );
  }

  return <BlogPost post={post} />;
} 