import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { QuestionScreen } from './components/QuestionScreen';
import { MappingScreen } from './components/MappingScreen';
import { RevealScreen } from './components/RevealScreen';
import { Dashboard } from './components/Dashboard';
import { AdvancedSimulation } from './components/AdvancedSimulation';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { useFinanceStore } from './stores/financeStore';
import './styles/globals.css';
import { Profile } from './components/Profile';
import { Library } from './components/Library';
import { Lessons } from './components/Lessons';
import { Feedback } from './components/Feedback';
import { ExportData } from './components/ExportData';
import { BudgetPlanner } from './components/BudgetPlanner';
import { GoalTracker } from './components/GoalTracker';
import { NotificationCenter } from './components/NotificationCenter';
export function App() {
  const {
    hasCompletedOnboarding
  } = useFinanceStore();
  return <BrowserRouter>
      <ThemeProvider>
        <FinanceProvider>
          <Layout>
            <Routes>
              <Route path="/" element={hasCompletedOnboarding ? <Navigate to="/dashboard" /> : <QuestionScreen />} />
              <Route path="/question" element={<QuestionScreen />} />
              <Route path="/mapping" element={<MappingScreen />} />
              <Route path="/reveal" element={<RevealScreen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulation" element={<AdvancedSimulation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/library" element={<Library />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/export" element={<ExportData />} />
              <Route path="/budget" element={<BudgetPlanner />} />
              <Route path="/goals" element={<GoalTracker />} />
              <Route path="/notifications" element={<NotificationCenter />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </FinanceProvider>
      </ThemeProvider>
    </BrowserRouter>;
}