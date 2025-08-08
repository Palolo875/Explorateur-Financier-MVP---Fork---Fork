import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { GlassCard } from './ui/GlassCard';
import { RevealAnimation } from './ui/RevealAnimation';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, TrashIcon, EditIcon, RefreshCwIcon, SaveIcon, CreditCardIcon, WalletIcon, BriefcaseIcon, CoinsIcon, BadgeEuroIcon, HomeIcon, ShoppingBagIcon, CarIcon, UtensilsIcon, HeartIcon, GraduationCapIcon, SmileIcon, CheckIcon, XIcon, PiggyBankIcon, TrendingUpIcon, AlertCircleIcon, CloudRainIcon, SunIcon, CloudIcon } from 'lucide-react';
import { FinancialItem } from '../types/finance';
import { toast, Toaster } from 'react-hot-toast';
import { externalApiService } from '../services/ExternalAPIService';
// Définir les types pour les catégories
type CategoryType = 'income' | 'expense' | 'saving' | 'debt';
type CategoryItem = {
  id: string;
  name: string;
  icon: JSX.Element;
};
// Définition explicite des catégories avec typage strict
const categories: Record<CategoryType, CategoryItem[]> = {
  income: [{
    id: 'salary',
    name: 'Salaire',
    icon: <BriefcaseIcon className="h-4 w-4" />
  }, {
    id: 'freelance',
    name: 'Freelance',
    icon: <BadgeEuroIcon className="h-4 w-4" />
  }, {
    id: 'investments',
    name: 'Investissements',
    icon: <TrendingUpIcon className="h-4 w-4" />
  }, {
    id: 'rental',
    name: 'Location',
    icon: <HomeIcon className="h-4 w-4" />
  }, {
    id: 'other_income',
    name: 'Autres',
    icon: <WalletIcon className="h-4 w-4" />
  }],
  expense: [{
    id: 'housing',
    name: 'Logement',
    icon: <HomeIcon className="h-4 w-4" />
  }, {
    id: 'food',
    name: 'Alimentation',
    icon: <UtensilsIcon className="h-4 w-4" />
  }, {
    id: 'transport',
    name: 'Transport',
    icon: <CarIcon className="h-4 w-4" />
  }, {
    id: 'utilities',
    name: 'Factures',
    icon: <CreditCardIcon className="h-4 w-4" />
  }, {
    id: 'health',
    name: 'Santé',
    icon: <HeartIcon className="h-4 w-4" />
  }, {
    id: 'education',
    name: 'Éducation',
    icon: <GraduationCapIcon className="h-4 w-4" />
  }, {
    id: 'shopping',
    name: 'Shopping',
    icon: <ShoppingBagIcon className="h-4 w-4" />
  }, {
    id: 'leisure',
    name: 'Loisirs',
    icon: <SmileIcon className="h-4 w-4" />
  }, {
    id: 'other_expense',
    name: 'Autres',
    icon: <CreditCardIcon className="h-4 w-4" />
  }],
  saving: [{
    id: 'emergency',
    name: "Fonds d'urgence",
    icon: <AlertCircleIcon className="h-4 w-4" />
  }, {
    id: 'savings',
    name: 'Épargne',
    icon: <PiggyBankIcon className="h-4 w-4" />
  }, {
    id: 'retirement',
    name: 'Retraite',
    icon: <CoinsIcon className="h-4 w-4" />
  }],
  debt: [{
    id: 'mortgage',
    name: 'Crédit immobilier',
    icon: <HomeIcon className="h-4 w-4" />
  }, {
    id: 'loan',
    name: 'Prêt',
    icon: <CreditCardIcon className="h-4 w-4" />
  }, {
    id: 'credit_card',
    name: 'Carte de crédit',
    icon: <CreditCardIcon className="h-4 w-4" />
  }]
};
// Type pour les fréquences
type FrequencyItem = {
  id: string;
  name: string;
};
const frequencies: FrequencyItem[] = [{
  id: 'daily',
  name: 'Quotidien'
}, {
  id: 'weekly',
  name: 'Hebdomadaire'
}, {
  id: 'monthly',
  name: 'Mensuel'
}, {
  id: 'quarterly',
  name: 'Trimestriel'
}, {
  id: 'yearly',
  name: 'Annuel'
}, {
  id: 'once',
  name: 'Ponctuel'
}];
export function MappingScreen() {
  const navigate = useNavigate();
  const {
    theme,
    themeColors
  } = useTheme();
  const {
    financialData,
    setFinancialData,
    userQuestion,
    emotionalContext
  } = useFinance();
  const [activeTab, setActiveTab] = useState<CategoryType>('income');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<any>(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  // Initialize financial data with safe defaults
  const safeFinancialData = {
    incomes: financialData?.incomes || [],
    expenses: financialData?.expenses || [],
    savings: financialData?.savings || [],
    debts: financialData?.debts || []
  };
  // Récupérer les données météo - Amélioration avec gestion d'erreur et location dynamique
  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        // Tenter de détecter la localisation de l'utilisateur via l'API de géolocalisation
        navigator.geolocation.getCurrentPosition(async position => {
          try {
            // Si on a la position, on peut obtenir la ville via reverse geocoding
            // Mais pour simplifier, on utilise Paris comme fallback
            const data = await externalApiService.getWeatherData('Paris');
            console.log('Weather data fetched:', data);
            setWeatherData(data);
          } catch (error) {
            console.error('Error fetching weather with geolocation:', error);
            // Fallback to Paris
            const data = await externalApiService.getWeatherData('Paris');
            setWeatherData(data);
          }
        }, async error => {
          // En cas d'erreur ou de refus de géolocalisation
          console.warn('Geolocation error or denied:', error);
          const data = await externalApiService.getWeatherData('Paris');
          setWeatherData(data);
        });
      } catch (error) {
        console.error('Error in weather fetch process:', error);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
    // Rafraîchir les données météo toutes les 15 minutes
    const weatherInterval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => {
      clearInterval(weatherInterval);
    };
  }, []);
  // Récupérer les taux de change
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setExchangeLoading(true);
      try {
        const data = await externalApiService.getExchangeRates('EUR');
        setExchangeRates(data);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      } finally {
        setExchangeLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);
  // Convertir un montant dans une autre devise
  const convertCurrency = (amount: number, targetCurrency: string) => {
    if (!exchangeRates || !exchangeRates.rates) return amount;
    const rate = exchangeRates.rates[targetCurrency];
    if (!rate) return amount;
    return (amount * rate).toFixed(2);
  };
  // ✅ Helper function pour les noms d'affichage
  const getCategoryDisplayName = (tab: string) => {
    switch (tab) {
      case 'income':
        return 'Revenu';
      case 'expense':
        return 'Dépense';
      case 'saving':
        return 'Épargne';
      case 'debt':
        return 'Dette';
      default:
        return 'Élément';
    }
  };
  // ✅ Fonction pour obtenir les éléments de l'onglet actif
  const getActiveItems = () => {
    if (!financialData) return [];
    switch (activeTab) {
      case 'income':
        return financialData.incomes || [];
      case 'expense':
        return financialData.expenses || [];
      case 'saving':
        return financialData.savings || [];
      case 'debt':
        return financialData.debts || [];
      default:
        return [];
    }
  };
  // Safe calculate totals with null checks
  const calculateTotal = (items: FinancialItem[] = []): number => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (typeof item?.value === 'number' ? item.value : parseFloat(item?.value || '0') || 0), 0);
  };
  const totalIncome = calculateTotal(safeFinancialData.incomes);
  const totalExpenses = calculateTotal(safeFinancialData.expenses);
  const totalSavings = calculateTotal(safeFinancialData.savings);
  const totalDebt = calculateTotal(safeFinancialData.debts);
  const balance = totalIncome - totalExpenses;
  // Form state with proper typing
  const [formData, setFormData] = useState({
    category: '',
    value: '',
    description: '',
    frequency: 'monthly',
    isRecurring: true
  });
  // Show animation on mount
  useEffect(() => {
    setTimeout(() => {
      setShowAnimation(true);
    }, 500);
    setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
  }, []);
  // ✅ Gestion de la sélection de catégorie
  const handleCategorySelect = (categoryId: string) => {
    console.log('🏷️ Catégorie sélectionnée:', categoryId);
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
  };
  // ✅ Gestion améliorée des changements d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    console.log(`📝 Changement de champ: ${name} = ${value}`);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'value') {
      // Nettoyer et valider la valeur numérique
      const cleanValue = value.replace(/[^0-9.,]/g, '').replace(',', '.');
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  // ✅ Fonction de validation améliorée
  const validateForm = () => {
    console.log('🔍 Validation des données:', formData);
    // Vérifier la catégorie
    if (!formData.category || formData.category.trim() === '') {
      console.log('❌ Catégorie manquante');
      toast.error('Veuillez sélectionner une catégorie');
      return false;
    }
    // Vérifier la valeur
    if (!formData.value || formData.value.trim() === '') {
      console.log('❌ Valeur manquante');
      toast.error('Veuillez entrer un montant');
      return false;
    }
    // Vérifier que la valeur est un nombre valide
    const numericValue = parseFloat(formData.value.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) {
      console.log('❌ Valeur invalide:', formData.value, 'parsed:', numericValue);
      toast.error('Le montant doit être un nombre positif');
      return false;
    }
    console.log('✅ Validation réussie');
    return true;
  };
  // ✅ Fonction de réinitialisation du formulaire
  const resetForm = () => {
    console.log('🔄 Réinitialisation du formulaire');
    setFormData({
      category: '',
      value: '',
      description: '',
      frequency: 'monthly',
      isRecurring: true
    });
  };
  // ✅ Fonction handleAddItem complètement refaite
  const handleAddItem = async () => {
    console.log('🚀 Début handleAddItem');
    console.log('📋 Données du formulaire:', formData);
    console.log('📊 État financier actuel:', financialData);
    console.log('📑 Onglet actif:', activeTab);
    try {
      // Validation
      if (!validateForm()) {
        console.log('❌ Échec de la validation');
        return;
      }
      setIsLoading(true);
      // Créer le nouvel élément avec un ID unique
      const newItem = {
        id: `${activeTab}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category: formData.category.trim(),
        value: parseFloat(formData.value.replace(',', '.')),
        description: formData.description.trim() || '',
        frequency: formData.frequency as any,
        isRecurring: Boolean(formData.isRecurring),
        date: new Date().toISOString(),
        tags: []
      };
      console.log('📦 Nouvel élément créé:', newItem);
      // Créer une copie profonde des données financières actuelles
      // ou initialiser un nouvel objet si financialData est null/undefined
      const currentData = financialData ? JSON.parse(JSON.stringify(financialData)) : {
        incomes: [],
        expenses: [],
        savings: [],
        debts: []
      };
      // S'assurer que tous les tableaux existent
      if (!currentData.incomes) currentData.incomes = [];
      if (!currentData.expenses) currentData.expenses = [];
      if (!currentData.savings) currentData.savings = [];
      if (!currentData.debts) currentData.debts = [];
      // Ajouter à la bonne catégorie selon l'onglet actif
      switch (activeTab) {
        case 'income':
          currentData.incomes.push(newItem);
          break;
        case 'expense':
          currentData.expenses.push(newItem);
          break;
        case 'saving':
          currentData.savings.push(newItem);
          break;
        case 'debt':
          currentData.debts.push(newItem);
          break;
        default:
          console.error('❌ Onglet actif invalide:', activeTab);
          toast.error('Erreur interne: onglet invalide');
          setIsLoading(false);
          return;
      }
      console.log('💾 Données mises à jour:', currentData);
      // Mettre à jour l'état avec les nouvelles données
      setFinancialData(currentData);
      // Réinitialiser le formulaire
      resetForm();
      setIsAdding(false);
      setIsEditing(null);
      // Feedback utilisateur
      toast.success(`${getCategoryDisplayName(activeTab)} ajouté avec succès !`);
      console.log('✅ Élément ajouté avec succès');
    } catch (error) {
      console.error("💥 Erreur lors de l'ajout:", error);
      toast.error("Une erreur est survenue lors de l'ajout");
    } finally {
      setIsLoading(false);
    }
  };
  // ✅ Fonction pour éditer un élément
  const handleEditItem = (item: any) => {
    console.log("✏️ Édition de l'élément:", item);
    setIsEditing(item.id);
    setFormData({
      category: item.category || '',
      value: item.value?.toString() || '',
      description: item.description || '',
      frequency: item.frequency || 'monthly',
      isRecurring: item.isRecurring !== false // true par défaut
    });
    setIsAdding(true);
  };
  // ✅ Fonction pour mettre à jour un élément
  const handleUpdateItem = async () => {
    if (!isEditing || !validateForm()) return;
    console.log("📝 Mise à jour de l'élément:", isEditing);
    try {
      setIsLoading(true);
      const updatedItem = {
        id: isEditing,
        category: formData.category.trim(),
        value: parseFloat(formData.value.replace(',', '.')),
        description: formData.description.trim() || '',
        frequency: formData.frequency as any,
        isRecurring: Boolean(formData.isRecurring),
        date: new Date().toISOString(),
        tags: []
      };
      // Créer une copie profonde des données financières actuelles
      const updatedData = financialData ? JSON.parse(JSON.stringify(financialData)) : {
        incomes: [],
        expenses: [],
        savings: [],
        debts: []
      };
      // S'assurer que tous les tableaux existent
      if (!updatedData.incomes) updatedData.incomes = [];
      if (!updatedData.expenses) updatedData.expenses = [];
      if (!updatedData.savings) updatedData.savings = [];
      if (!updatedData.debts) updatedData.debts = [];
      // Mettre à jour dans la bonne catégorie
      switch (activeTab) {
        case 'income':
          updatedData.incomes = updatedData.incomes.map((item: any) => item.id === isEditing ? updatedItem : item);
          break;
        case 'expense':
          updatedData.expenses = updatedData.expenses.map((item: any) => item.id === isEditing ? updatedItem : item);
          break;
        case 'saving':
          updatedData.savings = updatedData.savings.map((item: any) => item.id === isEditing ? updatedItem : item);
          break;
        case 'debt':
          updatedData.debts = updatedData.debts.map((item: any) => item.id === isEditing ? updatedItem : item);
          break;
      }
      setFinancialData(updatedData);
      resetForm();
      setIsAdding(false);
      setIsEditing(null);
      toast.success('Élément mis à jour avec succès');
    } catch (error) {
      console.error('💥 Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };
  // ✅ Fonction pour supprimer un élément
  const handleDeleteItem = (id: string) => {
    console.log("🗑️ Suppression de l'élément:", id);
    if (!financialData) return;
    // Créer une copie profonde des données financières actuelles
    const updatedData = JSON.parse(JSON.stringify(financialData));
    // S'assurer que tous les tableaux existent
    if (!updatedData.incomes) updatedData.incomes = [];
    if (!updatedData.expenses) updatedData.expenses = [];
    if (!updatedData.savings) updatedData.savings = [];
    if (!updatedData.debts) updatedData.debts = [];
    switch (activeTab) {
      case 'income':
        updatedData.incomes = updatedData.incomes.filter((item: any) => item.id !== id);
        break;
      case 'expense':
        updatedData.expenses = updatedData.expenses.filter((item: any) => item.id !== id);
        break;
      case 'saving':
        updatedData.savings = updatedData.savings.filter((item: any) => item.id !== id);
        break;
      case 'debt':
        updatedData.debts = updatedData.debts.filter((item: any) => item.id !== id);
        break;
    }
    setFinancialData(updatedData);
    toast.success('Élément supprimé avec succès');
  };
  // Handle back
  const handleBack = () => {
    navigate('/question');
  };
  // Handle continue
  const handleContinue = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigate('/reveal');
    }, 1000);
  };
  // Get category label
  const getCategoryLabel = (categoryId: string): string => {
    const allCategories = Object.values(categories).flat();
    const category = allCategories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  // Get category icon
  const getCategoryIcon = (categoryId: string): JSX.Element => {
    const allCategories = Object.values(categories).flat();
    const category = allCategories.find(c => c.id === categoryId);
    return category ? category.icon : <CreditCardIcon className="h-4 w-4" />;
  };
  // Get frequency label
  const getFrequencyLabel = (frequencyId: string): string => {
    const frequency = frequencies.find(f => f.id === frequencyId);
    return frequency ? frequency.name : frequencyId;
  };
  // Obtenir l'icône météo appropriée avec une meilleure gestion des états
  const getWeatherIcon = (): JSX.Element => {
    if (weatherLoading) return <RefreshCwIcon className="h-4 w-4 animate-spin" />;
    if (!weatherData) return <CloudIcon className="h-4 w-4" />;
    const condition = weatherData.condition.toLowerCase();
    console.log('Weather condition:', condition);
    if (condition.includes('pluie') || condition.includes('pluvieux') || condition.includes('averse')) {
      return <CloudRainIcon className="h-4 w-4 text-blue-400" />;
    } else if (condition.includes('nuage') || condition.includes('couvert') || condition.includes('partiellement')) {
      return <CloudIcon className="h-4 w-4 text-gray-400" />;
    } else if (condition.includes('brouillard')) {
      return <CloudIcon className="h-4 w-4 text-gray-300" />;
    } else if (condition.includes('neige')) {
      return <CloudIcon className="h-4 w-4 text-white" />;
    } else if (condition.includes('orage')) {
      return <CloudRainIcon className="h-4 w-4 text-purple-400" />;
    } else {
      return <SunIcon className="h-4 w-4 text-yellow-400" />;
    }
  };
  return <div className="w-full max-w-4xl mx-auto pb-20">
      <Toaster position="top-right" />
      {/* Debug info - À supprimer en production */}
      {process.env.NODE_ENV === 'development' && <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
          <strong>Debug Info:</strong>
          <br />
          Active Tab: {activeTab}
          <br />
          Form Data: {JSON.stringify(formData)}
          <br />
          Is Adding: {isAdding ? 'Yes' : 'No'}
          <br />
          Is Editing: {isEditing || 'No'}
          <br />
          Financial Data: {financialData ? 'Loaded' : 'Empty'}
        </div>}
      {showAnimation && <RevealAnimation />}
      {/* Header */}
      <motion.div className="flex justify-center mb-8" initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <div className={`inline-block bg-gradient-to-r ${themeColors.primary} px-8 py-4 rounded-2xl shadow-lg`}>
          <h1 className="text-3xl font-bold">Cartographie Financière</h1>
        </div>
      </motion.div>

      {/* Question display */}
      <GlassCard className="p-6 mb-6" animate>
        <h2 className="text-xl font-bold mb-4">Votre question</h2>
        <p className="text-lg bg-black/20 p-4 rounded-lg">
          {userQuestion || 'Comment puis-je améliorer ma situation financière ?'}
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Contexte émotionnel</h3>
            <div className="flex items-center mb-2">
              <div className="mr-2 text-sm">Niveau de stress:</div>
              <div className="flex-1 bg-black/30 h-2 rounded-full">
                <div className={`h-2 rounded-full ${emotionalContext.mood <= 3 ? 'bg-green-500' : emotionalContext.mood <= 6 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                width: `${emotionalContext.mood * 10}%`
              }}></div>
              </div>
              <div className="ml-2 font-medium">{emotionalContext.mood}/10</div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {emotionalContext.tags.map((tag, index) => <span key={index} className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${themeColors.secondary} bg-opacity-30`}>
                  {tag}
                </span>)}
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Résumé financier</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Revenus:</span>
                <span className="font-medium text-green-400">
                  {totalIncome}€
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dépenses:</span>
                <span className="font-medium text-red-400">
                  {totalExpenses}€
                </span>
              </div>
              <div className="border-t border-white/10 my-1 pt-1"></div>
              <div className="flex justify-between">
                <span>Balance:</span>
                <span className={`font-medium ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {balance}€
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Financial data tabs */}
      <GlassCard className="p-6 mb-6" animate>
        <div className="flex border-b border-white/10 mb-6 overflow-x-auto scrollbar-thin">
          <button className={`pb-3 px-4 ${activeTab === 'income' ? `border-b-2 border-green-500 text-green-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('income')}>
            <div className="flex items-center whitespace-nowrap">
              <WalletIcon className="mr-1.5 h-4 w-4" />
              Revenus ({safeFinancialData.incomes.length})
            </div>
          </button>
          <button className={`pb-3 px-4 ${activeTab === 'expense' ? `border-b-2 border-red-500 text-red-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('expense')}>
            <div className="flex items-center whitespace-nowrap">
              <CreditCardIcon className="mr-1.5 h-4 w-4" />
              Dépenses ({safeFinancialData.expenses.length})
            </div>
          </button>
          <button className={`pb-3 px-4 ${activeTab === 'saving' ? `border-b-2 border-blue-500 text-blue-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('saving')}>
            <div className="flex items-center whitespace-nowrap">
              <PiggyBankIcon className="mr-1.5 h-4 w-4" />
              Épargne ({safeFinancialData.savings.length})
            </div>
          </button>
          <button className={`pb-3 px-4 ${activeTab === 'debt' ? `border-b-2 border-yellow-500 text-yellow-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('debt')}>
            <div className="flex items-center whitespace-nowrap">
              <CreditCardIcon className="mr-1.5 h-4 w-4" />
              Dettes ({safeFinancialData.debts.length})
            </div>
          </button>
        </div>

        {/* Summary and add button */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">
              {activeTab === 'income' ? 'Revenus' : activeTab === 'expense' ? 'Dépenses' : activeTab === 'saving' ? 'Épargne' : 'Dettes'}
            </h3>
            <p className={`text-sm ${themeColors.textSecondary}`}>
              {activeTab === 'income' ? 'Ajoutez vos sources de revenus' : activeTab === 'expense' ? 'Ajoutez vos dépenses régulières et ponctuelles' : activeTab === 'saving' ? "Ajoutez vos comptes d'épargne" : 'Ajoutez vos prêts et dettes'}
            </p>
          </div>
          {!isAdding && <button onClick={() => {
          console.log("🔘 Ouverture du formulaire d'ajout");
          resetForm();
          setIsAdding(true);
          setIsEditing(null);
        }} className={`bg-gradient-to-r ${activeTab === 'income' ? themeColors.success || 'from-green-500 to-green-600' : activeTab === 'expense' ? themeColors.danger || 'from-red-500 to-red-600' : activeTab === 'saving' ? themeColors.primary || 'from-blue-500 to-blue-600' : themeColors.warning || 'from-yellow-500 to-yellow-600'} text-white px-4 py-2 rounded-lg flex items-center`}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter
            </button>}
        </div>

        {/* Add/Edit form */}
        <AnimatePresence mode="wait">
          {isAdding && <motion.div key="form-animation" initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.2,
          ease: 'easeInOut'
        }} className="overflow-hidden">
              <div className="bg-black/20 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">
                    {isEditing ? 'Modifier' : 'Ajouter'} un élément
                  </h4>
                  <button onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
                resetForm();
              }} className="p-1 hover:bg-black/20 rounded-full">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Catégorie <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories[activeTab] && categories[activeTab].length > 0 ? categories[activeTab].map(category => <button key={category.id} type="button" onClick={() => handleCategorySelect(category.id)} className={`flex items-center p-2 rounded-lg text-sm ${formData.category === category.id ? `bg-gradient-to-r ${activeTab === 'income' ? themeColors.success || 'from-green-500 to-green-600' : activeTab === 'expense' ? themeColors.danger || 'from-red-500 to-red-600' : activeTab === 'saving' ? themeColors.primary || 'from-blue-500 to-blue-600' : themeColors.warning || 'from-yellow-500 to-yellow-600'} text-white` : 'bg-black/20 hover:bg-black/30'}`}>
                            <span className="mr-1.5">{category.icon}</span>
                            <span>{category.name}</span>
                          </button>) : <div className="col-span-3 text-center py-2 text-gray-400">
                          Aucune catégorie disponible
                        </div>}
                    </div>
                    {!formData.category && <p className="text-xs text-amber-400 mt-1">
                        Veuillez sélectionner une catégorie
                      </p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Montant <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input type="text" name="value" value={formData.value || ''} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 pr-8 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50" placeholder="0.00" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-400">€</span>
                      </div>
                    </div>
                    {!formData.value && <p className="text-xs text-amber-400 mt-1">
                        Veuillez entrer un montant
                      </p>}
                  </div>
                </div>
                {/* Additional form fields */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Description (optionnel)
                  </label>
                  <input type="text" name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50" placeholder="Description de l'élément" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Fréquence
                    </label>
                    <select name="frequency" value={formData.frequency || 'monthly'} onChange={handleInputChange} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                      {frequencies.map(freq => <option key={freq.id} value={freq.id}>
                          {freq.name}
                        </option>)}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="isRecurring" name="isRecurring" checked={Boolean(formData.isRecurring)} onChange={handleInputChange} className="h-4 w-4 bg-black/20 border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                    <label htmlFor="isRecurring" className="ml-2 text-sm">
                      Récurrent
                    </label>
                  </div>
                </div>
                {/* Form buttons with simplified onclick handlers */}
                <div className="flex justify-end">
                  <button type="button" onClick={() => {
                console.log('❌ Annulation du formulaire');
                setIsAdding(false);
                setIsEditing(null);
                resetForm();
              }} className="mr-2 px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 text-sm" disabled={isLoading}>
                    Annuler
                  </button>
                  <button type="button" onClick={isEditing ? handleUpdateItem : handleAddItem} disabled={isLoading} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${themeColors.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-sm flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isLoading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>}
                    <SaveIcon className="h-4 w-4 mr-2" />
                    {isEditing ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
        {/* Items list */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {getActiveItems().length > 0 ? getActiveItems().map(item => <div key={item.id} className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${activeTab === 'income' ? 'bg-green-500/20' : activeTab === 'expense' ? 'bg-red-500/20' : activeTab === 'saving' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="font-medium">
                      {getCategoryLabel(item.category)}
                    </div>
                    {item.description && <div className="text-sm text-gray-400">
                        {item.description}
                      </div>}
                    {item.frequency && <div className="text-xs text-gray-500">
                        {getFrequencyLabel(item.frequency)}
                        {item.isRecurring && ' • Récurrent'}
                      </div>}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`font-medium mr-4 ${activeTab === 'income' ? 'text-green-400' : activeTab === 'expense' ? 'text-red-400' : activeTab === 'saving' ? 'text-blue-400' : 'text-yellow-400'}`}>
                    {typeof item.value === 'number' ? item.value.toLocaleString('fr-FR') : parseFloat(item.value).toLocaleString('fr-FR')}
                    €
                  </div>
                  <div className="flex">
                    <button onClick={() => handleEditItem(item)} className="p-1.5 hover:bg-black/20 rounded-full mr-1">
                      <EditIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id!)} className="p-1.5 hover:bg-black/20 rounded-full">
                      <TrashIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>) : <div className="text-center py-8 text-gray-400">
              <div className={`p-3 rounded-full inline-block mb-2 ${activeTab === 'income' ? 'bg-green-500/20' : activeTab === 'expense' ? 'bg-red-500/20' : activeTab === 'saving' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
                {activeTab === 'income' ? <WalletIcon className="h-6 w-6" /> : activeTab === 'expense' ? <CreditCardIcon className="h-6 w-6" /> : activeTab === 'saving' ? <PiggyBankIcon className="h-6 w-6" /> : <CreditCardIcon className="h-6 w-6" />}
              </div>
              <p>Aucun élément ajouté</p>
              <p className="text-sm mt-1">
                Cliquez sur "Ajouter" pour commencer
              </p>
            </div>}
        </div>

        {/* Total */}
        {getActiveItems().length > 0 && <div className="mt-4 p-3 bg-black/20 rounded-lg flex justify-between items-center">
            <div className="font-medium">Total</div>
            <div className={`font-bold ${activeTab === 'income' ? 'text-green-400' : activeTab === 'expense' ? 'text-red-400' : activeTab === 'saving' ? 'text-blue-400' : 'text-yellow-400'}`}>
              {activeTab === 'income' && totalIncome.toLocaleString('fr-FR')}
              {activeTab === 'expense' && totalExpenses.toLocaleString('fr-FR')}
              {activeTab === 'saving' && totalSavings.toLocaleString('fr-FR')}
              {activeTab === 'debt' && totalDebt.toLocaleString('fr-FR')}€
            </div>
          </div>}
      </GlassCard>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button onClick={handleBack} className="btn btn-outline flex items-center justify-center">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Retour
        </button>
        <button onClick={handleContinue} disabled={isLoading} className={`btn btn-primary flex items-center justify-center ${isLoading ? 'opacity-70' : ''}`}>
          {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div> : <ArrowRightIcon className="mr-2 h-5 w-5" />}
          Continuer
        </button>
      </div>

      {/* Widget météo */}
      {weatherData && <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Météo financière</h3>
              <div className="flex items-center text-sm">
                {getWeatherIcon()}
                <span className="ml-1">{weatherData.temperature}°C</span>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              {weatherData.condition === 'Pluvieux' ? 'Les jours de pluie, les dépenses en ligne augmentent de 12% en moyenne.' : weatherData.condition === 'Ensoleillé' ? 'Journée ensoleillée : attention aux achats impulsifs en terrasse (+18%).' : 'Conditions actuelles favorables pour planifier vos finances.'}
            </p>
            <div className="mt-2 text-xs text-gray-400">
              Nos habitudes de dépenses sont influencées par la météo et notre
              humeur.
            </div>
          </div>
        </div>}
    </div>;
}