export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0F0F1A]">
      <div className="relative">
        {/* 装饰线 */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-px h-12 
          bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="flex items-center justify-center space-x-3">
          <div className="w-3 h-3 bg-white/[0.02] border border-white/[0.05] rounded-full
            animate-bounce delay-0">
            <div className="w-full h-full bg-indigo-400/50 rounded-full"></div>
          </div>
          <div className="w-3 h-3 bg-white/[0.02] border border-white/[0.05] rounded-full
            animate-bounce delay-100">
            <div className="w-full h-full bg-indigo-400/50 rounded-full"></div>
          </div>
          <div className="w-3 h-3 bg-white/[0.02] border border-white/[0.05] rounded-full
            animate-bounce delay-200">
            <div className="w-full h-full bg-indigo-400/50 rounded-full"></div>
          </div>
        </div>
        
        {/* 加载文字 */}
        <p className="mt-6 text-white/60 font-mono text-sm tracking-wider text-center">
          Loading...
        </p>
      </div>
    </div>
  );
} 