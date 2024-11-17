import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PHOTO_API } from '../config/api';

export function Gallery() {
  const [isAuthenticated] = useState(() => {
    const password = document.cookie
      .split('; ')
      .find(row => row.startsWith('admin_password='));
    return !!password;
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: '全部', icon: '📷' },
    { id: 'life', name: '生活', icon: '🏠' },
    { id: 'travel', name: '旅行', icon: '✈️' },
    { id: 'food', name: '美食', icon: '🍜' },
    { id: 'nature', name: '自然', icon: '🌲' },
    { id: 'city', name: '城市', icon: '🌆' },
    { id: 'people', name: '人物', icon: '👥' },
    { id: 'animal', name: '动物', icon: '🐾' },
    { id: 'other', name: '其他', icon: '📌' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const url = activeCategory === 'all' 
          ? PHOTO_API.LIST
          : `${PHOTO_API.LIST}?category=${activeCategory}`;
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('获取照片失败');
        }
        const data = await response.json();
        setPhotos(data.photos || []);
      } catch (error) {
        console.error('获取照片失败:', error);
        toast.error('获取照片失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [activeCategory]);

  const handleDeletePhoto = async (id) => {
    if (!isAuthenticated) return;
    
    if (!window.confirm('确定要删除这张照片吗？')) return;

    try {
      const response = await fetch(PHOTO_API.delete(id), {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      setPhotos(photos.filter(photo => photo.id !== id));
      toast.success('照片已删除');
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      {/* 背景粒子效果 - 与 About 页面保持一致 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* 头部区域 */}
        <div className="text-center mb-20 space-y-6">
          {/* 装饰线 */}
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          
          <h1 className="text-4xl font-light tracking-wider text-white/90">
            <span className="font-mono text-indigo-400">&lt;</span>
            Gallery
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>
          
          <p className="text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            记录生活中的美好瞬间
          </p>

          {/* 管理按钮 */}
          {isAuthenticated && (
            <div className="flex justify-center gap-4 mt-8">
              <Link
                to="/gallery/manage"
                className="group relative px-8 py-3"
              >
                <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                  backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                <span className="relative z-10 flex items-center gap-2 text-white/60 group-hover:text-white/80">
                  管理照片
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">⚙️</span>
                </span>
              </Link>
              <Link
                to="/gallery/upload"
                className="group relative px-8 py-3"
              >
                <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                  backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                <span className="relative z-10 flex items-center gap-2 text-white/60 group-hover:text-white/80">
                  上传照片
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">📸</span>
                </span>
              </Link>
            </div>
          )}
        </div>
        
        {/* 分类选项 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative px-4 py-2 ${
                activeCategory === category.id
                  ? 'text-white/90'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <div className={`absolute inset-0 rounded-lg backdrop-blur-sm transition-all duration-500
                ${activeCategory === category.id
                  ? 'bg-indigo-500/20 border border-indigo-500/30'
                  : 'bg-white/[0.02] border border-white/[0.05] group-hover:border-indigo-500/20'
                }`} />
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <span className="font-light tracking-wider">{category.name}</span>
              </span>
            </button>
          ))}
        </div>
      
        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-white/60 font-mono">Loading...</p>
          </div>
        )}

        {/* 照片网格 */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Link 
                key={photo.id}
                to={`/gallery/photo/${photo.id}`}
                className="group relative overflow-hidden rounded-lg aspect-square"
              >
                <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.05] 
                  group-hover:border-indigo-500/30 transition-all duration-500" />
                
                {/* 多张照片的指示器 */}
                {photo.urls && photo.urls.length > 1 && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full 
                    bg-black/50 backdrop-blur-sm text-white/90 text-xs z-20">
                    {photo.urls.length} 张
                  </div>
                )}

                {/* 照片展示 */}
                <img
                  src={photo.urls?.[0]}
                  alt={photo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 
                    group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400?text=加载失败';
                  }}
                />

                {/* 信息遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-medium mb-2">{photo.title}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{photo.description}</p>
                        <p className="text-white/60 text-xs mt-2 font-mono">{photo.created}</p>
                      </div>
                      
                      {/* 管理按钮 */}
                      {isAuthenticated && (
                        <div className="flex gap-2">
                          <Link
                            to={`/gallery/edit/${photo.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full bg-white/[0.02] border border-white/[0.05] 
                              hover:border-indigo-500/30 transition-all duration-300"
                          >
                            <span className="text-lg">✏️</span>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeletePhoto(photo.id);
                            }}
                            className="p-2 rounded-full bg-white/[0.02] border border-white/[0.05] 
                              hover:border-red-500/30 transition-all duration-300"
                          >
                            <span className="text-lg">🗑️</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 无照片提示 */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 font-mono">该分类下暂无照片</p>
          </div>
        )}
      </div>
    </div>
  );
} 