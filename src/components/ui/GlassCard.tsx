import React from 'react';
import { motion } from 'framer-motion';
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'danger';
}
export function GlassCard({
  children,
  className = '',
  animate = false,
  hover = false,
  onClick,
  variant = 'default'
}: GlassCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-indigo-500/30 bg-indigo-900/10';
      case 'secondary':
        return 'border-purple-500/30 bg-purple-900/10';
      case 'accent':
        return 'border-cyan-500/30 bg-cyan-900/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-900/10';
      case 'success':
        return 'border-green-500/30 bg-green-900/10';
      case 'danger':
        return 'border-red-500/30 bg-red-900/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };
  const baseClass = `glass-card glass-blur border ${getVariantClasses()}`;
  const hoverClass = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const combinedClass = `${baseClass} ${className} ${hoverClass}`;
  if (animate) {
    return <motion.div className={combinedClass} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} whileHover={hover ? {
      y: -4,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
    } : {}} onClick={onClick}>
        {children}
      </motion.div>;
  }
  return <div className={combinedClass} onClick={onClick}>
      {children}
    </div>;
}