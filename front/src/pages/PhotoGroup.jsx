import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { PHOTO_API } from '../config/api';

export function PhotoGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(PHOTO_API.getDetail(id));
        if (!response.ok) {
          throw new Error('获取照片失败');
        }
        const data = await response.json();
        setPhoto(data);
        setLoading(false);
      } catch (error) {
        console.error('获取照片失败:', error);
        toast.error('获取照片失败');
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photo.urls.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < photo.urls.length - 1 ? prev + 1 : 0));
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [photo]);

  // 添加分类映射
  const categoryMap = {
    'life': '生活',
    'travel': '旅行',
    'food': '美食',
    'nature': '自然',
    'city': '城市',
    'people': '人物',
    'animal': '动物',
    'other': '其他'
  };

  // 添加分类图标映射
  const categoryIcons = {
    'life': '🏠',
    'travel': '✈️',
    'food': '🍜',
    'nature': '🌲',
    'city': '🌆',
    'people': '👥',
    'animal': '🐾',
    'other': '📌'
  };

  // 全屏模式的组件
  const FullscreenView = () => {
    if (!isFullscreen) return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        onClick={() => setIsFullscreen(false)}
      >
        <img
          src={photo.urls[currentIndex]}
          alt={photo.title}
          className="max-w-full max-h-full object-contain"
          onClick={e => e.stopPropagation()}
        />
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white/90 
            hover:bg-black/70 transition-colors"
        >
          ✕
        </button>
      </div>,
      document.body
    );
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
            <p className="text-white/60 font-mono">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6">
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
            <div className="text-4xl">😢</div>
            <p className="text-white/60">照片不存在</p>
            <button
              onClick={() => navigate('/gallery')}
              className="group relative px-8 py-3"
            >
              <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
              <span className="relative z-10 flex items-center gap-2 text-white/60 group-hover:text-white/80">
                返回照片墙
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <FullscreenView />
      <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

        {/* 主内容 */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          {/* 返回按钮 */}
          <button
            onClick={() => navigate('/gallery')}
            className="group relative px-6 py-2 mb-12"
          >
            <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
              backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
            <span className="relative z-10 flex items-center gap-2 text-white/60 group-hover:text-white/80">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              返回照片墙
            </span>
          </button>

          {/* 标题区域 */}
          <div className="text-center mb-12 space-y-6">
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
            
            <h1 className="text-4xl font-light tracking-wider text-white/90">
              <span className="font-mono text-indigo-400">&lt;</span>
              {photo.title}
              <span className="font-mono text-indigo-400">/&gt;</span>
            </h1>
            
            <p className="text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
              {photo.description}
            </p>

            {/* 照片信息 */}
            <div className="flex justify-center gap-4">
              <div className="group relative px-4 py-2">
                <div className="absolute inset-0 bg-white/[0.02] rounded-full border border-white/[0.05] 
                  backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                <span className="relative z-10 flex items-center gap-2 text-white/60">
                  <span>📅</span>
                  <span className="font-mono">{photo.created}</span>
                </span>
              </div>
              <div className="group relative px-4 py-2">
                <div className="absolute inset-0 bg-white/[0.02] rounded-full border border-white/[0.05] 
                  backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                <span className="relative z-10 flex items-center gap-2 text-white/60">
                  <span>{categoryIcons[photo.category] || '🏷️'}</span>
                  <span>{categoryMap[photo.category] || photo.category}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 照片展示区域 */}
          <div className="relative group bg-white/[0.02] rounded-lg border border-white/[0.05] p-2
            backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30">
            {/* 主图 */}
            <div 
              className="aspect-[16/9] rounded-lg overflow-hidden cursor-zoom-in"
              onClick={() => setIsFullscreen(true)}
            >
              <img
                src={photo.urls[currentIndex]}
                alt={`${photo.title} - ${currentIndex + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x450?text=加载失败';
                }}
              />
            </div>

            {/* 导航按钮 */}
            {photo.urls.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300"
                >
                  <div className="group relative px-4 py-3">
                    <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                      backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                    <span className="relative z-10 flex items-center gap-2 text-white/60 group-hover:text-white/80">
                      <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300"
                >
                  <div className="group relative px-4 py-3">
                    <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                      backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                    <span className="relative z-10 flex items-center gap-2 text-white/60 group-hover:text-white/80">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </div>
                </button>
              </>
            )}

            {/* 照片计数 */}
            {photo.urls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                transition-opacity duration-300">
                <div className="group relative px-4 py-2">
                  <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                    backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                  <span className="relative z-10 text-white/60 text-sm font-mono">
                    {currentIndex + 1} / {photo.urls.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 缩略图预览 */}
          {photo.urls.length > 1 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {photo.urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`group relative aspect-square rounded-lg overflow-hidden 
                    transition-all duration-300`}
                >
                  <div className="absolute inset-0 bg-white/[0.02] border backdrop-blur-sm 
                    transition-all duration-500 group-hover:border-indigo-500/30
                    ${index === currentIndex ? 'border-indigo-500/30' : 'border-white/[0.05]'}" />
                  <img
                    src={url}
                    alt={`缩略图 ${index + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300
                      ${index === currentIndex ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/100?text=Error';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* 提示信息 */}
          <div className="mt-8 text-center">
            <p className="text-white/40 font-mono text-sm">
              使用键盘方向键 ← → 切换图片，点击图片进入全屏模式
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 