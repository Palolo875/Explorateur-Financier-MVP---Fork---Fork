import React, { useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { toast, Toaster } from 'react-hot-toast';
import { UserIcon, MailIcon, PhoneIcon, HomeIcon, CreditCardIcon, ShieldIcon, BellIcon, SaveIcon, CheckIcon, KeyIcon, BadgeIcon, CalendarIcon, PenIcon, EyeIcon, EyeOffIcon, FileIcon, DownloadIcon, UploadIcon, BookmarkIcon, LockIcon } from 'lucide-react';
export function Profile() {
  const navigate = useNavigate();
  const {
    themeColors
  } = useTheme();
  // Profile state
  const [profileData, setProfileData] = useState({
    name: 'Utilisateur',
    email: 'utilisateur@example.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de Paris, 75001 Paris, France',
    birthdate: '1985-05-15',
    occupation: 'Profession'
  });
  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    current: '',
    new: '',
    confirm: ''
  });
  // UI state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // Activity data
  const [activityData] = useState([{
    date: '2023-12-15',
    action: 'Simulation créée',
    details: 'Simulation optimiste'
  }, {
    date: '2023-12-10',
    action: 'Objectif ajouté',
    details: "Fonds d'urgence"
  }, {
    date: '2023-12-05',
    action: 'Profil mis à jour',
    details: 'Informations personnelles'
  }, {
    date: '2023-11-28',
    action: 'Inscription',
    details: 'Bienvenue sur la plateforme'
  }]);
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  // Validate form
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      phone: '',
      current: '',
      new: '',
      confirm: ''
    };
    // Validate name - avec vérification supplémentaire
    if (!profileData.name || !profileData.name.trim()) {
      errors.name = 'Le nom est requis';
      isValid = false;
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileData.email || !profileData.email.trim() || !emailRegex.test(profileData.email)) {
      errors.email = 'Email invalide';
      isValid = false;
    }
    // Validate phone (simple check)
    if (profileData.phone && !/^[+\d\s()-]{6,20}$/.test(profileData.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };
  // Validate password
  const validatePassword = () => {
    let isValid = true;
    const errors = {
      ...formErrors
    };
    if (!passwordData.current) {
      errors.current = 'Le mot de passe actuel est requis';
      isValid = false;
    }
    if (!passwordData.new) {
      errors.new = 'Le nouveau mot de passe est requis';
      isValid = false;
    } else if (passwordData.new.length < 8) {
      errors.new = 'Le mot de passe doit contenir au moins 8 caractères';
      isValid = false;
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };
  // Handle save profile
  const handleSaveProfile = () => {
    if (validateForm()) {
      // In a real app, this would save to the backend
      toast.success('Profil mis à jour avec succès');
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } else {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
    }
  };
  // Handle change password
  const handleChangePassword = () => {
    if (validatePassword()) {
      toast.success('Mot de passe mis à jour avec succès');
      setChangingPassword(false);
      setPasswordData({
        current: '',
        new: '',
        confirm: ''
      });
    } else {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
    }
  };
  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target?.result) {
            setPhotoPreview(event.target.result as string);
          }
          setUploadingPhoto(false);
          toast.success('Photo de profil mise à jour');
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
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
            <h1 className="text-3xl font-bold">Profil</h1>
            <p className={`${themeColors?.textSecondary || 'text-gray-400'}`}>
              Gérez vos informations personnelles et préférences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleSaveProfile} className={`bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300`}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Sauvegarder
            </button>
          </div>
        </div>
        {saveSuccess && <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg flex items-center mb-4">
            <CheckIcon className="h-5 w-5 mr-2" />
            Profil mis à jour avec succès
          </div>}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <GlassCard className="p-6 mb-6" animate>
            <div className="flex flex-col items-center">
              <div className="relative">
                {uploadingPhoto ? <div className="w-32 h-32 rounded-full bg-black/30 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                  </div> : photoPreview ? <img src={photoPreview} alt="Profile" className="w-32 h-32 rounded-full object-cover" /> : <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>}
                <div className="absolute bottom-0 right-0">
                  <label className="cursor-pointer w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors">
                    <PenIcon className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>
              <h2 className="text-xl font-semibold mt-4">{profileData.name}</h2>
              <p className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
                Membre depuis 2023
              </p>
              <div className="mt-6 w-full">
                <div className="flex space-x-2">
                  <label className="flex-1 cursor-pointer py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-sm text-center block">
                    Modifier la photo
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                  {photoPreview && <button onClick={() => setPhotoPreview(null)} className="py-2 px-3 rounded-lg bg-black/30 hover:bg-black/40 text-sm">
                      Supprimer
                    </button>}
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 mb-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <BadgeIcon className="h-5 w-5 mr-2 text-blue-400" />
              Niveau du compte
            </h3>
            <div className="bg-black/20 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Compte Standard</h4>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                  Actif
                </span>
              </div>
              <div className="w-full bg-black/30 h-2 rounded-full mb-1">
                <div className="h-2 rounded-full bg-indigo-500" style={{
                width: '30%'
              }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Standard</span>
                <span>Premium</span>
              </div>
              <button onClick={() => toast.success('Fonctionnalité en développement')} className="w-full mt-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-sm">
                Passer à Premium
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Simulations avancées</span>
                <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full">
                  Premium
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Exportations PDF</span>
                <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full">
                  Premium
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conseils personnalisés</span>
                <span className="text-xs bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full">
                  Premium
                </span>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-green-400" />
              Activité récente
            </h3>
            <div className="space-y-4">
              {activityData.map((activity, index) => <div key={index} className="bg-black/20 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {activity.action}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{activity.details}</p>
                </div>)}
              <button onClick={() => toast.success('Fonctionnalité en développement')} className="w-full py-2 bg-black/20 hover:bg-black/30 rounded-lg text-sm transition-all duration-200">
                Voir toute l'activité
              </button>
            </div>
          </GlassCard>
        </div>
        <div className="lg:col-span-2">
          <GlassCard className="p-6 mb-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-indigo-400" />
              Informations personnelles
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                  Nom complet
                </label>
                <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className={`w-full bg-black/20 border ${formErrors.name ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50`} />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                    Email
                  </label>
                  <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className={`w-full bg-black/20 border ${formErrors.email ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50`} />
                  </div>
                  {formErrors.email && <p className="text-xs text-red-500 mt-1">
                      {formErrors.email}
                    </p>}
                </div>
                <div>
                  <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                    Téléphone
                  </label>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} className={`w-full bg-black/20 border ${formErrors.phone ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50`} />
                  </div>
                  {formErrors.phone && <p className="text-xs text-red-500 mt-1">
                      {formErrors.phone}
                    </p>}
                </div>
              </div>
              <div>
                <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                  Adresse
                </label>
                <div className="flex items-center">
                  <HomeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <input type="text" name="address" value={profileData.address} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                    Date de naissance
                  </label>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <input type="date" name="birthdate" value={profileData.birthdate} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm ${themeColors?.textSecondary || 'text-gray-400'} mb-1`}>
                    Profession
                  </label>
                  <div className="flex items-center">
                    <BadgeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <input type="text" name="occupation" value={profileData.occupation} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6 mb-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <ShieldIcon className="h-5 w-5 mr-2 text-green-400" />
              Sécurité et notifications
            </h3>
            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ShieldIcon className="h-5 w-5 mr-2 text-green-400" />
                    <span>Authentification à deux facteurs</span>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input type="checkbox" id="toggle-2fa" className="absolute w-0 h-0 opacity-0" checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} />
                    <label htmlFor="toggle-2fa" className={`block h-6 overflow-hidden rounded-full cursor-pointer ${twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </label>
                <div className="text-sm text-gray-400 mb-4">
                  Augmentez la sécurité de votre compte avec l'authentification
                  à deux facteurs
                </div>
              </div>
              <div>
                <label className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <BellIcon className="h-5 w-5 mr-2 text-yellow-400" />
                    <span>Notifications par email</span>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input type="checkbox" id="toggle-email" className="absolute w-0 h-0 opacity-0" checked={emailNotificationsEnabled} onChange={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)} />
                    <label htmlFor="toggle-email" className={`block h-6 overflow-hidden rounded-full cursor-pointer ${emailNotificationsEnabled ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                      <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ${emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
                    </label>
                  </div>
                </label>
                <div className="text-sm text-gray-400 mb-4">
                  Recevez des notifications par email sur les mises à jour
                  importantes
                </div>
              </div>
              {!changingPassword ? <div>
                  <button onClick={() => setChangingPassword(true)} className="w-full py-2 bg-black/20 hover:bg-black/30 rounded-lg text-sm transition-all duration-200 flex items-center justify-center">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </button>
                </div> : <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <input type={passwordVisible ? 'text' : 'password'} name="current" value={passwordData.current} onChange={handlePasswordChange} className={`w-full bg-black/30 border ${formErrors.current ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50`} />
                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 flex items-center px-3">
                          {passwordVisible ? <EyeOffIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400" />}
                        </button>
                      </div>
                      {formErrors.current && <p className="text-xs text-red-500 mt-1">
                          {formErrors.current}
                        </p>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Nouveau mot de passe
                      </label>
                      <input type={passwordVisible ? 'text' : 'password'} name="new" value={passwordData.new} onChange={handlePasswordChange} className={`w-full bg-black/30 border ${formErrors.new ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50`} />
                      {formErrors.new && <p className="text-xs text-red-500 mt-1">
                          {formErrors.new}
                        </p>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Confirmer le mot de passe
                      </label>
                      <input type={passwordVisible ? 'text' : 'password'} name="confirm" value={passwordData.confirm} onChange={handlePasswordChange} className={`w-full bg-black/30 border ${formErrors.confirm ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50`} />
                      {formErrors.confirm && <p className="text-xs text-red-500 mt-1">
                          {formErrors.confirm}
                        </p>}
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button onClick={handleChangePassword} className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 rounded-lg text-sm">
                        Mettre à jour
                      </button>
                      <button onClick={() => {
                    setChangingPassword(false);
                    setPasswordData({
                      current: '',
                      new: '',
                      confirm: ''
                    });
                    setFormErrors({
                      ...formErrors,
                      current: '',
                      new: '',
                      confirm: ''
                    });
                  }} className="py-2 px-4 bg-black/30 hover:bg-black/40 rounded-lg text-sm">
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>}
            </div>
          </GlassCard>
          <GlassCard className="p-6" animate>
            <h3 className="font-medium mb-4 flex items-center">
              <FileIcon className="h-5 w-5 mr-2 text-blue-400" />
              Documents et données
            </h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-3">
                  Exportation des données
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  Exportez toutes vos données financières et simulations dans
                  différents formats
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button onClick={() => toast.success('Export CSV en cours...')} className="py-2 px-3 bg-black/30 hover:bg-black/40 rounded-lg text-sm flex items-center justify-center">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exporter en CSV
                  </button>
                  <button onClick={() => toast.success('Export JSON en cours...')} className="py-2 px-3 bg-black/30 hover:bg-black/40 rounded-lg text-sm flex items-center justify-center">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exporter en JSON
                  </button>
                </div>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-3">
                  Importation des données
                </h4>
                <p className="text-xs text-gray-400 mb-3">
                  Importez vos données financières depuis un fichier
                </p>
                <label className="w-full py-2 px-3 bg-black/30 hover:bg-black/40 rounded-lg text-sm flex items-center justify-center cursor-pointer">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Importer des données
                  <input type="file" className="hidden" accept=".csv,.json" onChange={() => toast.success('Fonctionnalité en développement')} />
                </label>
              </div>
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <BookmarkIcon className="h-4 w-4 mr-2 text-yellow-400" />
                  Préférences enregistrées
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sauvegardes automatiques</span>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                      Activé
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Synchronisation cloud</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full flex items-center">
                      <LockIcon className="h-3 w-3 mr-1" />
                      Premium
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Stockage des données</span>
                    <span className="text-xs">Local</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>;
}