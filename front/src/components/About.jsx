import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // 处理标题点击
  const handleTitleClick = () => {
    const now = Date.now();
    
    // 如果距离上次点击超过3秒，重置计数
    if (now - lastClickTime > 3000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);

    // 当点击次数达到5次时跳转
    if (clickCount === 4) {  // 因为状态更新是异步的，所以在第4次时就要处理
      navigate('/edit');
    }
  };

  // 粒子动画效果
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() * 1 - 0.5; // 降低速度
        this.vy = Math.random() * 1 - 0.5;
        this.radius = Math.random() * 1.5; // 更小的粒子
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`; // 统一使用靛蓝色
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    for (let i = 0; i < 50; i++) { // 减少粒子数量
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const skills = [
    { 
      title: "Cursor AI 开发", 
      desc: "使用 Cursor AI 进行自然语言编程，让代码创作更轻松自然" 
    },
    { 
      title: "产品思维", 
      desc: "以用户为中心，用技术解决实际问题，创造有价值的产品" 
    },
    { 
      title: "创意实现", 
      desc: "将生活中的灵感转化为代码，让技术服务于创意表达" 
    },
    { 
      title: "持续学习", 
      desc: "保持对新技术的好奇心，不断探索 AI 辅助开发的可能性" 
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        {/* 头部区域 */}
        <div className="text-center mb-20 space-y-6">
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          
          <h1 
            className="text-4xl font-light tracking-wider text-white/90 cursor-pointer select-none"
            onClick={handleTitleClick}
          >
            <span className="font-mono text-indigo-400">&lt;</span>
            Hello World
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>
          
          <p className="text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            一个热爱生活的程序员，用代码记录生活，用技术创造价值。
            在旅行中寻找灵感，在烹饪中品味生活，用镜头捕捉美好，在户外拥抱自然。
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {['🌏 旅行', '🍳 美食', '📸 摄影', '🏃‍♂️ 户外运动'].map((hobby, index) => (
              <span key={index} 
                className="px-4 py-2 bg-white/[0.02] border border-indigo-500/20 
                rounded-full text-white/60 text-sm hover:border-indigo-500/40 
                transition-all duration-300">
                {hobby}
              </span>
            ))}
          </div>
        </div>

        {/* 技能卡片网格 */}
        <section>
          <h2 className="text-2xl font-light text-white/80 mb-8 tracking-wider">
            <span className="text-indigo-400 font-mono">#</span> Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <Card key={index} 
                className="bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30
                  transition-all duration-500">
                <CardBody className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-light tracking-wide text-white/80">
                      <span className="text-indigo-400 font-mono mr-2">&gt;</span>
                      {skill.title}
                    </h3>
                    <p className="text-white/40 text-sm pl-6 font-light">
                      {skill.desc}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* Cursor AI 提示 */}
        <div className="mt-20 text-center">
          <a 
            href="https://cursor.sh" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-indigo-500/10 to-purple-500/10 
              border border-indigo-500/20 hover:border-indigo-500/30 
              transition-all duration-300 cursor-pointer">
            <span className="text-indigo-400 animate-pulse">⚡</span>
            <span className="text-white/60 text-sm font-light">
              本博客完全由 Cursor 开发
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 