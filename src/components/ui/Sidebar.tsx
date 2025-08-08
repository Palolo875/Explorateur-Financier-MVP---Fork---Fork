import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { LayoutDashboardIcon, SearchIcon, CalculatorIcon, FileBarChartIcon, SettingsIcon, ChevronRightIcon, ChevronLeftIcon, LogOutIcon, BookOpenIcon, GraduationCapIcon, UserIcon, MessageSquareIcon } from 'lucide-react';
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    themeColors
  } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [{
    path: '/dashboard',
    icon: <LayoutDashboardIcon size={20} />,
    label: 'Tableau de bord'
  }, {
    path: '/question',
    icon: <SearchIcon size={20} />,
    label: 'Nouvelle question'
  }, {
    path: '/simulation',
    icon: <CalculatorIcon size={20} />,
    label: 'Simulations'
  }, {
    path: '/reports',
    icon: <FileBarChartIcon size={20} />,
    label: 'Rapports'
  }, {
    path: '/library',
    icon: <BookOpenIcon size={20} />,
    label: 'Bibliothèque'
  }, {
    path: '/lessons',
    icon: <GraduationCapIcon size={20} />,
    label: 'Leçons'
  }, {
    path: '/profile',
    icon: <UserIcon size={20} />,
    label: 'Profil'
  }, {
    path: '/settings',
    icon: <SettingsIcon size={20} />,
    label: 'Paramètres'
  }, {
    path: '/feedback',
    icon: <MessageSquareIcon size={20} />,
    label: 'Feedback'
  }];
  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    navigate('/');
  };
  return <motion.div className={`h-screen fixed left-0 top-0 pt-20 pb-6 ${themeColors.cardBg} backdrop-blur-md border-r ${themeColors.border} z-10`} initial={{
    width: 240
  }} animate={{
    width: collapsed ? 80 : 240
  }} transition={{
    duration: 0.3
  }}>
      <div className="flex flex-col h-full justify-between px-3">
        <nav className="space-y-2">
          {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${location.pathname === item.path ? `bg-gradient-to-r ${themeColors.primary} text-white` : 'hover:bg-white/10'}`}>
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
            </Link>)}
        </nav>
        <div className="space-y-2">
          <button onClick={() => setCollapsed(!collapsed)} className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
            <span className="flex-shrink-0">
              {collapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
            </span>
            {!collapsed && <span className="ml-3">Réduire</span>}
          </button>
          <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200">
            <span className="flex-shrink-0">
              <LogOutIcon size={20} />
            </span>
            {!collapsed && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </div>
    </motion.div>;
}