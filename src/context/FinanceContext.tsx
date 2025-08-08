import React, { createContext, useContext } from 'react';
import { useFinanceStore } from '../stores/financeStore';
import { FinancialData, FinancialInsight } from '../types/finance';
import { externalApiService } from '../services/ExternalAPIService';
interface FinanceContextType {
  userQuestion: string;
  setUserQuestion: (question: string) => void;
  financialData: FinancialData;
  setFinancialData: (data: FinancialData) => void;
  emotionalContext: EmotionalContext;
  setEmotionalContext: (context: EmotionalContext) => void;
  generateInsights: () => Promise<FinancialInsight[]>;
  runSimulation: (params: any) => Promise<any>;
  getFinancialHealth: () => Promise<any>;
  detectHiddenFees: () => Promise<any>;
  getRelatedNews: (query: string) => Promise<any>;
  getMarketData: (symbol?: string) => Promise<any>;
  getQuoteOfTheDay: () => Promise<any>;
  getFinancialAdvice: () => Promise<any>;
  calculateTotalIncome: () => number;
  calculateTotalExpenses: () => number;
  calculateNetWorth: () => number;
  getHistoricalData: () => Promise<any[]>;
  getPredictions: () => Promise<any>;
  getFinancialScore: () => Promise<number>;
  refreshData: () => Promise<void>;
}
interface EmotionalContext {
  mood: number;
  tags: string[];
  financialPersonality?: 'saver' | 'spender' | 'avoider' | 'planner' | 'risk-taker' | 'security-seeker';
}
const defaultEmotionalContext: EmotionalContext = {
  mood: 5,
  tags: []
};
const defaultFinancialData: FinancialData = {
  incomes: [],
  expenses: [],
  savings: [],
  debts: [],
  investments: [],
  assets: [],
  liabilities: []
};
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);
export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
export function FinanceProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const store = useFinanceStore();
  const generateInsights = async (): Promise<FinancialInsight[]> => {
    // Simuler un délai d'analyse
    await new Promise(resolve => setTimeout(resolve, 500));
    const storeData = store.financialData || defaultFinancialData;
    const insights: FinancialInsight[] = [];
    // Calculer les totaux
    const totalIncome = calculateTotalIncome();
    const totalExpenses = calculateTotalExpenses();
    const balance = totalIncome - totalExpenses;
    // Générer des insights basés sur les données
    if (balance < 0) {
      insights.push({
        id: '1',
        title: 'Balance négative détectée',
        description: 'Vos dépenses mensuelles dépassent vos revenus de ' + Math.abs(balance) + "€, ce qui peut rapidement mener à l'endettement.",
        impact: 'high',
        category: 'expense',
        action: 'Réduisez vos dépenses non essentielles ou cherchez des sources de revenus supplémentaires.',
        potentialSavings: Math.abs(balance)
      });
    }
    return insights;
  };
  const calculateTotalIncome = (): number => {
    const financialData = store.financialData || defaultFinancialData;
    return financialData.incomes?.reduce((sum, income) => sum + (typeof income.value === 'number' ? income.value : parseFloat(income.value) || 0), 0) || 0;
  };
  const calculateTotalExpenses = (): number => {
    const financialData = store.financialData || defaultFinancialData;
    return financialData.expenses?.reduce((sum, expense) => sum + (typeof expense.value === 'number' ? expense.value : parseFloat(expense.value) || 0), 0) || 0;
  };
  const calculateNetWorth = (): number => {
    const financialData = store.financialData || defaultFinancialData;
    // Calculer les actifs
    const totalAssets = (financialData.assets?.reduce((sum, asset) => sum + (typeof asset.value === 'number' ? asset.value : parseFloat(asset.value) || 0), 0) || 0) + (financialData.savings?.reduce((sum, saving) => sum + (typeof saving.value === 'number' ? saving.value : parseFloat(saving.value) || 0), 0) || 0) + (financialData.investments?.reduce((sum, investment) => sum + (typeof investment.value === 'number' ? investment.value : parseFloat(investment.value) || 0), 0) || 0);
    // Calculer les passifs
    const totalLiabilities = (financialData.liabilities?.reduce((sum, liability) => sum + (typeof liability.value === 'number' ? liability.value : parseFloat(liability.value) || 0), 0) || 0) + (financialData.debts?.reduce((sum, debt) => sum + (typeof debt.value === 'number' ? debt.value : parseFloat(debt.value) || 0), 0) || 0);
    return totalAssets - totalLiabilities;
  };
  return <FinanceContext.Provider value={{
    userQuestion: store.userQuestion,
    setUserQuestion: store.setUserQuestion,
    financialData: store.financialData || defaultFinancialData,
    setFinancialData: store.setFinancialData,
    emotionalContext: store.emotionalContext,
    setEmotionalContext: store.setEmotionalContext,
    generateInsights,
    runSimulation: async () => ({}),
    getFinancialHealth: async () => ({}),
    detectHiddenFees: async () => ({}),
    getRelatedNews: async () => [],
    getMarketData: async () => ({}),
    getQuoteOfTheDay: async () => ({}),
    getFinancialAdvice: async () => ({}),
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateNetWorth,
    getHistoricalData: async () => [],
    getPredictions: async () => ({}),
    getFinancialScore: async () => 0,
    refreshData: async () => {}
  }}>
      {children}
    </FinanceContext.Provider>;
}