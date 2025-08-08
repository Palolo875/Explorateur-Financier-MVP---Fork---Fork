import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FinancialData } from '../types/finance';
interface FinanceStore {
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  questionHistory: string[];
  addQuestionToHistory: (question: string) => void;
  clearQuestionHistory: () => void;
  financialSnapshots: {
    date: string;
    data: FinancialData;
  }[];
  saveFinancialSnapshot: (data?: FinancialData) => void;
  clearFinancialSnapshots: () => void;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  financialData: FinancialData;
  setFinancialData: (data: FinancialData) => void;
}
const defaultFinancialData: FinancialData = {
  incomes: [],
  expenses: [],
  savings: [],
  investments: [],
  debts: []
};
export const useFinanceStore = create<FinanceStore>()(persist(set => ({
  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: value => set({
    hasCompletedOnboarding: value
  }),
  questionHistory: [],
  addQuestionToHistory: question => set(state => {
    // Add question to history if it doesn't already exist
    if (!state.questionHistory.includes(question)) {
      return {
        questionHistory: [question, ...state.questionHistory].slice(0, 10) // Keep only the last 10 questions
      };
    }
    return state;
  }),
  clearQuestionHistory: () => set({
    questionHistory: []
  }),
  financialSnapshots: [],
  saveFinancialSnapshot: data => set(state => {
    const snapshot = {
      date: new Date().toISOString(),
      data: data || state.financialData || defaultFinancialData
    };
    return {
      financialSnapshots: [snapshot, ...state.financialSnapshots].slice(0, 12) // Keep only the last 12 snapshots
    };
  }),
  clearFinancialSnapshots: () => set({
    financialSnapshots: []
  }),
  selectedTheme: 'neon',
  setSelectedTheme: theme => set({
    selectedTheme: theme
  }),
  financialData: defaultFinancialData,
  setFinancialData: data => set({
    financialData: data
  })
}), {
  name: 'finance-store'
}));