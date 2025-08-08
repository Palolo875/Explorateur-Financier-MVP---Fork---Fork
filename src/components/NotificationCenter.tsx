import React, { useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { BellIcon, BellRingIcon, CheckIcon, TrashIcon, AlertCircleIcon, InfoIcon, CheckCircleIcon, XCircleIcon, SettingsIcon, FilterIcon, ArrowUpIcon, ArrowDownIcon, ClockIcon, BellOffIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
// Types pour les notifications
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  date: Date;
  read: boolean;
  category: 'system' | 'budget' | 'goal' | 'transaction' | 'security';
  link?: string;
  actions?: {
    label: string;
    action: 'view' | 'dismiss' | 'snooze' | 'settings';
  }[];
}
// Types pour les préférences de notification
interface NotificationPreference {
  category: string;
  label: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}
export function NotificationCenter() {
  const navigate = useNavigate();
  const {
    theme,
    themeColors
  } = useTheme();
  const {
    financialData
  } = useFinance();
  // États
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([{
    category: 'system',
    label: 'Système',
    email: true,
    push: true,
    inApp: true
  }, {
    category: 'budget',
    label: 'Budget',
    email: true,
    push: true,
    inApp: true
  }, {
    category: 'goal',
    label: 'Objectifs',
    email: true,
    push: false,
    inApp: true
  }, {
    category: 'transaction',
    label: 'Transactions',
    email: false,
    push: true,
    inApp: true
  }, {
    category: 'security',
    label: 'Sécurité',
    email: true,
    push: true,
    inApp: true
  }]);
  // Générer des notifications fictives
  useEffect(() => {
    const mockNotifications: Notification[] = [{
      id: '1',
      title: 'Alerte budget',
      message: 'Vous avez atteint 85% de votre budget loisirs ce mois-ci.',
      type: 'warning',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      category: 'budget',
      actions: [{
        label: 'Voir le budget',
        action: 'view'
      }, {
        label: 'Ignorer',
        action: 'dismiss'
      }]
    }, {
      id: '2',
      title: 'Frais bancaires détectés',
      message: 'Nous avons détecté des frais bancaires inhabituels de 12,50€.',
      type: 'danger',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: false,
      category: 'transaction',
      actions: [{
        label: 'Analyser',
        action: 'view'
      }]
    }, {
      id: '3',
      title: 'Objectif atteint',
      message: 'Félicitations ! Vous avez atteint votre objectif d\'épargne "Vacances".',
      type: 'success',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      category: 'goal'
    }, {
      id: '4',
      title: 'Nouvelle analyse disponible',
      message: 'Votre rapport financier mensuel est disponible.',
      type: 'info',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: true,
      category: 'system',
      link: '/reports'
    }, {
      id: '5',
      title: 'Connexion détectée',
      message: 'Une nouvelle connexion a été détectée depuis Paris, France.',
      type: 'info',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: false,
      category: 'security',
      actions: [{
        label: "C'était moi",
        action: 'dismiss'
      }, {
        label: 'Paramètres de sécurité',
        action: 'settings'
      }]
    }, {
      id: '6',
      title: "Rappel d'échéance",
      message: 'Votre paiement de loyer est prévu dans 3 jours.',
      type: 'warning',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      read: true,
      category: 'transaction'
    }, {
      id: '7',
      title: "Mise à jour de l'application",
      message: "Une nouvelle version de l'application est disponible avec de nouvelles fonctionnalités.",
      type: 'info',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      read: true,
      category: 'system'
    }];
    setNotifications(mockNotifications);
  }, []);
  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    // Filtre par catégorie
    if (filter !== 'all' && notification.category !== filter) {
      return false;
    }
    // Filtre par statut de lecture
    if (showUnreadOnly && notification.read) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    // Tri par date
    if (sortOrder === 'newest') {
      return b.date.getTime() - a.date.getTime();
    } else {
      return a.date.getTime() - b.date.getTime();
    }
  });
  // Statistiques des notifications
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const notificationsByType = {
    info: notifications.filter(n => n.type === 'info').length,
    success: notifications.filter(n => n.type === 'success').length,
    warning: notifications.filter(n => n.type === 'warning').length,
    danger: notifications.filter(n => n.type === 'danger').length
  };
  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => notification.id === id ? {
      ...notification,
      read: true
    } : notification));
  };
  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      read: true
    })));
    toast.success('Toutes les notifications marquées comme lues');
  };
  // Supprimer une notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success('Notification supprimée');
  };
  // Supprimer toutes les notifications
  const deleteAllNotifications = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      setNotifications([]);
      toast.success('Toutes les notifications ont été supprimées');
    }
  };
  // Gérer l'action d'une notification
  const handleNotificationAction = (notification: Notification, actionType: string) => {
    switch (actionType) {
      case 'view':
        markAsRead(notification.id);
        if (notification.link) {
          navigate(notification.link);
        } else if (notification.category === 'budget') {
          navigate('/budget');
        } else if (notification.category === 'goal') {
          navigate('/goals');
        } else if (notification.category === 'transaction') {
          navigate('/transactions');
        }
        break;
      case 'dismiss':
        markAsRead(notification.id);
        break;
      case 'snooze':
        toast.success('Notification reportée pour plus tard');
        break;
      case 'settings':
        setActiveTab('preferences');
        break;
      default:
        break;
    }
  };
  // Mettre à jour les préférences de notification
  const updatePreference = (category: string, type: 'email' | 'push' | 'inApp', value: boolean) => {
    setNotificationPreferences(prev => prev.map(pref => pref.category === category ? {
      ...pref,
      [type]: value
    } : pref));
  };
  // Obtenir l'icône du type de notification
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="h-4 w-4 text-blue-400" />;
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertCircleIcon className="h-4 w-4 text-yellow-400" />;
      case 'danger':
        return <XCircleIcon className="h-4 w-4 text-red-400" />;
      default:
        return <BellIcon className="h-4 w-4" />;
    }
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
        <h1 className="text-3xl font-bold">Centre de notifications</h1>
        <p className={`${themeColors?.textSecondary || 'text-gray-400'}`}>
          Gérez vos alertes et préférences de notification
        </p>
      </motion.div>
      {/* Résumé des notifications */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Non lues
            </h3>
            <div className="p-2 rounded-full bg-blue-500/20">
              <BellRingIcon className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{unreadNotifications}</div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            sur {totalNotifications} notifications
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Alertes
            </h3>
            <div className="p-2 rounded-full bg-red-500/20">
              <AlertCircleIcon className="h-4 w-4 text-red-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {notificationsByType.warning + notificationsByType.danger}
          </div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            nécessitent votre attention
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Informations
            </h3>
            <div className="p-2 rounded-full bg-indigo-500/20">
              <InfoIcon className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {notificationsByType.info}
          </div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            mises à jour du système
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Succès
            </h3>
            <div className="p-2 rounded-full bg-green-500/20">
              <CheckCircleIcon className="h-4 w-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {notificationsByType.success}
          </div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            objectifs atteints
          </div>
        </GlassCard>
      </div>
      {/* Onglets */}
      <div className="flex border-b border-white/10 mb-6">
        <button className={`pb-3 px-4 ${activeTab === 'notifications' ? `border-b-2 border-indigo-500 text-indigo-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('notifications')}>
          <div className="flex items-center">
            <BellIcon className="mr-1.5 h-4 w-4" />
            Notifications
          </div>
        </button>
        <button className={`pb-3 px-4 ${activeTab === 'preferences' ? `border-b-2 border-indigo-500 text-indigo-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('preferences')}>
          <div className="flex items-center">
            <SettingsIcon className="mr-1.5 h-4 w-4" />
            Préférences
          </div>
        </button>
      </div>
      {activeTab === 'notifications' ? <>
          {/* Filtres et actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex flex-wrap gap-2">
              <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-black/20 border border-white/10 rounded-lg py-1.5 px-3 text-sm">
                <option value="all">Toutes les catégories</option>
                <option value="system">Système</option>
                <option value="budget">Budget</option>
                <option value="goal">Objectifs</option>
                <option value="transaction">Transactions</option>
                <option value="security">Sécurité</option>
              </select>
              <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} className="bg-black/20 hover:bg-black/30 py-1.5 px-3 rounded-lg text-sm flex items-center">
                <FilterIcon className="h-4 w-4 mr-1.5" />
                {sortOrder === 'newest' ? <>
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                    Plus récentes
                  </> : <>
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                    Plus anciennes
                  </>}
              </button>
              <label className="flex items-center bg-black/20 hover:bg-black/30 py-1.5 px-3 rounded-lg text-sm cursor-pointer">
                <input type="checkbox" checked={showUnreadOnly} onChange={() => setShowUnreadOnly(!showUnreadOnly)} className="mr-2" />
                Non lues uniquement
              </label>
            </div>
            <div className="flex gap-2">
              {unreadNotifications > 0 && <button onClick={markAllAsRead} className="bg-black/20 hover:bg-black/30 py-1.5 px-3 rounded-lg text-sm flex items-center">
                  <CheckIcon className="h-4 w-4 mr-1.5" />
                  Tout marquer comme lu
                </button>}
              {notifications.length > 0 && <button onClick={deleteAllNotifications} className="bg-black/20 hover:bg-black/30 py-1.5 px-3 rounded-lg text-sm flex items-center">
                  <TrashIcon className="h-4 w-4 mr-1.5" />
                  Tout supprimer
                </button>}
            </div>
          </div>
          {/* Liste des notifications */}
          <div className="space-y-3 mb-6">
            {filteredNotifications.length > 0 ? filteredNotifications.map(notification => <GlassCard key={notification.id} className={`p-4 ${!notification.read ? 'border-l-4 border-indigo-500' : ''}`} animate hover>
                  <div className="flex items-start">
                    <div className={`mt-1 mr-3 p-1.5 rounded-full ${notification.type === 'info' ? 'bg-blue-500/20' : notification.type === 'success' ? 'bg-green-500/20' : notification.type === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-white' : themeColors?.textSecondary || 'text-gray-400'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-3">
                            {formatDistanceToNow(notification.date, {
                      addSuffix: true,
                      locale: fr
                    })}
                          </span>
                          <button onClick={() => deleteNotification(notification.id)} className="p-1 hover:bg-black/20 rounded-full">
                            <TrashIcon className="h-3.5 w-3.5 text-gray-400 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-1 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {notification.actions?.map((action, index) => <button key={index} onClick={() => handleNotificationAction(notification, action.action)} className="text-xs bg-black/30 hover:bg-black/40 px-2 py-1 rounded">
                              {action.label}
                            </button>)}
                        </div>
                        {!notification.read && <button onClick={() => markAsRead(notification.id)} className="text-xs text-indigo-400 hover:text-indigo-300">
                            Marquer comme lu
                          </button>}
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <div className="px-1.5 py-0.5 bg-black/20 rounded text-gray-400 mr-2">
                          {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                        </div>
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {format(notification.date, 'dd/MM/yyyy à HH:mm')}
                      </div>
                    </div>
                  </div>
                </GlassCard>) : <GlassCard className="p-8 text-center" animate>
                <BellOffIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-medium mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-400">
                  {showUnreadOnly ? "Vous n'avez aucune notification non lue pour le moment." : filter !== 'all' ? `Vous n'avez aucune notification dans la catégorie "${filter}".` : "Vous n'avez aucune notification pour le moment."}
                </p>
              </GlassCard>}
          </div>
        </> : <>
          {/* Préférences de notification */}
          <GlassCard className="p-6 mb-6" animate>
            <h3 className="text-lg font-medium mb-4">
              Préférences de notification
            </h3>
            <div className="space-y-4">
              {notificationPreferences.map(pref => <div key={pref.category} className="bg-black/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">{pref.label}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                      <span className="text-sm">Email</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={pref.email} onChange={e => updatePreference(pref.category, 'email', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                      <span className="text-sm">Push</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={pref.push} onChange={e => updatePreference(pref.category, 'push', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                      <span className="text-sm">Dans l'app</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={pref.inApp} onChange={e => updatePreference(pref.category, 'inApp', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>)}
            </div>
            <div className="mt-4">
              <button onClick={() => toast.success('Préférences enregistrées')} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-white`}>
                Enregistrer les préférences
              </button>
            </div>
          </GlassCard>
          <GlassCard className="p-6" animate>
            <h3 className="text-lg font-medium mb-4">Canaux de notification</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-gray-400">user@example.com</p>
                  </div>
                  <button className="text-sm bg-black/30 hover:bg-black/40 px-3 py-1.5 rounded">
                    Modifier
                  </button>
                </div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications push</h4>
                    <p className="text-sm text-gray-400">
                      Activées sur cet appareil
                    </p>
                  </div>
                  <button className="text-sm bg-black/30 hover:bg-black/40 px-3 py-1.5 rounded">
                    Gérer les appareils
                  </button>
                </div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS</h4>
                    <p className="text-sm text-gray-400">Non configuré</p>
                  </div>
                  <button className="text-sm bg-black/30 hover:bg-black/40 px-3 py-1.5 rounded">
                    Configurer
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </>}
    </div>;
}