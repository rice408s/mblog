import { useState, useEffect, useMemo } from 'react';
import { BlogCard } from '../components/BlogCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { TagCloud } from '../components/TagCloud';
import { CategoryCloud } from '../components/CategoryCloud';

export function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
        if (!response.ok) {
          throw new Error('获取文章列表失败');
        }
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('加载文章列表失败:', error);
        toast.error('加载文章列表失败');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // 获取所有分类和标签
  const categories = useMemo(() => {
    const uniqueCategories = new Set(['全部']);
    posts.forEach(post => {
      if (post.category) {
        uniqueCategories.add(post.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [posts]);

  const allTags = useMemo(() => {
    const uniqueTags = new Set(['全部']);
    posts.forEach(post => {
      if (post.tags) {
        const tags = Array.isArray(post.tags) ? post.tags : 
          typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()) :
          post.tags instanceof Set ? Array.from(post.tags) : [];
        tags.forEach(tag => uniqueTags.add(tag));
      }
    });
    return Array.from(uniqueTags);
  }, [posts]);

  // 过滤和排序文章
  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        const matchesCategory = selectedCategory === '全部' || post.category === selectedCategory;
        
        const tags = Array.isArray(post.tags) ? post.tags : 
          typeof post.tags === 'string' ? post.tags.split(',').map(t => t.trim()) :
          post.tags instanceof Set ? Array.from(post.tags) : [];
        
        const matchesTag = selectedTag === '全部' || tags.includes(selectedTag);
        
        const matchesSearch = !searchQuery || 
          post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return matchesCategory && matchesTag && matchesSearch;
      })
      .sort((a, b) => {
        const getDateTime = (post) => {
          if (post.updated) return new Date(post.updated);
          return new Date(post.created);
        };
        return getDateTime(b) - getDateTime(a);
      });
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-20 space-y-6">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          
          <h1 className="text-4xl font-light tracking-wider text-white/90">
            <span className="font-mono text-indigo-400">&lt;</span>
            Blog
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>
          
          <p className="text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            探索技术与思考的记录
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 bg-white/[0.02] border border-white/[0.05] 
              text-white/80 placeholder:text-white/40 font-light tracking-wider
              focus:outline-none focus:border-indigo-500/30 rounded-lg
              backdrop-blur-sm transition-all duration-300"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            {loading ? (
              <LoadingSpinner />
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
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
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                  bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-white/40 text-sm font-light">暂无相关文章</span>
                </div>
              </div>
            )}
          </div>

          <div className="md:w-64 space-y-8">
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-lg 
              backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
              <h2 className="text-lg font-light text-white/80 mb-4 tracking-wider">
                <span className="text-indigo-400 font-mono">#</span> 分类
              </h2>
              <CategoryCloud 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-lg 
              backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
              <h2 className="text-lg font-light text-white/80 mb-4 tracking-wider">
                <span className="text-indigo-400 font-mono">#</span> 标签
              </h2>
              <TagCloud 
                tags={allTags}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 