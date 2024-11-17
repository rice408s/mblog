export const themes = {
  default: {
    name: '默认主题',
    key: 'default',
    description: '明亮清新的默认主题'
  },
  dark: {
    name: '暗色主题',
    key: 'dark',
    description: '护眼的深色主题'
  }
};

export const getThemeConfig = (themeKey) => {
  return themes[themeKey] || themes.default;
}; 