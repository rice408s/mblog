import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PHOTO_API, API_CONFIG, API_METHODS } from '../config/api';

export function PhotoList() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取照片数据
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(PHOTO_API.LIST);
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
  }, []);

  // 删除照片
  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这组照片吗？')) return;

    try {
      const response = await fetch(PHOTO_API.delete(id), {
        ...API_CONFIG,
        method: API_METHODS.DELETE
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
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light text-white/90">照片管理</h1>
        <Link
          to="/gallery/upload"
          className="px-4 py-2 rounded-lg bg-indigo-500/20 text-white border border-indigo-500/30
            hover:bg-indigo-500/30 transition-colors duration-300 flex items-center gap-2"
        >
          <span>添加照片</span>
          <span>📸</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/60">加载中...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60">暂无照片</p>
        </div>
      ) : (
        <div className="space-y-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="p-4 rounded-lg bg-white/[0.02] border border-white/10 
                hover:border-white/20 transition-colors group"
            >
              <div className="flex items-start gap-4">
                {/* 缩略图 */}
                <div className="w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={photo.urls[0]}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/160?text=Error';
                    }}
                  />
                </div>

                {/* 信息区域 */}
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-medium text-white/90 mb-2">{photo.title}</h2>
                      <p className="text-white/60 line-clamp-2 mb-2">{photo.description}</p>
                      <div className="flex gap-4">
                        <span className="text-white/40 text-sm">📅 {photo.created}</span>
                        <span className="text-white/40 text-sm">📁 {photo.category}</span>
                        <span className="text-white/40 text-sm">🖼️ {photo.urls.length} 张照片</span>
                      </div>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/gallery/edit/${photo.id}`)}
                        className="p-2 rounded-lg bg-indigo-500/20 text-white/90 hover:bg-indigo-500/30
                          border border-indigo-500/30 transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-white/90 hover:bg-red-500/30
                          border border-red-500/30 transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {/* 预览图片 */}
                  {photo.urls.length > 1 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                      {photo.urls.slice(1).map((url, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/20"
                        >
                          <img
                            src={url}
                            alt={`预览图 ${index + 2}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80?text=Error';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 