import { nextui } from "@nextui-org/react";
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // 主色调
        primary: {
          DEFAULT: '#3B82F6',  // 蓝色
          hover: '#2563EB',
        },
        // 背景色
        base: {
          DEFAULT: '#030711',  // 深色背景
          light: '#0F172A',    // 稍浅的背景
          card: '#1E293B',     // 卡片背景
        },
        // 文字颜色
        content: {
          DEFAULT: '#E2E8F0',  // 主要文字
          muted: '#94A3B8',    // 次要文字
          light: '#CBD5E1',    // 高亮文字
        },
        // 边框颜色
        border: {
          DEFAULT: '#1E293B',  // 普通边框
          hover: '#3B82F6',    // 悬停边框
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scan': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100vh)' },
          '100%': { transform: 'translateY(0)' }
        },
        'gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse': {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out infinite 1s',
        'float-delay-2': 'float 3s ease-in-out infinite 2s',
        'scan': 'scan 8s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'pulse': 'pulse 4s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'gradient-x': 'gradient-x 3s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#94a3b8',
            img: {
              borderRadius: '0.5rem',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
            },
            code: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
            },
          },
        },
      },
      backgroundImage: {
        'grid-pattern': `radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '30px 30px',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), typography()]
};