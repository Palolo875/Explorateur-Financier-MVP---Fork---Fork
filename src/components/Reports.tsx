import React, { useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FileBarChartIcon, DownloadIcon, ShareIcon, ClockIcon, CheckCircleIcon, CalendarIcon, BookIcon, PlusIcon } from 'lucide-react';
import { FinancialReport } from '../types/finance';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
// Set locale
dayjs.locale('fr');
export function Reports() {
  const navigate = useNavigate();
  const {
    themeColors
  } = useTheme();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Generate example reports on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      // Mock reports data - simplified
      const mockReports = [{
        id: '1',
        title: 'Rapport financier mensuel',
        date: new Date().toISOString(),
        summary: "Ce rapport mensuel met en évidence une amélioration de votre taux d'épargne de 3% par rapport au mois précédent.",
        recommendations: ['Continuez à optimiser vos dépenses en loisirs', "Envisagez d'investir votre surplus d'épargne"]
      }, {
        id: '2',
        title: "Analyse d'objectif d'achat immobilier",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        summary: "Cette analyse évalue votre capacité à atteindre votre objectif d'achat immobilier.",
        recommendations: ["Augmentez votre taux d'épargne de 5% pour réduire le délai", "Explorez les aides à l'accession à la propriété"]
      }];
      console.log('Rapports chargés:', mockReports);
      setReports(mockReports);
      setSelectedReport(mockReports[0]);
    } catch (err) {
      console.error('Erreur lors du chargement des rapports:', err);
      setError("Une erreur s'est produite lors du chargement des rapports");
    } finally {
      setIsLoading(false);
    }
  }, []);
  const formatDate = dateString => {
    return dayjs(dateString).format('DD MMMM YYYY');
  };
  return <div className="w-full max-w-6xl mx-auto pb-20">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Rapports Financiers</h1>
            <p className="text-gray-400">
              Analyses détaillées et recommandations personnalisées
            </p>
          </div>
        </div>
      </div>
      {/* Debugging information */}
      <GlassCard className="p-4 mb-6" animate>
        <h3 className="font-medium mb-4">État des données</h3>
        <div className="bg-black/20 p-3 rounded-lg mb-3">
          <p>Chargement: {isLoading ? 'Oui' : 'Non'}</p>
          <p>Erreur: {error ? error : 'Aucune'}</p>
          <p>Nombre de rapports: {reports.length}</p>
          <p>
            Rapport sélectionné:{' '}
            {selectedReport ? selectedReport.title : 'Aucun'}
          </p>
        </div>
      </GlassCard>
      {isLoading ? <GlassCard className="p-6 text-center" animate>
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement des rapports...</p>
        </GlassCard> : error ? <GlassCard className="p-6 text-center" animate>
          <p className="text-red-400 mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 rounded-lg">
            Réessayer
          </button>
        </GlassCard> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des rapports */}
          <div>
            <GlassCard className="p-4 mb-6" animate>
              <h3 className="font-medium mb-4 flex items-center">
                <FileBarChartIcon className="h-5 w-5 mr-2 text-indigo-400" />
                Mes rapports ({reports.length})
              </h3>
              <div className="space-y-3">
                {reports.map(report => <div key={report.id} onClick={() => setSelectedReport(report)} className={`p-3 rounded-lg cursor-pointer ${selectedReport?.id === report.id ? `bg-gradient-to-r ${themeColors.primary} bg-opacity-30` : 'bg-black/20 hover:bg-black/30'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">{report.title}</h4>
                      <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
                        {formatDate(report.date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {report.summary}
                    </p>
                  </div>)}
              </div>
            </GlassCard>
          </div>
          {/* Détail du rapport */}
          <div className="lg:col-span-2">
            {selectedReport ? <GlassCard className="p-6" animate>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {selectedReport.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDate(selectedReport.date)}
                    </div>
                  </div>
                </div>
                <div className="bg-black/20 p-4 rounded-xl mb-6">
                  <h3 className="font-medium mb-2 flex items-center">
                    <BookIcon className="h-5 w-5 mr-2 text-indigo-400" />
                    Résumé
                  </h3>
                  <p className="text-gray-300">{selectedReport.summary}</p>
                </div>
                <h3 className="font-medium mb-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-400" />
                  Recommandations
                </h3>
                <div className="space-y-2 mb-6">
                  {selectedReport.recommendations.map((recommendation, index) => <div key={index} className="bg-black/20 p-3 rounded-lg">
                        <div className="flex items-start">
                          <span className="w-5 h-5 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      </div>)}
                </div>
              </GlassCard> : <GlassCard className="p-6 flex items-center justify-center h-64" animate>
                <div className="text-center">
                  <FileBarChartIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Aucun rapport sélectionné
                  </h3>
                  <p className="text-gray-400">
                    Sélectionnez un rapport pour afficher son contenu
                  </p>
                </div>
              </GlassCard>}
          </div>
        </div>}
    </div>;
}