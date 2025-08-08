import React, { useState, createElement } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { DownloadIcon, FileIcon, FileSpreadsheetIcon, FileJsonIcon, CheckIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
type ExportFormat = 'csv' | 'pdf' | 'json' | 'excel';
export function ExportData() {
  const navigate = useNavigate();
  const {
    theme,
    themeColors
  } = useTheme();
  const {
    financialData,
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateNetWorth
  } = useFinance();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [includePersonalData, setIncludePersonalData] = useState(true);
  const [includeHistoricalData, setIncludeHistoricalData] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<boolean | null>(null);
  // Données financières calculées
  const totalIncome = calculateTotalIncome() || 0;
  const totalExpenses = calculateTotalExpenses() || 0;
  const balance = totalIncome - totalExpenses;
  const netWorth = calculateNetWorth() || 0;
  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(null);
    try {
      // Simuler un délai d'exportation
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Préparer les données à exporter
      const dataToExport = {
        summary: {
          totalIncome,
          totalExpenses,
          balance,
          netWorth,
          exportDate: new Date().toISOString()
        },
        data: {
          incomes: includePersonalData ? financialData?.incomes || [] : [],
          expenses: includePersonalData ? financialData?.expenses || [] : [],
          savings: includePersonalData ? financialData?.savings || [] : [],
          debts: includePersonalData ? financialData?.debts || [] : []
        },
        historical: includeHistoricalData ? {} : null
      };
      // Logique d'exportation selon le format
      switch (selectedFormat) {
        case 'csv':
          // Simuler téléchargement CSV
          console.log('Exporting to CSV:', dataToExport);
          downloadFile(convertToCSV(dataToExport), 'finance_export.csv', 'text/csv');
          break;
        case 'pdf':
          // Simuler téléchargement PDF
          console.log('Exporting to PDF:', dataToExport);
          toast.success('Export PDF généré');
          break;
        case 'json':
          // Simuler téléchargement JSON
          console.log('Exporting to JSON:', dataToExport);
          downloadFile(JSON.stringify(dataToExport, null, 2), 'finance_export.json', 'application/json');
          break;
        case 'excel':
          // Simuler téléchargement Excel
          console.log('Exporting to Excel:', dataToExport);
          toast.success('Export Excel généré');
          break;
      }
      setExportSuccess(true);
      toast.success('Exportation réussie!');
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      setExportSuccess(false);
      toast.error("Erreur lors de l'exportation");
    } finally {
      setIsExporting(false);
    }
  };
  // Fonction pour télécharger un fichier
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement('a');
    const file = new Blob([content], {
      type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  // Fonction pour convertir en CSV
  const convertToCSV = (data: any): string => {
    // Conversion simplifiée pour la démonstration
    let csv = 'Catégorie,Montant\n';
    // Ajouter les revenus
    data.data.incomes.forEach((income: any) => {
      csv += `Revenu - ${income.category},${income.value}\n`;
    });
    // Ajouter les dépenses
    data.data.expenses.forEach((expense: any) => {
      csv += `Dépense - ${expense.category},${expense.value}\n`;
    });
    return csv;
  };
  // Obtenir l'icône du format d'exportation
  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheetIcon className="h-5 w-5" />;
      case 'pdf':
        return <div className="h-5 w-5" />;
      case 'json':
        return <FileJsonIcon className="h-5 w-5" />;
      case 'excel':
        return <FileSpreadsheetIcon className="h-5 w-5" />;
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
        <h1 className="text-3xl font-bold">Exporter vos données</h1>
        <p className={`${themeColors?.textSecondary || 'text-gray-400'}`}>
          Téléchargez vos données financières dans différents formats
        </p>
      </motion.div>
      <GlassCard className="p-6 mb-6" animate>
        <h2 className="text-xl font-medium mb-4">Résumé financier</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Revenus</div>
            <div className="text-lg font-medium text-green-400">
              {totalIncome.toLocaleString('fr-FR')}€
            </div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Dépenses</div>
            <div className="text-lg font-medium text-red-400">
              {totalExpenses.toLocaleString('fr-FR')}€
            </div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Balance</div>
            <div className={`text-lg font-medium ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {balance.toLocaleString('fr-FR')}€
            </div>
          </div>
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Valeur nette</div>
            <div className="text-lg font-medium text-blue-400">
              {netWorth.toLocaleString('fr-FR')}€
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Format d'exportation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={() => setSelectedFormat('csv')} className={`p-3 rounded-lg flex flex-col items-center ${selectedFormat === 'csv' ? `bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'}` : 'bg-black/20 hover:bg-black/30'}`}>
              <FileSpreadsheetIcon className="h-8 w-8 mb-2" />
              <span>CSV</span>
            </button>
            <button onClick={() => setSelectedFormat('pdf')} className={`p-3 rounded-lg flex flex-col items-center ${selectedFormat === 'pdf' ? `bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'}` : 'bg-black/20 hover:bg-black/30'}`}>
              <div className="h-8 w-8 mb-2" />
              <span>PDF</span>
            </button>
            <button onClick={() => setSelectedFormat('json')} className={`p-3 rounded-lg flex flex-col items-center ${selectedFormat === 'json' ? `bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'}` : 'bg-black/20 hover:bg-black/30'}`}>
              <FileJsonIcon className="h-8 w-8 mb-2" />
              <span>JSON</span>
            </button>
            <button onClick={() => setSelectedFormat('excel')} className={`p-3 rounded-lg flex flex-col items-center ${selectedFormat === 'excel' ? `bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'}` : 'bg-black/20 hover:bg-black/30'}`}>
              <FileSpreadsheetIcon className="h-8 w-8 mb-2" />
              <span>Excel</span>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Options d'exportation</h3>
          <div className="space-y-3">
            <div className="flex items-center bg-black/20 p-3 rounded-lg">
              <input type="checkbox" id="includePersonalData" checked={includePersonalData} onChange={() => setIncludePersonalData(!includePersonalData)} className="h-4 w-4 mr-3" />
              <div className="flex-1">
                <label htmlFor="includePersonalData" className="font-medium">
                  Données personnelles
                </label>
                <p className="text-sm text-gray-400">
                  Inclure vos revenus, dépenses, épargnes et dettes
                </p>
              </div>
            </div>
            <div className="flex items-center bg-black/20 p-3 rounded-lg">
              <input type="checkbox" id="includeHistoricalData" checked={includeHistoricalData} onChange={() => setIncludeHistoricalData(!includeHistoricalData)} className="h-4 w-4 mr-3" />
              <div className="flex-1">
                <label htmlFor="includeHistoricalData" className="font-medium">
                  Données historiques
                </label>
                <p className="text-sm text-gray-400">
                  Inclure l'historique et l'évolution de vos finances
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black/20 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertCircleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              Vos données financières sont sensibles. Si vous partagez ce
              fichier, assurez-vous que c'est avec une personne de confiance. Le
              fichier exporté contiendra des informations détaillées sur votre
              situation financière.
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg">
            Retour au tableau de bord
          </button>
          <button onClick={handleExport} disabled={isExporting} className={`px-6 py-2 rounded-lg bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} hover:opacity-90 flex items-center ${isExporting ? 'opacity-70' : ''}`}>
            {isExporting ? <>
                <ClockIcon className="animate-spin h-5 w-5 mr-2" />
                Exportation...
              </> : exportSuccess === true ? <>
                <CheckIcon className="h-5 w-5 mr-2" />
                Exporté avec succès
              </> : <>
                <DownloadIcon className="h-5 w-5 mr-2" />
                Exporter {getFormatIcon(selectedFormat)}
              </>}
          </button>
        </div>
      </GlassCard>
      <GlassCard className="p-6" animate>
        <h2 className="text-xl font-medium mb-4">
          Historique des exportations
        </h2>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <div className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheetIcon className="h-5 w-5 mr-3 text-green-400" />
              <div>
                <div className="font-medium">finance_export_2023-11-15.csv</div>
                <div className="text-xs text-gray-400">
                  15 novembre 2023 à 14:32
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-black/20 rounded-full">
              <DownloadIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-5 w-5 mr-3 text-red-400" />
              <div>
                <div className="font-medium">
                  rapport_financier_2023-10-30.pdf
                </div>
                <div className="text-xs text-gray-400">
                  30 octobre 2023 à 09:15
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-black/20 rounded-full">
              <DownloadIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-black/20 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileJsonIcon className="h-5 w-5 mr-3 text-yellow-400" />
              <div>
                <div className="font-medium">finance_data_2023-09-22.json</div>
                <div className="text-xs text-gray-400">
                  22 septembre 2023 à 18:47
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-black/20 rounded-full">
              <DownloadIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>;
}