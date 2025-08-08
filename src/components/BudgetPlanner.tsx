import React, { useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { PiggyBankIcon, TrendingUpIcon, TrendingDownIcon, PlusIcon, MinusIcon, SaveIcon, BarChart3Icon, CalendarIcon, AlertCircleIcon, CheckIcon, XIcon, RefreshCwIcon, CreditCardIcon, HomeIcon, ShoppingBagIcon, CarIcon, UtensilsIcon, BriefcaseIcon, HeartIcon, SmileIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// Types pour le budget
interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  planned: number;
  actual: number;
  color: string;
}
interface BudgetPeriod {
  id: string;
  name: string;
}
export function BudgetPlanner() {
  const navigate = useNavigate();
  const {
    theme,
    themeColors
  } = useTheme();
  const {
    financialData,
    calculateTotalIncome,
    calculateTotalExpenses
  } = useFinance();
  // État du budget
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newPlannedAmount, setNewPlannedAmount] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  // Périodes de budget disponibles
  const budgetPeriods: BudgetPeriod[] = [{
    id: 'previous',
    name: 'Mois précédent'
  }, {
    id: 'current',
    name: 'Mois en cours'
  }, {
    id: 'next',
    name: 'Mois prochain'
  }];
  // Données financières calculées
  const totalIncome = calculateTotalIncome() || 0;
  const totalExpenses = calculateTotalExpenses() || 0;
  const balance = totalIncome - totalExpenses;
  // Initialiser les catégories de budget
  useEffect(() => {
    // Générer des catégories de budget basées sur les dépenses existantes
    const expensesData = financialData?.expenses || [];
    const expensesByCategory: Record<string, number> = {};
    // Regrouper les dépenses par catégorie
    expensesData.forEach(expense => {
      const category = expense.category;
      const value = typeof expense.value === 'number' ? expense.value : parseFloat(expense.value) || 0;
      if (expensesByCategory[category]) {
        expensesByCategory[category] += value;
      } else {
        expensesByCategory[category] = value;
      }
    });
    // Créer les catégories de budget
    const categories: BudgetCategory[] = [{
      id: 'housing',
      name: 'Logement',
      icon: <HomeIcon className="h-4 w-4" />,
      planned: 800,
      actual: expensesByCategory['housing'] || 0,
      color: '#8884d8'
    }, {
      id: 'food',
      name: 'Alimentation',
      icon: <UtensilsIcon className="h-4 w-4" />,
      planned: 400,
      actual: expensesByCategory['food'] || 0,
      color: '#82ca9d'
    }, {
      id: 'transport',
      name: 'Transport',
      icon: <CarIcon className="h-4 w-4" />,
      planned: 200,
      actual: expensesByCategory['transport'] || 0,
      color: '#ffc658'
    }, {
      id: 'shopping',
      name: 'Shopping',
      icon: <ShoppingBagIcon className="h-4 w-4" />,
      planned: 150,
      actual: expensesByCategory['shopping'] || 0,
      color: '#ff8042'
    }, {
      id: 'health',
      name: 'Santé',
      icon: <HeartIcon className="h-4 w-4" />,
      planned: 100,
      actual: expensesByCategory['health'] || 0,
      color: '#0088fe'
    }, {
      id: 'leisure',
      name: 'Loisirs',
      icon: <SmileIcon className="h-4 w-4" />,
      planned: 200,
      actual: expensesByCategory['leisure'] || 0,
      color: '#ff6b81'
    }];
    setBudgetCategories(categories);
  }, [financialData]);
  // Calculer les totaux du budget
  const totalPlanned = budgetCategories.reduce((sum, category) => sum + category.planned, 0);
  const totalActual = budgetCategories.reduce((sum, category) => sum + category.actual, 0);
  const remainingBudget = totalPlanned - totalActual;
  // Préparer les données pour les graphiques
  const barChartData = budgetCategories.map(category => ({
    name: category.name,
    prévu: category.planned,
    réel: category.actual
  }));
  const pieChartData = budgetCategories.map(category => ({
    name: category.name,
    value: category.actual
  }));
  // Gérer l'édition d'une catégorie
  const handleEditCategory = (categoryId: string) => {
    const category = budgetCategories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setNewPlannedAmount(category.planned.toString());
      setIsEditing(true);
    }
  };
  // Sauvegarder les modifications
  const handleSaveCategory = () => {
    if (editingCategory && newPlannedAmount) {
      const amount = parseFloat(newPlannedAmount);
      if (isNaN(amount) || amount < 0) {
        toast.error('Veuillez entrer un montant valide');
        return;
      }
      setBudgetCategories(prev => prev.map(category => category.id === editingCategory ? {
        ...category,
        planned: amount
      } : category));
      setIsEditing(false);
      setEditingCategory(null);
      setNewPlannedAmount('');
      toast.success('Budget mis à jour');
    }
  };
  // Annuler l'édition
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setNewPlannedAmount('');
  };
  // Sauvegarder tout le budget
  const handleSaveBudget = async () => {
    setIsSaving(true);
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Budget enregistré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du budget');
      console.error('Erreur lors de la sauvegarde du budget:', error);
    } finally {
      setIsSaving(false);
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
        <h1 className="text-3xl font-bold">Planificateur de budget</h1>
        <p className={`${themeColors?.textSecondary || 'text-gray-400'}`}>
          Planifiez et suivez votre budget mensuel
        </p>
      </motion.div>
      {/* Sélecteur de période */}
      <div className="bg-black/20 p-1 rounded-full flex mb-6">
        {budgetPeriods.map(period => <button key={period.id} onClick={() => setSelectedPeriod(period.id)} className={`flex-1 py-2 rounded-full text-sm ${selectedPeriod === period.id ? `bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} text-white` : 'hover:bg-black/20'}`}>
            {period.name}
          </button>)}
      </div>
      {/* Résumé du budget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Budget prévu
            </h3>
            <div className="p-2 rounded-full bg-blue-500/20">
              <PiggyBankIcon className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {totalPlanned.toLocaleString('fr-FR')}€
          </div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            {budgetPeriods.find(p => p.id === selectedPeriod)?.name}
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Dépenses réelles
            </h3>
            <div className="p-2 rounded-full bg-red-500/20">
              <TrendingDownIcon className="h-4 w-4 text-red-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {totalActual.toLocaleString('fr-FR')}€
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full mt-2">
            <div className={`h-2 rounded-full ${totalActual <= totalPlanned ? 'bg-green-500' : 'bg-red-500'}`} style={{
            width: `${Math.min(100, totalActual / totalPlanned * 100)}%`
          }}></div>
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate hover>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm ${themeColors?.textSecondary || 'text-gray-400'}`}>
              Restant
            </h3>
            <div className={`p-2 rounded-full ${remainingBudget >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {remainingBudget >= 0 ? <PlusIcon className="h-4 w-4 text-green-400" /> : <MinusIcon className="h-4 w-4 text-red-400" />}
            </div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {Math.abs(remainingBudget).toLocaleString('fr-FR')}€
          </div>
          <div className={`text-xs ${themeColors?.textSecondary || 'text-gray-400'}`}>
            {remainingBudget >= 0 ? 'Disponible' : 'Dépassement'}
          </div>
        </GlassCard>
      </div>
      {/* Graphiques du budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GlassCard className="p-4" animate>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <BarChart3Icon className="h-5 w-5 mr-2 text-blue-400" />
              Budget par catégorie
            </h3>
            <div className="flex items-center text-xs bg-black/20 px-2 py-1 rounded-full">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {budgetPeriods.find(p => p.id === selectedPeriod)?.name}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip formatter={value => [`${value.toLocaleString('fr-FR')}€`, '']} contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }} />
                <Legend />
                <Bar dataKey="prévu" fill="#8884d8" />
                <Bar dataKey="réel" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard className="p-4" animate>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-400" />
              Répartition des dépenses
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={budgetCategories[index % budgetCategories.length].color} />)}
                </Pie>
                <Tooltip formatter={value => [`${value.toLocaleString('fr-FR')}€`, 'Montant']} contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      {/* Liste des catégories de budget */}
      <GlassCard className="p-4 mb-6" animate>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center">
            <PiggyBankIcon className="h-5 w-5 mr-2 text-green-400" />
            Catégories de budget
          </h3>
          <button onClick={handleSaveBudget} disabled={isSaving} className={`py-1.5 px-3 rounded bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 text-sm flex items-center ${isSaving ? 'opacity-70' : ''}`}>
            {isSaving ? <RefreshCwIcon className="h-4 w-4 mr-1.5 animate-spin" /> : <SaveIcon className="h-4 w-4 mr-1.5" />}
            Enregistrer
          </button>
        </div>
        <div className="space-y-3">
          {budgetCategories.map(category => <div key={category.id} className="bg-black/20 p-3 rounded-lg">
              {editingCategory === category.id ? <div className="flex items-center">
                  <div className="p-2 rounded-full mr-3" style={{
              backgroundColor: `${category.color}30`
            }}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    <div className="mt-2 flex items-center">
                      <input type="number" value={newPlannedAmount} onChange={e => setNewPlannedAmount(e.target.value)} className="flex-1 bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-white" placeholder="Montant prévu" />
                      <button onClick={handleSaveCategory} className="ml-2 p-1.5 bg-green-500/20 text-green-400 rounded-lg">
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button onClick={handleCancelEdit} className="ml-2 p-1.5 bg-red-500/20 text-red-400 rounded-lg">
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div> : <div className="flex items-center">
                  <div className="p-2 rounded-full mr-3" style={{
              backgroundColor: `${category.color}30`
            }}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {category.actual.toLocaleString('fr-FR')}€ /{' '}
                      {category.planned.toLocaleString('fr-FR')}€
                    </div>
                    <div className="w-full bg-black/30 h-1.5 rounded-full mt-1.5">
                      <div className={`h-1.5 rounded-full`} style={{
                  width: `${Math.min(100, category.actual / category.planned * 100)}%`,
                  backgroundColor: category.color
                }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`font-medium ${category.actual <= category.planned ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.abs(category.planned - category.actual).toLocaleString('fr-FR')}
                      €
                    </div>
                    <div className="text-xs text-gray-400">
                      {category.actual <= category.planned ? 'Restant' : 'Dépassé'}
                    </div>
                    <button onClick={() => handleEditCategory(category.id)} className="mt-2 py-1 px-2 bg-black/30 hover:bg-black/40 rounded text-xs">
                      Modifier
                    </button>
                  </div>
                </div>}
            </div>)}
        </div>
      </GlassCard>
      {/* Conseils de budget */}
      <GlassCard className="p-4" animate>
        <h3 className="font-medium flex items-center mb-4">
          <AlertCircleIcon className="h-5 w-5 mr-2 text-yellow-400" />
          Conseils pour votre budget
        </h3>
        <div className="space-y-3">
          {remainingBudget < 0 && <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-1">
                Attention au dépassement de budget
              </h4>
              <p className="text-xs text-gray-300">
                Vous avez dépassé votre budget prévu de{' '}
                {Math.abs(remainingBudget).toLocaleString('fr-FR')}€. Essayez de
                réduire vos dépenses dans les catégories où vous avez dépassé le
                montant prévu.
              </p>
            </div>}
          {budgetCategories.some(c => c.actual > c.planned) && <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-1">Catégories dépassées</h4>
              <p className="text-xs text-gray-300 mb-2">
                Vous avez dépassé votre budget dans les catégories suivantes:
              </p>
              <div className="space-y-1">
                {budgetCategories.filter(c => c.actual > c.planned).map(category => <div key={category.id} className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full mr-2" style={{
                backgroundColor: category.color
              }}></div>
                      <div>
                        {category.name}: dépassement de{' '}
                        {(category.actual - category.planned).toLocaleString('fr-FR')}
                        €
                      </div>
                    </div>)}
              </div>
            </div>}
          {totalActual / totalIncome > 0.8 && <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-1">
                Ratio dépenses/revenus élevé
              </h4>
              <p className="text-xs text-gray-300">
                Vos dépenses représentent{' '}
                {(totalActual / totalIncome * 100).toFixed(0)}% de vos
                revenus. Il est recommandé de maintenir ce ratio en dessous de
                80% pour pouvoir épargner.
              </p>
            </div>}
          {remainingBudget >= 0 && <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-1">
                Bonne gestion budgétaire
              </h4>
              <p className="text-xs text-gray-300">
                Vous êtes en bonne voie pour respecter votre budget ce mois-ci.
                Continuez ainsi et pensez à épargner le montant restant à la fin
                du mois.
              </p>
            </div>}
        </div>
      </GlassCard>
    </div>;
}