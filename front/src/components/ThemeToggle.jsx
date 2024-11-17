import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-24 right-6 z-50 group relative overflow-hidden
        bg-white/[0.02] backdrop-blur-sm border border-white/[0.05]
        p-3 rounded-full hover:border-indigo-500/30
        transition-all duration-500"
    >
      <div className="relative w-8 h-8">
        {/* 太阳 */}
        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500
          ${isDark ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
          <span className="text-2xl relative z-10">☀️</span>
          <div className="absolute inset-0 bg-white/[0.02] rounded-full"></div>
        </span>
        
        {/* 月亮 */}
        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-500
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'}`}>
          <span className="text-2xl relative z-10">🌙</span>
          <div className="absolute inset-0 bg-white/[0.02] rounded-full"></div>
        </span>
      </div>
      
      {/* 提示文字 */}
      <span className="absolute -top-12 right-0 px-4 py-2
        bg-white/[0.02] backdrop-blur-sm border border-white/[0.05]
        rounded-lg text-sm text-white/60 font-mono
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        whitespace-nowrap">
        切换{isDark ? '日间' : '夜间'}模式
      </span>

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.07] to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
} 