import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      // 使用代理服务器获取 access token
      fetch('http://localhost:3000/api/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      })
      .then(res => res.json())
      .then(async data => {
        if (data.error) {
          throw new Error(data.error);
        }
        
        const accessToken = data.access_token;
        if (!accessToken) {
          throw new Error('No access token received');
        }
        
        // 使用 access token 获取用户信息
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!userResponse.ok) {
          throw new Error(`GitHub API responded with status ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log('GitHub user data:', userData);

        // 只有在用户验证成功后才设置认证状态和导航
        if (userData.login === 'rice408s') {
          sessionStorage.setItem('isAuthenticated', 'true');
          navigate('/edit');
        } else {
          throw new Error('Unauthorized user');
        }
      })
      .catch(error => {
        console.error('Auth error:', error);
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('github_token');
        navigate('/login?error=unauthorized');
      });
    } else {
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('github_token');
      navigate('/login?error=no_code');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-rice-50 dark:bg-ink-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce mb-4">
          <span className="text-4xl">🔄</span>
        </div>
        <p className="text-ink-600 dark:text-rice-300 font-kai">
          正在验证身份...
        </p>
      </div>
    </div>
  );
} 