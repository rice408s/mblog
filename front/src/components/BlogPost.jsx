import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import PropTypes from "prop-types";

// 添加一个辅助函数来提取文本
const extractTextFromChildren = (children) => {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (children?.props?.children) {
    return extractTextFromChildren(children.props.children);
  }
  return "";
};

// 将 CopyButton 提取为独立组件
const CopyButton = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const plainText = extractTextFromChildren(content);
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 p-1.5 text-white/40 
        hover:text-white/80 rounded-md transition-all duration-200
        hover:bg-white/5"
      aria-label="复制代码"
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
          <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
        </svg>
      )}
    </button>
  );
};

CopyButton.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};

// 修改代码块渲染组件
const components = {
  img: ({ alt, src, title }) => (
    <figure className="relative my-6">
      <img
        src={src}
        alt={alt}
        title={title}
        className="w-full rounded-lg border border-white/[0.05]"
        loading="lazy"
      />
      {alt && (
        <figcaption className="text-center text-sm text-white/40 mt-2 font-mono">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  pre: ({ children }) => children,

  code: ({inline, className, children, ...props}) => {
    const match = /language-(\w+)/.exec(className || '');
    
    if (inline) {
      return (
        <code 
          className="bg-[#1a1b26] text-[#E6EDF3] px-2 py-0.5 rounded text-[0.9em] 
            font-mono inline-block align-baseline" 
          {...props}
        >
          {children}
        </code>
      );
    }
    
    // 如果是代码块，返回一个片段而不是嵌套在 p 标签中
    if (match) {
      return (
        <div className="not-prose my-4">
          <pre className="!bg-[#1a1b26] !p-4 rounded-lg relative">
            <CopyButton content={children} />
            <code className={`${className} !bg-transparent text-[#E6EDF3] block`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  p: ({ children }) => {
    const childArray = React.Children.toArray(children);
    
    // 如果子元素是代码块，直接返回子元素
    if (childArray.some(child => 
      React.isValidElement(child) && 
      child.props?.className?.includes('language-')
    )) {
      return children;
    }

    // 如果是图片，也直接返回
    if (childArray.some(child => 
      React.isValidElement(child) && 
      (child.type === 'img' || 
       (typeof child.type === 'function' && child.type.name === 'img'))
    )) {
      return children;
    }

    // 普通段落
    return (
      <p className="mb-4 text-[#cccccc] font-sans text-base leading-relaxed">
        {children}
      </p>
    );
  },
};

export function BlogPost({ post }) {
  if (!post) {
    return (
      <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
            <p className="text-white/60 font-mono">文章数据无效</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    title = "无标题",
    created = "未知时间",
    category = "随笔",
    tags = [],
    content = "",
    updated = "",
  } = post;

  // 添加一个函数来提取文章主体内容
  const extractMainContent = (content) => {
    const frontmatterRegex = /^---\n[\s\S]*?\n---\n([\s\S]*)$/;
    const matches = content.match(frontmatterRegex);
    return matches ? matches[1].trim() : content;
  };

  const cardStyles = {
    技术: {
      chip: "bg-white/[0.02] border border-blue-500/30 text-blue-400",
      icon: "🎋",
    },
    生活: {
      chip: "bg-white/[0.02] border border-green-500/30 text-green-400",
      icon: "🍵",
    },
    随笔: {
      chip: "bg-white/[0.02] border border-purple-500/30 text-purple-400",
      icon: "🖋️",
    },
    教程: {
      chip: "bg-white/[0.02] border border-amber-500/30 text-amber-400",
      icon: "📜",
    },
    default: {
      chip: "bg-white/[0.02] border border-indigo-500/30 text-indigo-400",
      icon: "📝",
    },
  };

  const style = cardStyles[category] || cardStyles["default"];
  const normalizedTags = Array.isArray(tags) ? tags : 
    typeof tags === 'string' ? tags.split(',').map(t => t.trim()) :
    tags instanceof Set ? Array.from(tags) : [];

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

      {/* 主内容 */}
      <article className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20">
        <header className="text-center mb-20 space-y-6">
          {/* 装饰线 */}
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />

          {/* 标题 */}
          <h1 className="text-4xl font-light tracking-wider text-white/90">
            <span className="font-mono text-indigo-400">&lt;</span>
            {title}
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>

          {/* 文章信息 */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* 发布时间 */}
            <div className="group relative px-4 py-2">
              <div className="absolute inset-0 bg-white/[0.02] rounded-full border border-white/[0.05] 
                backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
              <span className="relative z-10 flex items-center gap-2 text-white/60">
                <span>📅</span>
                <span className="font-mono">{created}</span>
              </span>
            </div>

            {/* 更新时间 */}
            {updated && updated !== created && (
              <div className="group relative px-4 py-2">
                <div className="absolute inset-0 bg-white/[0.02] rounded-full border border-white/[0.05] 
                  backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                <span className="relative z-10 flex items-center gap-2 text-white/60">
                  <span>✏️</span>
                  <span className="font-mono">编辑于 {updated}</span>
                </span>
              </div>
            )}

            {/* 分类 */}
            <div className="group relative px-4 py-2">
              <div className={`absolute inset-0 rounded-full backdrop-blur-sm transition-all duration-500
                bg-indigo-500/20 border border-indigo-500/30`} />
              <span className="relative z-10 flex items-center gap-2 text-white/90">
                <span>{style.icon}</span>
                <span>{category}</span>
              </span>
            </div>

            {/* 标签 */}
            {normalizedTags.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {normalizedTags.map((tag, index) => (
                  <div key={index} className="group relative px-3 py-1">
                    <div className="absolute inset-0 bg-white/[0.02] rounded-full border border-white/[0.05] 
                      backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30" />
                    <span className="relative z-10 text-white/60 text-sm">
                      <span className="opacity-70 mr-1">#</span> {tag}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 文章内容 */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
            backdrop-blur-sm transition-all duration-500" />
          <div className="relative z-10 p-8">
            <div className="prose prose-invert max-w-none
              prose-p:font-sans prose-p:text-base prose-p:leading-relaxed prose-p:text-[#cccccc]
              prose-headings:font-sans prose-headings:tracking-wider
              prose-h2:text-2xl prose-h2:font-light
              prose-h3:text-xl prose-h3:font-light
              prose-strong:text-white/90
              prose-blockquote:border-l-4 prose-blockquote:border-indigo-500/30
              prose-blockquote:text-white/60
              prose-pre:!bg-[#1a1b26]
              prose-pre:!p-0
              prose-pre:!m-0
              prose-code:!bg-[#1a1b26]
              prose-code:text-[#E6EDF3]
              prose-code:before:content-none
              prose-code:after:content-none
              [&_pre]:!bg-[#1a1b26]
              [&_pre]:rounded-lg
              [&_pre]:!p-4
              [&_code]:!bg-[#1a1b26]
              [&_.hljs]:!bg-[#1a1b26]
              [&_.hljs-keyword]:text-[#FF7B72]
              [&_.hljs-string]:text-[#A5D6FF]
              [&_.hljs-number]:text-[#79C0FF]
              [&_.hljs-function]:text-[#D2A8FF]
              [&_.hljs-title]:text-[#D2A8FF]
              [&_.hljs-comment]:text-[#8B949E]
              [&_.hljs-comment]:italic
              [&_.hljs-variable]:text-[#FFA657]
              [&_.hljs-attr]:text-[#79C0FF]
              [&_.hljs-tag]:text-[#7EE787]
              [&_.hljs-attribute]:text-[#79C0FF]
              [&_.hljs-built_in]:text-[#FFA657]
              [&_.hljs-operator]:text-[#FF7B72]
              [&_.hljs-punctuation]:text-[#C9D1D9]"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  [rehypeHighlight, { detect: true, ignoreMissing: true }],
                ]}
                components={components}
                unwrapDisallowed={true}
                skipHtml={true}
              >
                {extractMainContent(content)}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* 文章底部 */}
        <footer className="mt-16 text-center space-y-4">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          <div className="text-white/40 font-mono text-sm">
            <div>感谢阅读</div>
            <div>© {new Date().getFullYear()}</div>
          </div>
        </footer>
      </article>
    </div>
  );
}

BlogPost.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    created: PropTypes.string,
    time: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
      PropTypes.instanceOf(Set),
    ]),
    content: PropTypes.string,
    updated: PropTypes.string,
  }).isRequired,
};
