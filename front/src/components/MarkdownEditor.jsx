import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

export function MarkdownEditor({ 
  content, 
  onChange, 
  markdownTools, 
  onToolClick, 
  editorRef 
}) {
  const renderMarkdown = (content) => {
    if (!content) return null;
    return (
      <div className="markdown-preview">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <pre className={`${className || ''} !bg-transparent relative bg-white/[0.02] rounded-lg overflow-hidden border border-white/[0.05]`} {...props}>
                  <code className={`${match ? `language-${match[1]}` : ''} !bg-transparent text-white/90`}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-white/[0.02] px-1.5 py-0.5 rounded text-sm mx-0.5 whitespace-normal text-white/90 border border-white/[0.05]" {...props}>
                  {children}
                </code>
              )
            },
            p({children}) {
              return <div className="mb-4">{children}</div>;
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2">
        {markdownTools.map(tool => (
          <button
            key={tool.type}
            type="button"
            onClick={() => onToolClick(tool.type)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 
              text-white/60 hover:text-white/90 hover:border-white/20 
              transition-colors duration-300"
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* 编辑器区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 输入区域 */}
        <div className="relative">
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[500px] px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 
              focus:border-indigo-500/30 text-white/90 outline-none resize-none 
              font-mono text-sm leading-relaxed"
            placeholder="在这里开始写作..."
          />
        </div>

        {/* 预览区域 */}
        <div 
          className="h-[500px] px-4 py-3 rounded-lg bg-white/[0.02] border border-white/10 
            overflow-auto markdown-preview prose prose-invert prose-sm max-w-none
            prose-pre:bg-white/[0.02] prose-pre:border prose-pre:border-white/10"
        >
          {renderMarkdown(content)}
        </div>
      </div>
    </div>
  );
}

// 添加 PropTypes 验证
MarkdownEditor.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  markdownTools: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onToolClick: PropTypes.func.isRequired,
  editorRef: PropTypes.object.isRequired
}; 