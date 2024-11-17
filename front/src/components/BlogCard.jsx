import { Card } from "@nextui-org/react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from 'prop-types';

export function BlogCard({ post }) {
  const {
    id = '',
    title = '无标题',
    category = '随笔',
    created = '',
  } = post || {};

  return (
    <RouterLink to={`/blog/${id}`}>
      <Card 
        className="group relative bg-white/[0.02] hover:bg-white/[0.04] 
          border border-white/[0.05] hover:border-indigo-500/30
          transition-all duration-500 backdrop-blur-sm"
      >
        <div className="relative flex items-center p-6">
          {/* 时间 */}
          <div className="flex-shrink-0 w-32 font-mono">
            <div className="text-white/60 text-sm">{created}</div>
          </div>

          {/* 分类标签 */}
          <div className="px-2.5 py-1 text-xs font-mono text-indigo-400/80 
            bg-white/[0.02] border border-white/[0.05] rounded-full">
            {category}
          </div>

          {/* 标题 */}
          <h3 className="ml-6 text-base font-serif text-white/80 group-hover:text-white/90 
            transition-colors duration-500 flex-grow">
            {title}
          </h3>

          {/* 箭头 */}
          <span className="ml-4 text-indigo-400 group-hover:translate-x-1 
            transition-all duration-500">
            →
          </span>
        </div>

        {/* 悬停效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
          transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.07] to-transparent"></div>
        </div>
      </Card>
    </RouterLink>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    created: PropTypes.string,
    category: PropTypes.string,
  })
};