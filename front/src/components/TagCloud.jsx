import PropTypes from 'prop-types';

export function TagCloud({ tags, selectedTag, onTagSelect }) {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="sticky top-24">
        <div className="relative">
          {/* 装饰性边框 */}
          <div className="absolute -left-2 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
          
          <div className="pl-6 space-y-6">
            <h3 className="text-white/80 font-light tracking-wider">
              <span className="text-indigo-400 font-mono mr-2">&gt;</span>
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className={`px-3 py-1.5 text-xs font-light tracking-wider transition-all duration-300
                    bg-white/[0.02] border backdrop-blur-sm
                    ${selectedTag === tag 
                      ? 'border-indigo-500/30 text-white/90 hover:border-indigo-500/50' 
                      : 'border-white/[0.05] text-white/60 hover:text-white/80 hover:border-white/[0.1]'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TagCloud.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTag: PropTypes.string.isRequired,
  onTagSelect: PropTypes.func.isRequired
}; 