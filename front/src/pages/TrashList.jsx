import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody } from "@nextui-org/react";
import { Footer } from '../components/Footer';
import { toast } from 'react-hot-toast';
import { POST_API, API_CONFIG, API_METHODS } from '../config/api';

export function TrashList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 复用粒子动画效果
  useEffect(() => {
    // ... 粒子动画代码与 PostList 相同 ...
  }, []);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trash`);
      if (!response.ok) {
        throw new Error('获取回收站文章失败');
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('加载回收站文章失败:', error);
      toast.error('加载回收站文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (postId) => {
    try {
      const response = await fetch(POST_API.restore(postId), {
        ...API_CONFIG,
        method: API_METHODS.POST
      });

      if (!response.ok) throw new Error('恢复文章失败');
      
      toast.success('文章已恢复');
      loadPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePermanentDelete = async (postId) => {
    try {
      if (!window.confirm('确定要永久删除这篇文章吗？此操作不可恢复！')) {
        return;
      }

      const response = await fetch(POST_API.permanentDelete(postId), {
        ...API_CONFIG,
        method: API_METHODS.DELETE
      });

      if (!response.ok) throw new Error('永久删除文章失败');
      
      toast.success('文章已永久删除');
      loadPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* 头部区域 */}
        <div className="text-center mb-20 space-y-6">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          
          <h1 className="text-4xl font-light tracking-wider text-white/90">
            <span className="font-mono text-indigo-400">&lt;</span>
            回收站
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>
          
          <p className="text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            已删除的文章可以在这里恢复
          </p>

          <Button
            onClick={() => navigate('/edit')}
            className="bg-white/[0.02] border border-indigo-500/20 hover:border-indigo-500/40 
              text-white/80 font-light tracking-wider px-8 py-2 rounded-full transition-all duration-300"
          >
            返回文章列表
          </Button>
        </div>

        {/* 文章列表 */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-white/60 font-light">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-white/60 font-light">回收站为空</div>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30
                  transition-all duration-500"
              >
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-light tracking-wide text-white/80">
                        <span className="text-indigo-400 font-mono mr-2">&gt;</span>
                        {post.title}
                      </h2>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-white/40 text-sm font-mono">{post.date}</span>
                        {post.updated && post.updated !== `${post.date} ${post.time || ''}`.trim() && (
                          <span className="text-white/30 text-xs font-mono">
                            编辑于 {post.updated}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 pl-6">
                      <button
                        onClick={() => handleRestore(post.id)}
                        className="text-green-400 hover:text-green-300 transition-colors duration-300 text-sm font-light"
                      >
                        恢复文章
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(post.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 text-sm font-light"
                      >
                        永久删除
                      </button>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-white/60 hover:text-white/80 transition-colors duration-300 text-sm font-light"
                      >
                        查看文章
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 