import { FinancialData, EmotionalContext, FinancialInsight, SimulationParams, SimulationResult } from '../types/finance';
import dayjs from 'dayjs';
// Generate personalized financial insights based on user data
export function calculateFinancialInsights(financialData: FinancialData, emotionalContext: EmotionalContext, totalIncome: number, totalExpenses: number): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  // Calculate savings rate
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? balance / totalIncome * 100 : 0;
  // Insight based on savings rate
  if (savingsRate < 0) {
    insights.push({
      id: 'negative-savings',
      title: 'Solde négatif',
      description: `Vous dépensez ${Math.abs(savingsRate).toFixed(1)}% de plus que vos revenus. Cela peut entraîner un endettement progressif.`,
      impact: 'high',
      category: 'expense',
      action: 'Identifiez les dépenses non essentielles que vous pourriez réduire.',
      potentialSavings: Math.abs(balance)
    });
  } else if (savingsRate < 10) {
    insights.push({
      id: 'low-savings',
      title: "Taux d'épargne faible",
      description: `Votre taux d'épargne de ${savingsRate.toFixed(1)}% est inférieur à la recommandation de 20%.`,
      impact: 'medium',
      category: 'savings',
      action: "Essayez d'augmenter progressivement votre taux d'épargne de 1% par mois.",
      potentialSavings: totalIncome * 0.1
    });
  } else if (savingsRate >= 20) {
    insights.push({
      id: 'good-savings',
      title: "Excellent taux d'épargne",
      description: `Votre taux d'épargne de ${savingsRate.toFixed(1)}% est excellent! Vous êtes sur la bonne voie.`,
      impact: 'low',
      category: 'savings',
      action: "Envisagez d'investir une partie de votre épargne pour la faire fructifier."
    });
  }
  // Insights based on expense categories
  const expenseCategories: Record<string, number> = {};
  financialData.expenses.forEach(expense => {
    const value = typeof expense.value === 'string' ? parseFloat(expense.value) || 0 : expense.value;
    expenseCategories[expense.category] = (expenseCategories[expense.category] || 0) + value;
  });
  // Check for high housing costs
  const housingExpenses = Object.entries(expenseCategories).filter(([category]) => category.toLowerCase().includes('loyer') || category.toLowerCase().includes('hypothèque') || category.toLowerCase().includes('logement')).reduce((sum, [, value]) => sum + value, 0);
  if (housingExpenses > totalIncome * 0.33) {
    insights.push({
      id: 'high-housing',
      title: 'Coûts de logement élevés',
      description: `Vos dépenses de logement représentent ${(housingExpenses / totalIncome * 100).toFixed(1)}% de vos revenus, dépassant la recommandation de 33%.`,
      impact: 'high',
      category: 'expense',
      action: 'Envisagez de renégocier votre loyer/prêt ou de déménager vers un logement plus abordable.',
      potentialSavings: housingExpenses - totalIncome * 0.33
    });
  }
  // Check for high debt payments
  const debtPayments = (financialData.debts || []).reduce((sum, debt) => sum + (typeof debt.value === 'string' ? parseFloat(debt.value) || 0 : debt.value), 0);
  if (debtPayments > totalIncome * 0.36) {
    insights.push({
      id: 'high-debt',
      title: "Ratio d'endettement élevé",
      description: `Vos paiements de dettes représentent ${(debtPayments / totalIncome * 100).toFixed(1)}% de vos revenus, dépassant la recommandation de 36%.`,
      impact: 'high',
      category: 'debt',
      action: "Priorisez le remboursement des dettes à taux d'intérêt élevé.",
      potentialSavings: debtPayments - totalIncome * 0.36
    });
  }
  // Check for emotional spending based on mood
  if (emotionalContext.mood > 7) {
    insights.push({
      id: 'emotional-spending',
      title: 'Dépenses émotionnelles',
      description: 'Votre niveau de stress financier élevé peut mener à des décisions financières impulsives.',
      impact: 'medium',
      category: 'expense',
      action: 'Essayez la règle des 24h avant tout achat non essentiel pour réduire les achats impulsifs.',
      potentialSavings: totalExpenses * 0.05
    });
  }
  // Check for income diversification
  if (financialData.incomes.length === 1) {
    insights.push({
      id: 'single-income',
      title: 'Source de revenu unique',
      description: "Vous dépendez d'une seule source de revenu, ce qui peut représenter un risque en cas de perte d'emploi.",
      impact: 'medium',
      category: 'income',
      action: 'Envisagez de développer des sources de revenus complémentaires.'
    });
  }
  // Check for emergency fund
  const emergencyFund = (financialData.savings || []).find(item => item.category.toLowerCase().includes('urgence'));
  if (!emergencyFund) {
    insights.push({
      id: 'no-emergency-fund',
      title: "Absence de fonds d'urgence",
      description: "Vous ne semblez pas avoir de fonds d'urgence, ce qui peut vous rendre vulnérable aux imprévus.",
      impact: 'high',
      category: 'savings',
      action: "Commencez à constituer un fonds d'urgence couvrant 3-6 mois de dépenses."
    });
  } else {
    const emergencyValue = typeof emergencyFund.value === 'string' ? parseFloat(emergencyFund.value) : emergencyFund.value;
    if (emergencyValue < totalExpenses * 3) {
      insights.push({
        id: 'low-emergency-fund',
        title: "Fonds d'urgence insuffisant",
        description: `Votre fonds d'urgence couvre environ ${(emergencyValue / totalExpenses).toFixed(1)} mois de dépenses, en dessous de la recommandation de 3-6 mois.`,
        impact: 'medium',
        category: 'savings',
        action: "Augmentez progressivement votre fonds d'urgence."
      });
    }
  }
  return insights;
}
// Run financial simulation based on user data and parameters
export function runFinancialSimulation(financialData: FinancialData, params: SimulationParams): SimulationResult {
  const years = Array.from({
    length: params.years
  }, (_, i) => i + 1);
  const income = financialData.incomes.reduce((sum, item) => sum + (typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value), 0) * 12; // Annual income
  const expenses = financialData.expenses.reduce((sum, item) => sum + (typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value), 0) * 12; // Annual expenses
  const initialSavings = (financialData.savings || []).reduce((sum, item) => sum + (typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value), 0);
  const initialInvestments = (financialData.investments || []).reduce((sum, item) => sum + (typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value), 0);
  const initialDebts = (financialData.debts || []).reduce((sum, item) => sum + (typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value), 0);
  let currentIncome = income;
  let currentExpenses = expenses;
  let currentSavings = initialSavings;
  let currentInvestments = initialInvestments;
  let currentDebts = initialDebts;
  const result: SimulationResult = {
    years: [],
    netWorth: [],
    savings: [],
    income: [],
    expenses: []
  };
  for (let year = 1; year <= params.years; year++) {
    // Apply growth rates
    currentIncome *= 1 + params.incomeGrowth / 100;
    currentExpenses *= 1 + (params.inflationRate - params.expenseReduction) / 100;
    // Calculate yearly savings
    const yearlySavings = currentIncome - currentExpenses;
    // Update savings and investments
    if (yearlySavings > 0) {
      // Allocate savings between cash and investments
      const toInvestments = yearlySavings * (params.savingsRate / 100);
      const toCash = yearlySavings - toInvestments;
      currentSavings += toCash;
      currentInvestments += toInvestments;
      // Apply investment returns
      currentInvestments *= 1 + params.investmentReturn / 100;
    } else {
      // Draw from savings if expenses exceed income
      currentSavings += yearlySavings;
      // If savings are depleted, add to debt
      if (currentSavings < 0) {
        currentDebts -= currentSavings; // Add the negative savings to debt
        currentSavings = 0;
      }
    }
    // Calculate net worth
    const netWorth = currentSavings + currentInvestments - currentDebts;
    // Add to results
    result.years.push(year);
    result.netWorth.push(Math.round(netWorth));
    result.savings.push(Math.round(currentSavings));
    result.income.push(Math.round(currentIncome));
    result.expenses.push(Math.round(currentExpenses));
  }
  return result;
}
// Format currency amount
export function formatCurrency(amount: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount);
}
// Calculate compound interest
export function calculateCompoundInterest(principal: number, rate: number, years: number, contributions: number = 0, frequency: 'monthly' | 'yearly' = 'monthly') {
  const periodicRate = rate / 100 / (frequency === 'monthly' ? 12 : 1);
  const periods = years * (frequency === 'monthly' ? 12 : 1);
  let balance = principal;
  for (let i = 0; i < periods; i++) {
    balance = balance * (1 + periodicRate) + contributions;
  }
  return balance;
}
// Calculate loan payment
export function calculateLoanPayment(principal: number, rate: number, years: number) {
  const monthlyRate = rate / 100 / 12;
  const payments = years * 12;
  return principal * monthlyRate * Math.pow(1 + monthlyRate, payments) / (Math.pow(1 + monthlyRate, payments) - 1);
}
// Get financial category icons
export function getCategoryIcon(category: string): string {
  const normalizedCategory = category.toLowerCase();
  if (normalizedCategory.includes('salaire') || normalizedCategory.includes('revenu')) {
    return 'BriefcaseIcon';
  } else if (normalizedCategory.includes('loyer') || normalizedCategory.includes('logement')) {
    return 'HomeIcon';
  } else if (normalizedCategory.includes('nourriture') || normalizedCategory.includes('alimentation')) {
    return 'UtensilsIcon';
  } else if (normalizedCategory.includes('transport') || normalizedCategory.includes('voiture')) {
    return 'CarIcon';
  } else if (normalizedCategory.includes('loisir') || normalizedCategory.includes('divertissement')) {
    return 'MusicIcon';
  } else if (normalizedCategory.includes('santé') || normalizedCategory.includes('médical')) {
    return 'HeartPulseIcon';
  } else if (normalizedCategory.includes('éducation') || normalizedCategory.includes('formation')) {
    return 'GraduationCapIcon';
  } else if (normalizedCategory.includes('dette') || normalizedCategory.includes('crédit')) {
    return 'CreditCardIcon';
  } else if (normalizedCategory.includes('épargne') || normalizedCategory.includes('investissement')) {
    return 'TrendingUpIcon';
  } else {
    return 'CircleDollarSignIcon';
  }
}