import React, { useEffect, useRef } from 'react';
export function RevealAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    // Particle properties
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];
    const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];
    // Create particles
    const createParticles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (let i = 0; i < 150; i++) {
        const size = Math.random() * 6 + 1;
        const speedX = (Math.random() - 0.5) * 10;
        const speedY = (Math.random() - 0.5) * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const rotation = Math.random() * Math.PI * 2;
        const rotationSpeed = (Math.random() - 0.5) * 0.05;
        particles.push({
          x: centerX,
          y: centerY,
          size,
          speedX,
          speedY,
          color,
          alpha: 1,
          rotation,
          rotationSpeed
        });
      }
    };
    // Update particles
    const updateParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        // Gradually slow down
        p.speedX *= 0.99;
        p.speedY *= 0.99;
        // Fade out
        p.alpha -= 0.01;
        // Remove faded particles
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
    };
    // Draw particles with various shapes
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // Draw different shapes based on particle properties
        const shapeType = Math.floor(p.size) % 4;
        switch (shapeType) {
          case 0:
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 1:
            // Square
            ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
            break;
          case 2:
            // Triangle
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size, p.size);
            ctx.lineTo(-p.size, p.size);
            ctx.closePath();
            ctx.fill();
            break;
          case 3:
            // Star
            drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
            ctx.fill();
            break;
        }
        ctx.restore();
      }
    };
    // Helper function to draw a star
    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, points: number, outer: number, inner: number) => {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = Math.PI * i / points;
        ctx.lineTo(x + radius * Math.sin(angle), y + radius * Math.cos(angle));
      }
      ctx.closePath();
    };
    // Animation loop with timing
    let lastTime = 0;
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      // Only update every 16ms (approx 60fps)
      if (deltaTime > 16 || isNaN(deltaTime)) {
        updateParticles();
        drawParticles();
      }
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };
    // Start animation
    createParticles();
    requestAnimationFrame(animate);
    // Handle window resize
    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-20" />;
}