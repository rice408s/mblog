import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { MainNavbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BlogCard } from './components/BlogCard';
import { Footer } from './components/Footer';
import { getAllPosts } from './utils/mdUtils';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import About from './components/About';
import { BlogPage } from './pages/BlogPage';
import { BlogList } from './pages/BlogList';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { TagCloud } from './components/TagCloud';
import { CategoryCloud } from './components/CategoryCloud';
import { PostList } from './pages/PostList';
import { PostEditor } from './pages/PostEditor';
import { TrashList } from './pages/TrashList';
import { Gallery } from './pages/Gallery';
import { GalleryUpload } from './pages/GalleryUpload';
import { PhotoGroup } from './pages/PhotoGroup';
import { PhotoList } from './pages/PhotoList';

// 在顶部添加局字体样式
const globalFontStyles = `
  :root {
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    --font-serif: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif CN', serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  body {
    font-family: var(--font-sans);
  }

  .font-serif {
    font-family: var(--font-serif);
  }

  .font-mono {
    font-family: var(--font-mono);
  }
`;

function App() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTag, setSelectedTag] = useState('全部');

  // 获取所有分类
  const categories = ['全部', '技术', '生活', '随笔', '教程'];

  // 获取所有标签
  const getAllTags = () => {
    const tagSet = new Set(['全部']);
    blogPosts.forEach(post => {
      if (post.tags) {
        const tags = Array.isArray(post.tags) ? post.tags : 
          typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()) : [];
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  };

  // 根据分类和标筛选文章
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(blogPosts)) return [];
    
    return blogPosts.filter(post => {
      const matchCategory = selectedCategory === '全部' || post.category === selectedCategory;
      const matchTag = selectedTag === '全部' || (post.tags && (
        Array.isArray(post.tags) ? post.tags.includes(selectedTag) :
        typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()).includes(selectedTag) :
        false
      ));
      return matchCategory && matchTag;
    });
  }, [blogPosts, selectedCategory, selectedTag]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const posts = await getAllPosts();
        setBlogPosts(posts || []); // 确保总是设置数组
      } catch (error) {
        console.error('加载文章列表失败:', error);
        toast.error('加载文章列表失败');
        setBlogPosts([]);
      }
    }
    loadPosts();
  }, []);

  // 设置网站标题和图标
  useEffect(() => {
    // 设置标题
    document.title = '白干饭的个人网站';
    
    // 设置图标
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = '/favicon.svg';
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = '/favicon.svg';
      document.head.appendChild(newFavicon);
    }
  }, []);

  return (
    <>
      <style>{globalFontStyles}</style>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.02)',
            color: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'monospace'
          }
        }} 
      />
      <div className="min-h-screen bg-[#0F0F1A] flex flex-col">
        <MainNavbar />
        <div className="flex-grow relative">
          {/* 背景装饰 - 只保留网格 */}
          <div className="fixed inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
          </div>

          <div className="relative z-10">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <>
                  <HeroSection />
                  <main className="max-w-4xl mx-auto px-4 py-16">
                    {/* 最新文章标 */}
                    <div className="text-center mb-20 space-y-6">
                      {/* 装饰线 */}
                      <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
                      
                      {/* 标题 */}
                      <h2 className="text-4xl font-light tracking-wider text-white/90">
                        <span className="font-mono text-indigo-400">&lt;</span>
                        Latest
                        <span className="font-mono text-indigo-400">/&gt;</span>
                      </h2>
                      
                      {/* 简介 */}
                      <p className="text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
                        最新发布的文章
                      </p>
                    </div>

                    <div className="flex gap-8">
                      {/* 文章列表区域 */}
                      <div className="flex-grow">
                        <div className="space-y-6">
                          {filteredPosts.length > 0 ? (
                            <>
                              {/* 只显示最新的5篇文章 */}
                              {filteredPosts.slice(0, 5).map((post, index) => (
                                <div key={post.id} 
                                  className="animate-fade-up"
                                  style={{ 
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: 0,
                                    animation: `fade-up 0.6s ease-out ${index * 0.1}s forwards`
                                  }}
                                >
                                  <BlogCard post={post} />
                                </div>
                              ))}

                              {/* 如果文章总数超过5篇，显示查看更多按钮 */}
                              {filteredPosts.length > 5 && (
                                <div className="flex justify-center mt-16">
                                  <RouterLink to="/blogs">
                                    <button className="group relative px-8 py-3">
                                      <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                                        backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30"></div>
                                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 
                                        group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                                      <span className="relative z-10 flex items-center gap-2 font-mono tracking-wider 
                                        text-white/60 group-hover:text-white/80">
                                        查看更多文章
                                        <span className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300">
                                          →
                                        </span>
                                      </span>
                                    </button>
                                  </RouterLink>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center text-white/40 font-mono py-12">
                              {blogPosts.length === 0 ? '加载中...' : '暂无相关文章'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 侧边栏 */}
                      <div className="space-y-8">
                        <CategoryCloud 
                          categories={categories}
                          selectedCategory={selectedCategory}
                          onCategorySelect={setSelectedCategory}
                        />
                        <TagCloud 
                          tags={getAllTags()}
                          selectedTag={selectedTag}
                          onTagSelect={setSelectedTag}
                        />
                      </div>
                    </div>
                  </main>
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/blog/:id" element={<BlogPage />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route 
                path="/edit" 
                element={
                  <ProtectedRoute>
                    <PostList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit/new" 
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute>
                    <PostEditor />
                  </ProtectedRoute>
                } 
              />
              <Route path="/trash" element={<TrashList />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route 
                path="/gallery/upload" 
                element={
                  <ProtectedRoute>
                    <GalleryUpload />
                  </ProtectedRoute>
                } 
              />
              <Route path="/gallery/photo/:id" element={<PhotoGroup />} />
              <Route 
                path="/gallery/edit/:id" 
                element={
                  <ProtectedRoute>
                    <GalleryUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/gallery/manage" 
                element={
                  <ProtectedRoute>
                    <PhotoList />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;