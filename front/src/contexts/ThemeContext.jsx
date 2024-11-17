import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // 从 localStorage 读取初始主题状态
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // 确保初始状态与 DOM 一致
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return isDarkMode;
  });

  useEffect(() => {
    // 监听其他标签页的主题变化
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        const newIsDark = e.newValue === 'dark';
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('dark', newIsDark);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newIsDark = !prev;
      // 更新 localStorage
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      // 更新 DOM
      document.documentElement.classList.toggle('dark', newIsDark);
      return newIsDark;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 