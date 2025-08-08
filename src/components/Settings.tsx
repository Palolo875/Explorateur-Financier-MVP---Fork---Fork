import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { toast, Toaster } from 'react-hot-toast';
import { PaletteIcon, GlobeIcon, SaveIcon, MoonIcon, SunIcon, BellIcon, CheckIcon, DownloadIcon, LockIcon, UnlockIcon, RefreshCwIcon, TrashIcon, AlertCircleIcon, EyeIcon, EyeOffIcon, SettingsIcon } from 'lucide-react';
export function Settings() {
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    themeColors
  } = useTheme();
  // State for settings
  const [language, setLanguage] = useState('fr');
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataAutoSave, setDataAutoSave] = useState(true);
  const [currencyFormat, setCurrencyFormat] = useState('EUR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [showCents, setShowCents] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Handle theme change
  const handleThemeChange = (isDark: boolean) => {
    setDarkMode(isDark);
    setTheme(isDark ? 'dark' : 'light');
  };
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast.success('Paramètres mis à jour avec succès');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  // Handle data reset
  const handleDataReset = () => {
    toast.error('Cette action nécessite une confirmation supplémentaire');
  };
  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // In a real app, this would change the app language
    if (e.target.value === 'fr') {
      toast.success('Langue changée en Français');
    } else if (e.target.value === 'en') {
      toast.success('Language changed to English');
    } else if (e.target.value === 'es') {
      toast.success('Idioma cambiado a Español');
    } else if (e.target.value === 'de') {
      toast.success('Sprache auf Deutsch geändert');
    }
  };
  // Get language name
  const getLanguageName = (code: string) => {
    const languages = {
      fr: 'Français',
      en: 'English',
      es: 'Español',
      de: 'Deutsch'
    };
    return languages[code as keyof typeof languages] || code;
  };
  return <div className="w-full max-w-4xl mx-auto pb-20">
      <Toaster position="top-right" />
      <motion.div className="mb-6" initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className={`${themeColors?.textSecondary || 'text-gray-400'}`}>
              Personnalisez votre expérience et gérez vos préférences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleSaveSettings} className={`bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300`}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </div>
        {saveSuccess && <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg flex items-center mb-4">
            <CheckIcon className="h-5 w-5 mr-2" />
            Paramètres mis à jour avec succès
          </div>}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-6 mb-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <GlobeIcon className="h-5 w-5 mr-2 text-blue-400" />
              Langue et région
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                  Langue
                </label>
                <div className="relative">
                  <select value={language} onChange={handleLanguageChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs mt-1 text-gray-400">
                  Langue actuelle : {getLanguageName(language)}
                </p>
              </div>
              <div>
                <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                  Format de devise
                </label>
                <div className="relative">
                  <select value={currencyFormat} onChange={e => setCurrencyFormat(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none">
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="CHF">Swiss Franc (CHF)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                  Format de date
                </label>
                <div className="relative">
                  <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-sm">Afficher les centimes</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input type="checkbox" id="toggle-cents" className="absolute w-0 h-0 opacity-0" checked={showCents} onChange={() => setShowCents(!showCents)} />
                    <label htmlFor="toggle-cents" className={`block h-6 overflow-hidden rounded-full cursor-pointer ${showCents ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${showCents ? 'translate-x-6' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </label>
                <p className="text-xs text-gray-400">
                  Exemple: {showCents ? '1 234,56€' : '1 235€'}
                </p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2 text-purple-400" />
              Données et confidentialité
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <RefreshCwIcon className="h-5 w-5 mr-2 text-blue-400" />
                    <span>Sauvegarde automatique des données</span>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input type="checkbox" id="toggle-autosave" className="absolute w-0 h-0 opacity-0" checked={dataAutoSave} onChange={() => setDataAutoSave(!dataAutoSave)} />
                    <label htmlFor="toggle-autosave" className={`block h-6 overflow-hidden rounded-full cursor-pointer ${dataAutoSave ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${dataAutoSave ? 'translate-x-6' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Sauvegarder automatiquement vos données financières
                </p>
              </div>
              <div>
                <label className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <EyeOffIcon className="h-5 w-5 mr-2 text-yellow-400" />
                    <span>Mode confidentialité</span>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input type="checkbox" id="toggle-privacy" className="absolute w-0 h-0 opacity-0" checked={privacyMode} onChange={() => setPrivacyMode(!privacyMode)} />
                    <label htmlFor="toggle-privacy" className={`block h-6 overflow-hidden rounded-full cursor-pointer ${privacyMode ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${privacyMode ? 'translate-x-6' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Masquer les montants sensibles sur l'écran
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <DownloadIcon className="h-4 w-4 mr-2 text-green-400" />
                  Exporter vos données
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button onClick={() => toast.success('Export CSV en cours...')} className="py-2 px-3 bg-black/20 hover:bg-black/30 rounded-lg text-sm flex items-center justify-center transition-all duration-200">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exporter en CSV
                  </button>
                  <button onClick={() => toast.success('Export JSON en cours...')} className="py-2 px-3 bg-black/20 hover:bg-black/30 rounded-lg text-sm flex items-center justify-center transition-all duration-200">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exporter en JSON
                  </button>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-medium mb-3 flex items-center text-red-400">
                  <AlertCircleIcon className="h-4 w-4 mr-2" />
                  Zone de danger
                </h4>
                <button onClick={handleDataReset} className="w-full py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg text-sm flex items-center justify-center transition-all duration-200">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Réinitialiser toutes les données
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Cette action est irréversible et supprimera toutes vos données
                  financières.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
        <div>
          <GlassCard className="p-6 mb-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <PaletteIcon className="h-5 w-5 mr-2 text-indigo-400" />
              Apparence
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Thème</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleThemeChange(false)} className={`p-3 rounded-lg flex flex-col items-center ${!darkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-black/20 hover:bg-black/30'}`}>
                    <SunIcon className="h-6 w-6 mb-1" />
                    <span className="text-sm">Clair</span>
                  </button>
                  <button onClick={() => handleThemeChange(true)} className={`p-3 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'bg-black/20 hover:bg-black/30'}`}>
                    <MoonIcon className="h-6 w-6 mb-1" />
                    <span className="text-sm">Sombre</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Palette de couleurs
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => toast.success('Thème appliqué')} className="p-3 rounded-lg flex flex-col items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div className="w-6 h-6 rounded-full bg-white mb-1"></div>
                    <span className="text-xs">Indigo</span>
                  </button>
                  <button onClick={() => toast.success('Fonctionnalité Premium')} className="p-3 rounded-lg flex flex-col items-center bg-black/20 hover:bg-black/30 relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-1"></div>
                    <span className="text-xs">Océan</span>
                    <LockIcon className="h-3 w-3 absolute top-1 right-1 text-yellow-400" />
                  </button>
                  <button onClick={() => toast.success('Fonctionnalité Premium')} className="p-3 rounded-lg flex flex-col items-center bg-black/20 hover:bg-black/30 relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-1"></div>
                    <span className="text-xs">Émeraude</span>
                    <LockIcon className="h-3 w-3 absolute top-1 right-1 text-yellow-400" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 mb-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-yellow-400" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span>Notifications</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input type="checkbox" id="toggle-notifications" className="absolute w-0 h-0 opacity-0" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                    <label htmlFor="toggle-notifications" className={`block h-6 overflow-hidden rounded-full cursor-pointer ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Activer ou désactiver toutes les notifications
                </p>
              </div>
              <div className={`space-y-3 ${!notificationsEnabled ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rappels d'objectifs</span>
                  <input type="checkbox" checked={notificationsEnabled} disabled={!notificationsEnabled} onChange={() => {}} className="rounded bg-black/20 border-white/10 text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mises à jour financières</span>
                  <input type="checkbox" checked={notificationsEnabled} disabled={!notificationsEnabled} onChange={() => {}} className="rounded bg-black/20 border-white/10 text-indigo-600 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conseils personnalisés</span>
                  <input type="checkbox" checked={notificationsEnabled} disabled={!notificationsEnabled} onChange={() => {}} className="rounded bg-black/20 border-white/10 text-indigo-600 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <LockIcon className="h-5 w-5 mr-2 text-green-400" />
              Version Premium
            </h3>
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <UnlockIcon className="h-5 w-5 mr-2 text-yellow-400" />
                <h4 className="font-medium">Version gratuite</h4>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                Vous utilisez actuellement la version gratuite de l'application.
              </p>
              <ul className="text-xs text-gray-400 space-y-1 mb-3">
                <li className="flex items-center">
                  <CheckIcon className="h-3 w-3 mr-1 text-green-400" />
                  Fonctionnalités de base
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-3 w-3 mr-1 text-green-400" />
                  Nombre limité de simulations
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-3 w-3 mr-1 text-green-400" />
                  Rapports standards
                </li>
              </ul>
              <button onClick={() => toast.success('Fonctionnalité en développement')} className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg text-sm">
                Passer à la version Premium
              </button>
            </div>
            <div className="text-xs text-center text-gray-400">
              La version Premium débloque toutes les fonctionnalités avancées,
              les exportations et les simulations personnalisées.
            </div>
          </GlassCard>
        </div>
      </div>
    </div>;
}