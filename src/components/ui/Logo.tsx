import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
export function Logo() {
  const {
    themeColors
  } = useTheme();
  return <Link to="/" className="font-bold text-xl tracking-wider flex items-center">
      <SparklesIcon className={`mr-1 h-5 w-5 text-transparent bg-clip-text bg-gradient-to-r ${themeColors.primary}`} />
      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.primary}`}>
        Rivela
      </span>
      <span className={`ml-2 text-xs bg-gradient-to-r ${themeColors.primary} bg-opacity-20 px-2 py-0.5 rounded-full`}>
        Explorateur Financier
      </span>
    </Link>;
}