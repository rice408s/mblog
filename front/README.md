# 个人博客系统


这是一个使用 **React** + **Go** 开发的个人博客系统。 ***本项目完全使用cursor构建***


## 功能特性
- 文章管理（支持 Markdown）
- 图片管理
- 分类管理
- 标签管理
- 响应式设计
- 密码保护

## 技术栈

### 前端
- React
- TypeScript
- Vite
- TailwindCSS

### 后端
- Go
- Gin


## 环境要求
- Node.js >= 16
- Go >= 1.18

## 目录结构
```bash
src/
├── assets/         # 静态资源
├── components/     # 组件
├── config/         # 配置文件
├── content/        # 内容文件
├── images/         # 图片文件
├── posts/          # 文章文件
├── pages/          # 页面组件
├── utils/          # 工具函数
├── App.jsx         # 主应用组件
├── index.css       # 全局样式
└── main.jsx        # 入口文件

server/
├── config/         # 服务器配置
├── data/           # 数据文件
├── handlers/       # 请求处理器
├── models/         # 数据模型
├── utils/          # 工具函数
└── main.go         # 服务器入口
```

## 快速开始

### 克隆仓库
```bash
git clone https://github.com/yourusername/blog.git
cd blog
```
安装依赖
前端
```bash
cd src
npm install
```
后端
```bash
cd server
go mod tidy
```
启动开发服务器
前端
```bash
npm run dev
```
后端
```bash
go run main.go
```
访问
浏览器访问 http://localhost:5173

部署
构建前端
```bash
cd src
npm run build
```
构建后端
```bash
cd server
go build
```
配置环境变量
创建 .env 文件并设置必要的环境变量。

运行服务
```bash
./server
```

作者主页：[白干饭](www.innov.ink)