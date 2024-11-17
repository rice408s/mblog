import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { POST_API } from '../config/api';

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 复用 About 页面的粒子动画效果
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.radius = Math.random() * 1.5;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error('获取文章列表失败');
      }
      const data = await response.json();
      
      // 确保我们总是使用数组
      const posts = Array.isArray(data) ? data : [];
      setPosts(posts);
    } catch (error) {
      console.error('加载文章列表失败:', error);
      toast.error('加载文章列表失败');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const response = await fetch(POST_API.delete(postId), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('删除文章失败');
      
      toast.success('文章已删除');
      // 重新获取文章列表
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
            文章管理
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>
          
          <p className="text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            管理和编辑你的所有文章
          </p>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/edit/new')}
              className="bg-white/[0.02] border border-indigo-500/20 hover:border-indigo-500/40 
                text-white/80 font-light tracking-wider px-8 py-2 rounded-full transition-all duration-300"
            >
              写新文章
            </Button>
            <Button
              onClick={() => navigate('/trash')}
              className="bg-white/[0.02] border border-indigo-500/20 hover:border-indigo-500/40 
                text-white/80 font-light tracking-wider px-8 py-2 rounded-full transition-all duration-300"
            >
              回收站
            </Button>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-white/60 font-light">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-white/60 font-light">暂无文章</div>
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
                        <span className="text-white/40 text-sm font-mono">{post.created}</span>
                        {post.updated && post.updated !== post.created && (
                          <span className="text-white/30 text-xs font-mono">
                            编辑于 {post.updated}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 pl-6">
                      <Link
                        to={`/edit/${post.id}`}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-sm font-light"
                      >
                        编辑文章
                      </Link>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-white/60 hover:text-white/80 transition-colors duration-300 text-sm font-light"
                      >
                        查看文章
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 text-sm font-light"
                      >
                        删除文章
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>

    </div>
  );
} 