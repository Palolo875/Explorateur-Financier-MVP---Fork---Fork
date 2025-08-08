import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboardIcon, LineChartIcon, BarChart3Icon, UserIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon, BookOpenIcon, GraduationCapIcon, MessageSquareIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    themeColors
  } = useTheme();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const navItems = [{
    icon: <LayoutDashboardIcon className="h-5 w-5" />,
    label: 'Tableau de bord',
    path: '/dashboard'
  }, {
    icon: <LineChartIcon className="h-5 w-5" />,
    label: 'Simulations',
    path: '/simulation'
  }, {
    icon: <BarChart3Icon className="h-5 w-5" />,
    label: 'Rapports',
    path: '/reports'
  }, {
    icon: <BookOpenIcon className="h-5 w-5" />,
    label: 'Bibliothèque',
    path: '/library'
  }, {
    icon: <GraduationCapIcon className="h-5 w-5" />,
    label: 'Leçons',
    path: '/lessons'
  }, {
    icon: <UserIcon className="h-5 w-5" />,
    label: 'Profil',
    path: '/profile'
  }, {
    icon: <SettingsIcon className="h-5 w-5" />,
    label: 'Paramètres',
    path: '/settings'
  }, {
    icon: <MessageSquareIcon className="h-5 w-5" />,
    label: 'Feedback',
    path: '/feedback'
  }];
  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    navigate('/');
  };
  return <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-black/20 border-r border-white/10">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${themeColors.primary}`}></div>
            <span className="text-xl font-bold">Rivela</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => <li key={index}>
                <Link to={item.path} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path) ? `bg-gradient-to-r ${themeColors.primary} text-white` : 'hover:bg-white/10'}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>)}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-white/10 transition-all">
            <LogOutIcon className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <motion.div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/95 md:hidden transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`} initial={false}>
        <div className="p-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${themeColors.primary}`}></div>
            <span className="text-xl font-bold">Rivela</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => <li key={index}>
                <Link to={item.path} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path) ? `bg-gradient-to-r ${themeColors.primary} text-white` : 'hover:bg-white/10'}`} onClick={() => setIsSidebarOpen(false)}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>)}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => {
          handleLogout();
          setIsSidebarOpen(false);
        }} className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-white/10 transition-all">
            <LogOutIcon className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${themeColors.primary}`}></div>
            <span className="text-xl font-bold">Rivela</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/10">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>;
}