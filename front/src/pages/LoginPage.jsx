import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function LoginPage() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 获取用户尝试访问的原始URL
  const from = location.state?.from || '/edit';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      // 设置 cookie
      document.cookie = `admin_password=${password}; path=/`;
      
      // 登录成功后重定向到原始请求的URL
      navigate(from);
      toast.success('验证成功！');
    } else {
      toast.error('暗号错误！');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-light text-white/90">请输入暗号</h2>
            <p className="text-white/50 text-sm">需要验证暗号才能继续操作</p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-lg
              text-white/90 outline-none focus:border-indigo-500/30"
            placeholder="请输入暗号..."
            autoFocus
          />

          <button
            type="submit"
            className="w-full py-2 bg-indigo-500/20 text-white/90 rounded-lg
              border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors duration-300"
          >
            确认
          </button>
        </form>
      </div>
    </div>
  );
} 