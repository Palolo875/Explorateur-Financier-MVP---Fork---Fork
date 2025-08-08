import React, { useEffect, useState, Component } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { TargetIcon, PlusIcon, TrashIcon, EditIcon, CheckIcon, XIcon, TrendingUpIcon, CalendarIcon, HomeIcon, CarIcon, BriefcaseIcon, GraduationCapIcon, UmbrellaIcon, PlaneIcon, HeartIcon, LaptopIcon, ClockIcon, AlertCircleIcon, ChevronRightIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { format, addMonths, differenceInMonths, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
// Types pour les objectifs financiers
interface FinancialGoal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
  icon: string;
  createdAt: string;
  notes?: string;
}
export function GoalTracker() {
  const navigate = useNavigate();
  const {
    theme,
    themeColors
  } = useTheme();
  const {
    financialData,
    calculateNetWorth
  } = useFinance();
  // États
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Formulaire pour nouveau/édition objectif
  const [formData, setFormData] = useState({
    name: '',
    category: 'emergency',
    targetAmount: '',
    currentAmount: '',
    targetDate: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: ''
  });
  // Catégories d'objectifs disponibles
  const goalCategories = [{
    id: 'emergency',
    name: "Fonds d'urgence",
    icon: 'UmbrellaIcon',
    color: '#8884d8'
  }, {
    id: 'home',
    name: 'Immobilier',
    icon: 'HomeIcon',
    color: '#82ca9d'
  }, {
    id: 'car',
    name: 'Véhicule',
    icon: 'CarIcon',
    color: '#ffc658'
  }, {
    id: 'travel',
    name: 'Voyage',
    icon: 'PlaneIcon',
    color: '#ff8042'
  }, {
    id: 'education',
    name: 'Éducation',
    icon: 'GraduationCapIcon',
    color: '#0088fe'
  }, {
    id: 'retirement',
    name: 'Retraite',
    icon: 'BriefcaseIcon',
    color: '#ff6b81'
  }, {
    id: 'tech',
    name: 'Technologie',
    icon: 'LaptopIcon',
    color: '#00C49F'
  }, {
    id: 'health',
    name: 'Santé',
    icon: 'HeartIcon',
    color: '#FFBB28'
  }];
  // Initialiser des objectifs par défaut
  useEffect(() => {
    const defaultGoals: FinancialGoal[] = [{
      id: '1',
      name: "Fonds d'urgence",
      category: 'emergency',
      targetAmount: 5000,
      currentAmount: 1750,
      targetDate: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
      priority: 'high',
      color: '#8884d8',
      icon: 'UmbrellaIcon',
      createdAt: new Date().toISOString(),
      notes: 'Objectif: 3 mois de dépenses courantes'
    }, {
      id: '2',
      name: "Vacances d'été",
      category: 'travel',
      targetAmount: 2000,
      currentAmount: 1700,
      targetDate: format(addMonths(new Date(), 4), 'yyyy-MM-dd'),
      priority: 'medium',
      color: '#ff8042',
      icon: 'PlaneIcon',
      createdAt: new Date().toISOString()
    }, {
      id: '3',
      name: 'Acompte immobilier',
      category: 'home',
      targetAmount: 50000,
      currentAmount: 6000,
      targetDate: format(addMonths(new Date(), 36), 'yyyy-MM-dd'),
      priority: 'high',
      color: '#82ca9d',
      icon: 'HomeIcon',
      createdAt: new Date().toISOString(),
      notes: 'Pour un appartement de 2-3 pièces'
    }];
    setGoals(defaultGoals);
  }, []);
  // Filtrer les objectifs par catégorie
  const filteredGoals = selectedCategory === 'all' ? goals : goals.filter(goal => goal.category === selectedCategory);
  // Trier les objectifs par priorité et progression
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    // D'abord par priorité
    const priorityOrder = {
      high: 0,
      medium: 1,
      low: 2
    };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Ensuite par progression (les plus proches d'être atteints en premier)
    const progressA = a.currentAmount / a.targetAmount;
    const progressB = b.currentAmount / b.targetAmount;
    return progressB - progressA;
  });
  // Calculer les statistiques globales
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? totalCurrentAmount / totalTargetAmount * 100 : 0;
  const netWorth = calculateNetWorth() || 0;
  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount || '0');
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast.error('Le montant cible doit être un nombre positif');
      return;
    }
    if (isNaN(currentAmount) || currentAmount < 0) {
      toast.error('Le montant actuel doit être un nombre positif ou zéro');
      return;
    }
    const selectedCategoryObj = goalCategories.find(cat => cat.id === formData.category);
    if (editingGoalId) {
      // Mise à jour d'un objectif existant
      setGoals(prev => prev.map(goal => goal.id === editingGoalId ? {
        ...goal,
        name: formData.name,
        category: formData.category,
        targetAmount,
        currentAmount,
        targetDate: formData.targetDate,
        priority: formData.priority,
        notes: formData.notes,
        color: selectedCategoryObj?.color || '#8884d8',
        icon: selectedCategoryObj?.icon || 'TargetIcon'
      } : goal));
      toast.success('Objectif mis à jour avec succès');
    } else {
      // Création d'un nouvel objectif
      const newGoal: FinancialGoal = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        targetAmount,
        currentAmount,
        targetDate: formData.targetDate,
        priority: formData.priority,
        color: selectedCategoryObj?.color || '#8884d8',
        icon: selectedCategoryObj?.icon || 'TargetIcon',
        createdAt: new Date().toISOString(),
        notes: formData.notes
      };
      setGoals(prev => [...prev, newGoal]);
      toast.success('Nouvel objectif ajouté');
    }
    // Réinitialiser le formulaire
    resetForm();
  };
  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'emergency',
      targetAmount: '',
      currentAmount: '',
      targetDate: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
      priority: 'medium',
      notes: ''
    });
    setIsAddingGoal(false);
    setEditingGoalId(null);
  };
  // Éditer un objectif
  const handleEditGoal = (goal: FinancialGoal) => {
    setFormData({
      name: goal.name,
      category: goal.category,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
      priority: goal.priority,
      notes: goal.notes || ''
    });
    setEditingGoalId(goal.id);
    setIsAddingGoal(true);
  };
  // Supprimer un objectif
  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Objectif supprimé');
    }
  };
  // Calculer le temps restant et le montant mensuel requis
  const calculateTimeLeft = (targetDate: string) => {
    const now = new Date();
    const target = parseISO(targetDate);
    const months = differenceInMonths(target, now);
    if (months < 0) return 'Dépassé';
    if (months === 0) return 'Ce mois-ci';
    return `${months} mois`;
  };
  const calculateMonthlyAmount = (goal: FinancialGoal) => {
    const now = new Date();
    const target = parseISO(goal.targetDate);
    const months = Math.max(1, differenceInMonths(target, now));
    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return 0;
    return remaining / months;
  };
  // Fonction pour obtenir l'icône appropriée
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'UmbrellaIcon':
        return <UmbrellaIcon className="h-5 w-5" />;
      case 'HomeIcon':
        return <HomeIcon className="h-5 w-5" />;
      case 'CarIcon':
        return <CarIcon className="h-5 w-5" />;
      case 'PlaneIcon':
        return <PlaneIcon className="h-5 w-5" />;
      case 'GraduationCapIcon':
        return <GraduationCapIcon className="h-5 w-5" />;
      case 'BriefcaseIcon':
        return <BriefcaseIcon className="h-5 w-5" />;
      case 'LaptopIcon':
        return <LaptopIcon className="h-5 w-5" />;
      case 'HeartIcon':
        return <HeartIcon className="h-5 w-5" />;
      default:
        return <TargetIcon className="h-5 w-5" />;
    }
  };
  return <div className="w-full max-w-6xl mx-auto pb-20">
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
        <h1 className="text-3xl font-bold">Suivi des objectifs</h1>
        <p className={`${themeColors?.textSecondary || 'text-gray-400'}`}>
          Définissez et suivez vos objectifs financiers
        </p>
      </motion.div>
      {/* Résumé des objectifs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Progression globale
            </h3>
            <div className="p-2 rounded-full bg-blue-500/20">
              <TrendingUpIcon className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {overallProgress.toFixed(1)}%
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full">
            <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{
            width: `${Math.min(100, overallProgress)}%`
          }}></div>
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Montant épargné
            </h3>
            <div className="p-2 rounded-full bg-green-500/20">
              <TargetIcon className="h-4 w-4 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {totalCurrentAmount.toLocaleString('fr-FR')}€
          </div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            sur {totalTargetAmount.toLocaleString('fr-FR')}€
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Objectifs actifs
            </h3>
            <div className="p-2 rounded-full bg-indigo-500/20">
              <CalendarIcon className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{goals.length}</div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            {goals.filter(g => g.currentAmount >= g.targetAmount).length}{' '}
            terminés
          </div>
        </GlassCard>
      </div>
      {/* Filtres et bouton d'ajout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex overflow-x-auto scrollbar-thin pb-2 gap-2">
          <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${selectedCategory === 'all' ? `bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} text-white` : 'bg-black/20 hover:bg-black/30'}`}>
            Tous les objectifs
          </button>
          {goalCategories.map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center ${selectedCategory === category.id ? `bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} text-white` : 'bg-black/20 hover:bg-black/30'}`}>
              {getIconComponent(category.icon)}
              <span className="ml-1.5">{category.name}</span>
            </button>)}
        </div>
        <button onClick={() => {
        resetForm();
        setIsAddingGoal(true);
      }} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-white flex items-center`}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvel objectif
        </button>
      </div>
      {/* Formulaire d'ajout/édition */}
      {isAddingGoal && <GlassCard className="p-6 mb-6" animate>
          <h3 className="text-xl font-medium mb-4">
            {editingGoalId ? "Modifier l'objectif" : 'Nouvel objectif'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom de l'objectif <span className="text-red-500">*</span>
                </label>
                <input type="text" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white" placeholder="Ex: Fonds d'urgence" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select value={formData.category} onChange={e => setFormData({
              ...formData,
              category: e.target.value
            })} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white" required>
                  {goalCategories.map(category => <option key={category.id} value={category.id}>
                      {category.name}
                    </option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Montant cible (€) <span className="text-red-500">*</span>
                </label>
                <input type="number" value={formData.targetAmount} onChange={e => setFormData({
              ...formData,
              targetAmount: e.target.value
            })} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white" placeholder="Ex: 5000" min="0" step="100" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Montant actuel (€)
                </label>
                <input type="number" value={formData.currentAmount} onChange={e => setFormData({
              ...formData,
              currentAmount: e.target.value
            })} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white" placeholder="Ex: 1000" min="0" step="100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date cible <span className="text-red-500">*</span>
                </label>
                <input type="date" value={formData.targetDate} onChange={e => setFormData({
              ...formData,
              targetDate: e.target.value
            })} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white" required />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Priorité</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="priority" value="low" checked={formData.priority === 'low'} onChange={() => setFormData({
                ...formData,
                priority: 'low'
              })} className="mr-2" />
                  Faible
                </label>
                <label className="flex items-center">
                  <input type="radio" name="priority" value="medium" checked={formData.priority === 'medium'} onChange={() => setFormData({
                ...formData,
                priority: 'medium'
              })} className="mr-2" />
                  Moyenne
                </label>
                <label className="flex items-center">
                  <input type="radio" name="priority" value="high" checked={formData.priority === 'high'} onChange={() => setFormData({
                ...formData,
                priority: 'high'
              })} className="mr-2" />
                  Élevée
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Notes (optionnel)
              </label>
              <textarea value={formData.notes} onChange={e => setFormData({
            ...formData,
            notes: e.target.value
          })} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white" rows={3} placeholder="Ajoutez des détails sur cet objectif..." />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg">
                Annuler
              </button>
              <button type="submit" className={`px-4 py-2 rounded-lg bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-white`}>
                {editingGoalId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </GlassCard>}
      {/* Liste des objectifs */}
      <div className="space-y-4">
        {sortedGoals.length > 0 ? sortedGoals.map(goal => {
        const progress = goal.currentAmount / goal.targetAmount * 100;
        const timeLeft = calculateTimeLeft(goal.targetDate);
        const monthlyAmount = calculateMonthlyAmount(goal);
        return <GlassCard key={goal.id} className="p-4" animate hover>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full mr-2" style={{
                    backgroundColor: `${goal.color}30`
                  }}>
                          {getIconComponent(goal.icon)}
                        </div>
                        <h3 className="font-medium">{goal.name}</h3>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${goal.priority === 'high' ? 'bg-red-500/20 text-red-400' : goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {goal.priority === 'high' ? 'Priorité élevée' : goal.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{progress.toFixed(1)}% complété</span>
                        <span>
                          {goal.currentAmount.toLocaleString('fr-FR')}€ /{' '}
                          {goal.targetAmount.toLocaleString('fr-FR')}€
                        </span>
                      </div>
                      <div className="w-full bg-black/20 h-2 rounded-full">
                        <div className="h-2 rounded-full" style={{
                    width: `${Math.min(100, progress)}%`,
                    backgroundColor: goal.color
                  }}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div className="bg-black/20 p-2 rounded-lg flex flex-col items-center">
                        <span className="text-xs text-gray-400">Catégorie</span>
                        <span>
                          {goalCategories.find(c => c.id === goal.category)?.name || 'Autre'}
                        </span>
                      </div>
                      <div className="bg-black/20 p-2 rounded-lg flex flex-col items-center">
                        <span className="text-xs text-gray-400">
                          Temps restant
                        </span>
                        <span>{timeLeft}</span>
                      </div>
                      <div className="bg-black/20 p-2 rounded-lg flex flex-col items-center col-span-2 md:col-span-1">
                        <span className="text-xs text-gray-400">
                          Épargne mensuelle
                        </span>
                        <span>{monthlyAmount.toFixed(0)}€ / mois</span>
                      </div>
                    </div>
                    {goal.notes && <div className="mt-3 bg-black/10 p-2 rounded-lg text-sm text-gray-300">
                        {goal.notes}
                      </div>}
                  </div>
                  <div className="flex md:flex-col justify-between md:justify-start gap-2">
                    <button onClick={() => handleEditGoal(goal)} className="p-2 bg-black/20 hover:bg-black/30 rounded-lg">
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="p-2 bg-black/20 hover:bg-black/30 rounded-lg">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </GlassCard>;
      }) : <GlassCard className="p-8 text-center" animate>
            <TargetIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-medium mb-2">Aucun objectif trouvé</h3>
            <p className="text-gray-400 mb-4">
              {selectedCategory === 'all' ? "Vous n'avez pas encore défini d'objectifs financiers." : 'Aucun objectif dans cette catégorie.'}
            </p>
            <button onClick={() => {
          resetForm();
          setIsAddingGoal(true);
        }} className={`px-4 py-2 rounded-lg bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-white`}>
              Créer un objectif
            </button>
          </GlassCard>}
      </div>
      {/* Conseils pour atteindre les objectifs */}
      {goals.length > 0 && <GlassCard className="p-4 mt-6" animate>
          <h3 className="font-medium flex items-center mb-4">
            <AlertCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
            Conseils pour atteindre vos objectifs
          </h3>
          <div className="space-y-3">
            {netWorth > 0 && <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">
                  Allocation recommandée
                </h4>
                <p className="text-xs text-gray-300">
                  Avec votre valeur nette actuelle de{' '}
                  {netWorth.toLocaleString('fr-FR')}€, vous pourriez allouer
                  jusqu'à {(netWorth * 0.1).toLocaleString('fr-FR')}€ à vos
                  objectifs prioritaires.
                </p>
              </div>}
            {goals.some(g => calculateMonthlyAmount(g) > 0) && <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">
                  Automatisez votre épargne
                </h4>
                <p className="text-xs text-gray-300">
                  Mettez en place des virements automatiques mensuels pour vos
                  objectifs. Par exemple:
                </p>
                <ul className="mt-2 space-y-1">
                  {goals.filter(g => calculateMonthlyAmount(g) > 0).slice(0, 3).map(goal => <li key={goal.id} className="text-xs flex items-center">
                        <ChevronRightIcon className="h-3 w-3 mr-1" />
                        {goal.name}: {calculateMonthlyAmount(goal).toFixed(0)}
                        €/mois
                      </li>)}
                </ul>
              </div>}
            {goals.some(g => g.priority === 'high' && g.currentAmount < g.targetAmount) && <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1">
                  Priorisez vos objectifs importants
                </h4>
                <p className="text-xs text-gray-300">
                  Concentrez-vous d'abord sur vos objectifs à haute priorité
                  avant d'allouer des fonds aux objectifs moins urgents.
                </p>
              </div>}
          </div>
        </GlassCard>}
    </div>;
}