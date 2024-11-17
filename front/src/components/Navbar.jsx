import { Link } from "react-router-dom";

export function MainNavbar() {
  const menuItems = [
    { name: '首页', icon: '⚡', path: '/' },
    { name: '博客', icon: '📝', path: '/blogs' },
    { name: '照片', icon: '📸', path: '/gallery' },
    { name: '关于', icon: '🤖', path: '/about' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/[0.02] backdrop-blur-sm border-b border-white/[0.05]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="group relative"
          >
            <span className="relative z-10 text-white/90 group-hover:text-white 
              transition-colors duration-500 font-light tracking-wider">
              <span className="font-mono text-indigo-400">&lt;</span>
              白干饭
              <span className="font-mono text-indigo-400">/&gt;</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.07] to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          
          <div className="flex gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group relative px-4 py-2"
              >
                <span className="relative z-10 flex items-center gap-2 text-white/70 
                  group-hover:text-white transition-colors duration-500">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </span>
                  <span className="font-light tracking-wider">{item.name}</span>
                </span>
                <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05]
                  opacity-0 group-hover:opacity-100 group-hover:border-indigo-500/30 
                  transition-all duration-500 backdrop-blur-sm" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}