import { Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export function HeroSection() {
  const canvasRef = useRef(null);

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
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.radius = Math.random() * 1.5;
        this.color = `rgba(99, 102, 241, ${Math.random() * 0.5})`;
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

    for (let i = 0; i < 50; i++) {
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

  return (
    <div className="relative min-h-screen bg-[#0F0F1A] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-8">
          {/* 装饰线 */}
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider text-white/90 font-sans">
            <span className="font-mono text-indigo-400">&lt;</span>
            Welcome
            <span className="font-mono text-indigo-400">/&gt;</span>
          </h1>
          
          <p className="text-white/50 font-serif text-lg max-w-2xl mx-auto leading-relaxed">
            探索数字前沿，定义未来可能
          </p>

          <div className="flex gap-6 justify-center mt-12">
            <Button
              as={Link}
              to="/blogs"
              className="group relative px-8 py-3 bg-white/[0.02] border border-white/[0.05] 
                hover:border-indigo-500/30 transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-2 text-white/80">
                博客
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </Button>

            <Button
              as={Link}
              to="/about"
              className="group relative px-8 py-3 bg-white/[0.02] border border-white/[0.05]
                hover:border-indigo-500/30 transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-2 text-white/80">
                关于
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 