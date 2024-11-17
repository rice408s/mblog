import PropTypes from 'prop-types';
import { Select, SelectItem } from "@nextui-org/react";
import { POST_CONFIG } from '../config/config';

export function PostBasicInfo({ post, onPostChange }) {
  // 确保 post.tags 是数组
  const ensureArray = (value) => Array.isArray(value) ? value : [];

  // 处理标签变化
  const handleTagsChange = (event) => {
    const value = event.target.value;
    onPostChange({
      ...post,
      tags: ensureArray(value)
    });
  };

  // 添加自定义标签
  const handleCustomTagAdd = (event) => {
    if (event.key === 'Enter' && event.target.value.trim()) {
      event.preventDefault();
      const newTag = event.target.value.trim();
      if (!ensureArray(post.tags).includes(newTag)) {
        onPostChange({
          ...post,
          tags: [...ensureArray(post.tags), newTag]
        });
      }
      event.target.value = '';
    }
  };

  // 移除标签
  const handleTagRemove = (tagToRemove) => {
    onPostChange({
      ...post,
      tags: ensureArray(post.tags).filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="p-6 rounded-lg bg-white/[0.02] border border-white/10 space-y-6">
      {/* 标题输入 */}
      <div>
        <label className="block text-white/80 mb-2">标题</label>
        <input
          type="text"
          value={post.title}
          onChange={(e) => onPostChange({ ...post, title: e.target.value })}
          placeholder="输入文章标题..."
          className="w-full px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
            focus:border-indigo-500/30 text-white/90 outline-none"
        />
      </div>

      {/* 分类选择 */}
      <div>
        <label className="block text-white/80 mb-2">分类</label>
        <Select
          value={post.category}
          onChange={(e) => onPostChange({ ...post, category: e.target.value })}
          className="max-w-xs"
          variant="bordered"
        >
          {POST_CONFIG.CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* 摘要输入 */}
      <div>
        <label className="block text-white/80 mb-2">摘要</label>
        <textarea
          value={post.summary}
          onChange={(e) => onPostChange({ ...post, summary: e.target.value })}
          placeholder="输入文章摘要..."
          className="w-full px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
            focus:border-indigo-500/30 text-white/90 outline-none h-24 resize-none"
        />
      </div>

      {/* 标签管理 */}
      <div>
        <label className="block text-white/80 mb-2">标签</label>
        <div className="space-y-4">
          {/* 常用标签 */}
          <div className="flex flex-wrap gap-2">
            {POST_CONFIG.COMMON_TAGS.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => {
                  if (!ensureArray(post.tags).includes(tag.value)) {
                    onPostChange({
                      ...post,
                      tags: [...ensureArray(post.tags), tag.value]
                    });
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-300
                  ${ensureArray(post.tags).includes(tag.value)
                    ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                    : 'text-white/60 border border-white/10 hover:border-indigo-500/20 hover:bg-white/[0.02]'
                  }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* 已选标签 */}
          <div className="flex flex-wrap gap-2">
            {ensureArray(post.tags).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-indigo-500/20 text-white text-sm
                  border border-indigo-500/30 flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="hover:text-white/60"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* 自定义标签输入 */}
          <input
            type="text"
            placeholder="输入自定义标签，按回车添加"
            onKeyDown={handleCustomTagAdd}
            className="w-full px-4 py-2 rounded-lg bg-[#0F0F1A] border border-white/10 
              focus:border-indigo-500/30 text-white/90 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

PostBasicInfo.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
  }).isRequired,
  onPostChange: PropTypes.func.isRequired,
}; 