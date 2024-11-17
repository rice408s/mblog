import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PHOTO_API, API_CONFIG, API_METHODS } from '../config/api';

export function GalleryUpload() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkLinks, setBulkLinks] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  
  // 获取当前日期的年、月、日
  const now = new Date();
  const [dateInfo, setDateInfo] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  });

  // 添加拖拽相关的状态和处理函数
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);

  // 处理拖拽开始
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (draggedIndex !== null && draggedOverIndex !== null) {
      const newPhotos = [...photos];
      const [draggedPhoto] = newPhotos.splice(draggedIndex, 1);
      newPhotos.splice(draggedOverIndex, 0, draggedPhoto);
      setPhotos(newPhotos);
    }
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  // 处理拖拽悬停
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index !== draggedOverIndex) {
      setDraggedOverIndex(index);
    }
  };

  // 如果是编辑模式，获取照片数据
  useEffect(() => {
    if (id) {
      const fetchPhoto = async () => {
        try {
          const response = await fetch(PHOTO_API.getDetail(id));
          if (!response.ok) {
            throw new Error('获取照片失败');
          }
          const data = await response.json();
          
          // 设置表单数据
          setFormData({
            category: data.category || 'life',
            created: data.created || formData.created,
            title: data.title || '',
            description: data.description || ''
          });

          // 设置照片数据
          setPhotos(data.urls || []);

          // 解析创建日期
          if (data.created) {
            const [year, month, day] = data.created.split('-').map(Number);
            setDateInfo({ year, month, day });
          }
        } catch (error) {
          console.error('获取照片失败:', error);
          toast.error('获取照片失败');
          navigate('/gallery');
        }
      };

      fetchPhoto();
    }
  }, [id, navigate]);

  // 将年月日转换为 YYYY-MM-DD 格式
  const getFormattedDate = ({ year, month, day }) => {
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const [formData, setFormData] = useState({
    category: 'life',
    created: getFormattedDate({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    }),
    title: '',
    description: ''
  });

  const categories = [
    { id: 'life', name: '生活', icon: '🏠' },
    { id: 'travel', name: '旅行', icon: '✈️' },
    { id: 'food', name: '美食', icon: '🍜' },
    { id: 'nature', name: '自然', icon: '🌲' },
    { id: 'city', name: '城市', icon: '🌆' },
    { id: 'people', name: '人物', icon: '👥' },
    { id: 'animal', name: '动物', icon: '🐾' },
    { id: 'other', name: '其他', icon: '📌' }
  ];

  const handleBulkLinksSubmit = () => {
    const links = bulkLinks
      .split(/[\n,，\s]+/)
      .filter(link => link.trim())
      .map(link => link.trim());

    if (links.length === 0) {
      toast.error('请输入有效的图片链接');
      return;
    }

    setPhotos(prev => [...prev, ...links]);
    setBulkLinks('');
    toast.success(`已添加 ${links.length} 张照片`);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (photos.length === 0) {
      toast.error('请至少添加一张照片');
      return;
    }

    if (!formData.title) {
      toast.error('请填写标题');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        id ? PHOTO_API.update(id) : PHOTO_API.LIST,
        {
          ...API_CONFIG,
          method: id ? API_METHODS.PUT : API_METHODS.POST,
          body: JSON.stringify({
            urls: photos,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            created: formData.created
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '保存失败');
      }

      await response.json();
      toast.success(id ? '照片更新成功！' : '照片添加成功！');
      navigate('/gallery');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error(error.message || '保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
      <div className="mb-12">
        <h1 className="text-3xl font-light text-white/90 mb-8">
          {id ? '编辑照片' : '添加照片'}
        </h1>
      </div>
      
      {/* 批量添加链接区域 */}
      <div className="mb-8 p-6 rounded-lg bg-white/[0.02] border border-white/10 space-y-4">
        <div>
          <label className="block text-white/80 mb-2">批量添加图片链接</label>
          <textarea
            value={bulkLinks}
            onChange={(e) => setBulkLinks(e.target.value)}
            placeholder="在此粘贴多个图片链接，每行一个链接，或用逗号、空格分隔"
            className="w-full px-4 py-2 rounded-lg bg-white/[0.02] border border-white/10 
              focus:border-indigo-500/30 text-white/90 outline-none h-32 resize-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-white/50 text-sm">支持多种分隔方式：换行、逗号、空格</p>
          <button
            type="button"
            onClick={handleBulkLinksSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-500/20 text-white border border-indigo-500/30
              hover:bg-indigo-500/30 transition-colors duration-300"
          >
            批量添加
          </button>
        </div>
      </div>

      {/* 预览图片网格 */}
      {photos.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-light text-white/80">已添加的图片</h2>
            <p className="text-white/40 text-sm">拖拽照片可调整顺序</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((url, index) => (
              <div 
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                className={`group relative aspect-square rounded-lg overflow-hidden bg-white/[0.02] border 
                  transition-all duration-300 cursor-move
                  ${draggedIndex === index ? 'opacity-50 border-indigo-500/50' : 'border-white/10'}
                  ${draggedOverIndex === index ? 'border-indigo-500/50 scale-105' : ''}
                `}
              >
                <img
                  src={url}
                  alt={`图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                  onClick={() => setPreviewImage(url)}
                  onError={(e) => {
                    e.target.onerror = null;
                    toast.error('图片链接无效');
                  }}
                />
                {/* 序号标签 */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/50 
                  text-white/90 text-xs backdrop-blur-sm">
                  {index + 1}
                </div>
                {/* 修改删除按钮，添加 draggable="false" 并阻止拖拽事件 */}
                <button
                  draggable="false"
                  onDragStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(index);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 
                    text-white/80 hover:bg-black/70 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    cursor-pointer z-10"
                >
                  ×
                </button>
                {/* 拖拽提示 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-white/90">拖拽调整位置</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 照片信息表单 */}
      {photos.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 rounded-lg bg-white/[0.02] border border-white/10 space-y-6">
            {/* 标题输入 */}
            <div>
              <label className="block text-white/80 mb-2">标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="为这组照片添加一个标题..."
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
                  focus:border-indigo-500/30 text-white/90 outline-none"
              />
            </div>

            {/* 描述输入 */}
            <div>
              <label className="block text-white/80 mb-2">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="添加一些描述，比如拍摄地点、心情感受等..."
                className="w-full px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
                  focus:border-indigo-500/30 text-white/90 outline-none h-32 resize-none"
              />
            </div>

            {/* 拍摄时间 */}
            <div>
              <label className="block text-white/80 mb-2">拍摄日期</label>
              <div className="flex gap-4">
                <select
                  value={dateInfo.year}
                  onChange={(e) => {
                    const newDateInfo = {
                      ...dateInfo,
                      year: parseInt(e.target.value)
                    };
                    setDateInfo(newDateInfo);
                    setFormData(prev => ({
                      ...prev,
                      created: getFormattedDate(newDateInfo)
                    }));
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
                    focus:border-indigo-500/30 text-white/90 outline-none appearance-none
                    cursor-pointer hover:bg-white/[0.04] transition-colors"
                >
                  {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>

                <select
                  value={dateInfo.month}
                  onChange={(e) => {
                    const newDateInfo = {
                      ...dateInfo,
                      month: parseInt(e.target.value)
                    };
                    setDateInfo(newDateInfo);
                    setFormData(prev => ({
                      ...prev,
                      created: getFormattedDate(newDateInfo)
                    }));
                  }}
                  className="w-32 px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
                    focus:border-indigo-500/30 text-white/90 outline-none appearance-none
                    cursor-pointer hover:bg-white/[0.04] transition-colors"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{month}月</option>
                  ))}
                </select>

                <select
                  value={dateInfo.day}
                  onChange={(e) => {
                    const newDateInfo = {
                      ...dateInfo,
                      day: parseInt(e.target.value)
                    };
                    setDateInfo(newDateInfo);
                    setFormData(prev => ({
                      ...prev,
                      created: getFormattedDate(newDateInfo)
                    }));
                  }}
                  className="w-32 px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
                    focus:border-indigo-500/30 text-white/90 outline-none appearance-none
                    cursor-pointer hover:bg-white/[0.04] transition-colors"
                >
                  {Array.from(
                    { length: new Date(dateInfo.year, dateInfo.month, 0).getDate() }, 
                    (_, i) => i + 1
                  ).map(day => (
                    <option key={day} value={day}>{day}日</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 分类选择 */}
            <div>
              <label className="block text-white/80 mb-2">分类</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      category: category.id
                    }))}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                      ${formData.category === category.id
                        ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                        : 'text-white/60 border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.02]'
                      }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="px-6 py-2 rounded-lg bg-white/[0.02] border border-white/10
                hover:border-white/20 text-white/70 transition-all duration-300"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting || photos.length === 0}
              className="px-6 py-2 rounded-lg bg-indigo-500/20 text-white border border-indigo-500/30
                hover:bg-indigo-500/30 transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : (id ? '更新' : '保存')}
            </button>
          </div>
        </form>
      )}

      {/* 大图预览模态框 */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 
                text-white/80 hover:bg-black/70 flex items-center justify-center"
            >
              ×
            </button>
            <img
              src={previewImage}
              alt="预览图片"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
} 