import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { POST_API, API_CONFIG, API_METHODS } from '../config/api';
import { PostBasicInfo } from '../components/PostBasicInfo';
import { MarkdownEditor } from '../components/MarkdownEditor';
import 'highlight.js/styles/github.css';

// 添加 markdownStyles 定义
const markdownStyles = `
  .markdown-preview {
    white-space: normal;
    word-wrap: break-word;
  }
  .markdown-preview > div {
    display: inline;
    margin-right: 0.5rem;
  }
  .markdown-preview > div:has(pre) {
    display: block;
    margin: 1rem 0;
  }
  .markdown-preview > div:has(img) {
    display: block;
    margin: 1rem 0;
  }
  .hljs-ln-numbers {
    background: transparent !important;
    border-right: none !important;
  }
  .hljs {
    background: transparent !important;
  }
  .hljs-ln-line {
    background: transparent !important;
  }
`;

// 修改分类数据
const categories = [
  { label: "技术", value: "技术" },
  { label: "生活", value: "生活" },
  { label: "随笔", value: "随笔" },
  { label: "阅读", value: "阅读" },
  { label: "其他", value: "其他" }
];

const commonTags = [
  { label: "AI", value: "AI" },
  { label: "技术", value: "技术" },
  { label: "编程", value: "编程" },
  { label: "React", value: "React" },
  { label: "Go", value: "Go" },
  { label: "生活", value: "生活" },
  { label: "阅读", value: "阅读" },
  { label: "随笔", value: "随笔" }
];

// 修改 Markdown 工具按钮数据，添加图片按钮
const markdownTools = [
  { type: 'bold', label: '粗体' },
  { type: 'italic', label: '斜体' },
  { type: 'code', label: '行内代码' },
  { type: 'codeblock', label: '代码块' },
  { type: 'link', label: '链接' },
  { type: 'image', label: '图片' },
  { type: 'quote', label: '引用' },
  { type: 'list', label: '列表' },
  { type: 'heading', label: '标题' }
];

export function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const editorRef = useRef(null);
  
  // 修改初始状态
  const [post, setPost] = useState({
    title: '',
    category: '随笔',
    summary: '',
    content: '',
    tags: [],
  });

  // 添加缺失的状态
  const [isLoading, setIsLoading] = useState(false);

  // 添加粒子动画效果
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

  // 加载文章数据
  useEffect(() => {
    if (id === 'new') return;

    async function loadPost() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`);
        if (!response.ok) {
          throw new Error('获取文章失败');
        }
        const data = await response.json();
        setPost({
          title: data.title || '',
          category: data.category || '随笔',
          summary: data.summary || '',
          content: data.content || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          created: data.created,
        });
      } catch (error) {
        console.error('加载文章失败:', error);
        toast.error('加载文章失败');
      }
    }
    loadPost();
  }, [id]);

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!post.title || !post.content) {
      toast.error('标题和内容不能为空');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(
        id === 'new' ? POST_API.LIST : POST_API.update(id),
        {
          ...API_CONFIG,
          method: id === 'new' ? API_METHODS.POST : API_METHODS.PUT,
          body: JSON.stringify(post),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '保存失败');
      }

      const data = await response.json();
      
      toast.success(id === 'new' ? '文章保存成功！' : '文章更新成功！');
      navigate(`/blog/${data.url}`);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || '保存失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理 Markdown 工具点击
  const insertMarkdown = (type) => {
    const textarea = editorRef.current;
    if (!textarea) {
      console.error('找不到编辑器元素');
      return;
    }
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let insertText = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        insertText = `**${selectedText || ''}**`;
        cursorOffset = selectedText ? selectedText.length + 2 : 2;
        break;
      case 'italic':
        insertText = `*${selectedText || ''}*`;
        cursorOffset = selectedText ? selectedText.length + 1 : 1;
        break;
      case 'code':
        insertText = `\`${selectedText || ''}\``;
        cursorOffset = selectedText ? selectedText.length + 1 : 1;
        break;
      case 'codeblock':
        insertText = `\`\`\`\n${selectedText || ''}\n\`\`\``;
        cursorOffset = selectedText ? selectedText.length + 4 : 4;
        break;
      case 'link':
        insertText = `[${selectedText || ''}](url)`;
        cursorOffset = selectedText ? selectedText.length + 2 : 1;
        break;
      case 'quote':
        insertText = `> ${selectedText || ''}`;
        cursorOffset = selectedText ? selectedText.length + 2 : 2;
        break;
      case 'list':
        insertText = selectedText ? 
          selectedText.split('\n').map(line => `- ${line}`).join('\n') : 
          '- ';
        cursorOffset = selectedText ? insertText.length : 2;
        break;
      case 'heading':
        insertText = `## ${selectedText || ''}`;
        cursorOffset = selectedText ? selectedText.length + 3 : 3;
        break;
      case 'image':
        insertText = `![图片]()`;
        cursorOffset = selectedText ? selectedText.length + 2 : 1;
        break;
      default:
        return;
    }

    const newContent = 
      post.content.substring(0, start) +
      insertText +
      post.content.substring(end);
    
    setPost(prev => ({
      ...prev,
      content: newContent
    }));
    
    // 使用 requestAnimationFrame 确保在下一帧更新光标位置
    requestAnimationFrame(() => {
      textarea.focus();
      const newPosition = start + (type === 'image' ? insertText.length - 1 : (selectedText ? 0 : cursorOffset));
      textarea.setSelectionRange(newPosition, newPosition);
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
      <style>{markdownStyles}</style>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* 头部区域 */}
        <div className="text-center mb-20 space-y-6">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          
          <h1 className="text-4xl font-light tracking-wider text-white/90">
            <span className="font-mono text-indigo-400">&lt;</span>
            {id === 'new' ? '写作' : '编辑'}
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <PostBasicInfo
            post={post}
            onPostChange={setPost}
            categories={categories}
            commonTags={commonTags}
            aria-label="文章基本信息"
          />

          <MarkdownEditor
            content={post.content}
            onChange={(value) => setPost(prev => ({ ...prev, content: value }))}
            markdownTools={markdownTools}
            onToolClick={insertMarkdown}
            editorRef={editorRef}
          />

          {/* 提交按钮 */}
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-white/[0.02] border border-indigo-500/20 hover:border-indigo-500/40 
                text-white/80 font-light tracking-wider px-8 py-2 rounded-full transition-all duration-300"
            >
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 