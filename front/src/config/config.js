// API配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  CONTENT_URL: import.meta.env.VITE_CONTENT_BASE_URL || 'http://localhost:8080/content',
};

// 文章配置
export const POST_CONFIG = {
  DEFAULT_CATEGORY: import.meta.env.VITE_DEFAULT_CATEGORY || '随笔',
  CATEGORIES: (import.meta.env.VITE_CATEGORIES || '技术,生活,随笔,教程').split(',').map(category => ({
    label: category,
    value: category
  })),
  COMMON_TAGS: (import.meta.env.VITE_COMMON_TAGS || 'React,Vue,JavaScript,TypeScript,Node.js,Go,Python,Docker,Linux')
    .split(',')
    .map(tag => ({
      label: tag,
      value: tag
    }))
};

// 照片配置
export const PHOTO_CONFIG = {
  CATEGORIES: (import.meta.env.VITE_PHOTO_CATEGORIES || 'travel,life,food,landscape').split(','),
  MAX_UPLOAD_SIZE: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE || '5242880', 10),
  ALLOWED_TYPES: (import.meta.env.VITE_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',')
};

// 主题配置
export const THEME_CONFIG = {
  COLORS: {
    primary: '#6366F1', // Indigo-500
    background: '#0F0F1A',
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      tertiary: 'rgba(255, 255, 255, 0.4)'
    },
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)'
    }
  },
  FONTS: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    serif: '"Noto Serif SC", "Source Han Serif SC", "Source Han Serif CN", serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  }
}; 