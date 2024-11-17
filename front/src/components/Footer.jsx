import { useState } from 'react';
import { QRCodeModal } from './QRCodeModal';
import { FaWeixin, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export function Footer() {
  const [showQRCode, setShowQRCode] = useState(false);
  const currentYear = new Date().getFullYear();
  
  const socials = [
    { 
      name: '微信', 
      icon: <FaWeixin className="w-6 h-6" />,
      action: () => setShowQRCode(true)
    },
    { 
      name: '邮箱', 
      icon: <MdEmail className="w-6 h-6" />,
      href: 'mailto:hw.w408@outlook.com'
    },
    { 
      name: 'GitHub', 
      icon: <FaGithub className="w-6 h-6" />,
      href: 'https://github.com/rice408s'
    }
  ];
  
  return (
    <>
      <footer className="relative bg-white/[0.02] backdrop-blur-sm border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* 社交链接 */}
          <div className="flex justify-center gap-6 mb-12">
            {socials.map((social) => (
              social.action ? (
                <button
                  key={social.name}
                  onClick={social.action}
                  className="group relative w-12 h-12 flex items-center justify-center text-white/60 hover:text-white/90"
                  title={social.name}
                >
                  <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                    backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30"></div>
                  <span className="relative group-hover:scale-110 transition-transform duration-500">
                    {social.icon}
                  </span>
                </button>
              ) : (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 flex items-center justify-center text-white/60 hover:text-white/90"
                  title={social.name}
                >
                  <div className="absolute inset-0 bg-white/[0.02] rounded-lg border border-white/[0.05] 
                    backdrop-blur-sm transition-all duration-500 group-hover:border-indigo-500/30"></div>
                  <span className="relative group-hover:scale-110 transition-transform duration-500">
                    {social.icon}
                  </span>
                </a>
              )
            ))}
          </div>

          {/* 底部信息 */}
          <div className="text-center space-y-4">
            <p className="text-white/60 font-mono text-sm tracking-wider">
              Innovation Never Stops
            </p>
            <div className="text-white/40 font-mono text-xs tracking-wider space-y-2">
              <div>© {currentYear} All Rights Reserved</div>
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white/60 transition-colors duration-300"
              >
                蜀ICP备2023035130号
              </a>
            </div>
          </div>
        </div>
      </footer>

      <QRCodeModal isOpen={showQRCode} onClose={() => setShowQRCode(false)} />
    </>
  );
} 