import React, { useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon, AlertCircleIcon, TrendingUpIcon, TrendingDownIcon, BarChart3Icon, PiggyBankIcon, CreditCardIcon, LineChartIcon, CircleDollarSignIcon, SparklesIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { FinancialInsight } from '../types/finance';
import { externalApiService } from '../services/ExternalAPIService';
import { useWeatherData, useMarketIndices } from '../services/ExternalAPIService';
export function RevealScreen() {
  const navigate = useNavigate();
  const {
    theme,
    themeColors
  } = useTheme();
  const {
    userQuestion,
    financialData,
    generateInsights
  } = useFinance();
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'whatif' | 'recommendations'>('insights');
  const [error, setError] = useState<string | null>(null);
  // API data states
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [activitySuggestion, setActivitySuggestion] = useState<string | null>(null);
  const [stockData, setStockData] = useState<any | null>(null);
  // Financial calculations
  const totalIncome = financialData?.incomes?.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : parseFloat(item.value) || 0), 0) || 0;
  const totalExpenses = financialData?.expenses?.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : parseFloat(item.value) || 0), 0) || 0;
  const balance = totalIncome - totalExpenses;
  // Load insights and API data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get financial insights
        const fetchedInsights = await generateInsights();
        setInsights(fetchedInsights || []);
        // Fetch crypto data
        await fetchCryptoData();
        // Fetch activity suggestion
        await fetchActivity();
        // Fetch stock market data
        await fetchStockData();
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Une erreur est survenue lors du chargement des données.');
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  // Utiliser les nouveaux hooks
  const {
    data: weatherData
  } = useWeatherData('Paris');
  const {
    data: marketIndices
  } = useMarketIndices();
  // Fetch crypto data
  const fetchCryptoData = async () => {
    setCryptoLoading(true);
    try {
      const apiService = externalApiService;
      const data = await apiService.getCryptoData('eur', 3);
      setCryptoData(data || []);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setCryptoLoading(false);
    }
  };
  // Fetch activity suggestion
  const fetchActivity = async () => {
    try {
      const apiService = externalApiService;
      const activity = await apiService.getActivitySuggestion();
      if (activity) {
        setActivitySuggestion(activity.activity);
      }
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };
  // Fetch stock market data
  const fetchStockData = async () => {
    try {
      const apiService = externalApiService;
      const data = await apiService.getStockQuote('MSFT');
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };
  // Calculate crypto equivalent of an expense
  const calculateCryptoEquivalent = (amount: number) => {
    if (cryptoData.length > 0 && cryptoData[0].current_price) {
      const btcPrice = cryptoData.find(crypto => crypto.symbol === 'btc')?.current_price || cryptoData[0].current_price;
      return (amount / btcPrice).toFixed(8);
    }
    return '0.00000000';
  };
  // Handle back navigation
  const handleBack = () => {
    navigate('/mapping');
  };
  // Handle continue navigation
  const handleContinue = () => {
    navigate('/dashboard');
  };
  // Get impact color based on impact level
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };
  // Get impact background based on impact level
  const getImpactBackground = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20';
      case 'medium':
        return 'bg-yellow-500/20';
      default:
        return 'bg-green-500/20';
    }
  };
  // Modifier la section des données de marché pour utiliser les vraies données
  const renderMarketData = () => {
    return <div className="mt-4 flex flex-wrap gap-4">
        {stockData && <div className="bg-black/30 px-3 py-1.5 rounded-full text-sm flex items-center">
            <TrendingUpIcon className={`h-3.5 w-3.5 mr-1.5 ${parseFloat(stockData.changePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className="mr-1 text-gray-300">S&P 500:</span>
            <span className={parseFloat(stockData.changePercent) >= 0 ? 'text-green-400' : 'text-red-400'}>
              {parseFloat(stockData.changePercent) >= 0 ? '+' : ''}
              {stockData.changePercent}%
            </span>
          </div>}
        {/* Afficher les indices de marché réels */}
        {marketIndices && marketIndices.length > 0 && <div className="bg-black/30 px-3 py-1.5 rounded-full text-sm flex items-center">
            <LineChartIcon className={`h-3.5 w-3.5 mr-1.5 ${marketIndices[0].changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className="mr-1 text-gray-300">{marketIndices[0].name}:</span>
            <span className={marketIndices[0].changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
              {marketIndices[0].changePercent >= 0 ? '+' : ''}
              {marketIndices[0].changePercent.toFixed(2)}%
            </span>
          </div>}
        {cryptoData.length > 0 && <div className="bg-black/30 px-3 py-1.5 rounded-full text-sm flex items-center">
            <CircleDollarSignIcon className={`h-3.5 w-3.5 mr-1.5 ${cryptoData[0].price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className="mr-1 text-gray-300">Bitcoin:</span>
            <span className={cryptoData[0].price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
              {cryptoData[0].price_change_percentage_24h >= 0 ? '+' : ''}
              {cryptoData[0].price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>}
        {/* Afficher les données météo */}
        {weatherData && <div className="bg-black/30 px-3 py-1.5 rounded-full text-sm flex items-center">
            <img src={weatherData.icon} alt="Météo" className="h-4 w-4 mr-1.5" />
            <span className="mr-1 text-gray-300">{weatherData.location}:</span>
            <span className="text-blue-400">{weatherData.temperature}°C</span>
          </div>}
      </div>;
  };
  return <div className="w-full max-w-4xl mx-auto pb-20">
      <Toaster position="top-right" />
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
          <h1 className="text-3xl font-bold">Révélation Financière</h1>
        </div>
      </motion.div>
      {/* Question display */}
      <GlassCard className="p-6 mb-6" animate>
        <h2 className="text-xl font-bold mb-4">Votre question</h2>
        <p className="text-lg bg-black/20 p-4 rounded-lg">
          {userQuestion || 'Comment puis-je améliorer ma situation financière ?'}
        </p>
        {/* Financial summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <TrendingUpIcon className="h-4 w-4 mr-2 text-green-400" />
              Revenus mensuels
            </h3>
            <div className="text-2xl font-bold text-green-400">
              {totalIncome}€
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <TrendingDownIcon className="h-4 w-4 mr-2 text-red-400" />
              Dépenses mensuelles
            </h3>
            <div className="text-2xl font-bold text-red-400">
              {totalExpenses}€
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <BarChart3Icon className="h-4 w-4 mr-2 text-blue-400" />
              Balance mensuelle
            </h3>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {balance}€
            </div>
          </div>
        </div>
        {/* Market data */}
        {renderMarketData()}
      </GlassCard>
      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-thin mb-6">
        <button className={`pb-2 px-4 ${activeTab === 'insights' ? `border-b-2 border-indigo-500 text-indigo-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('insights')}>
          <div className="flex items-center whitespace-nowrap">
            <SparklesIcon className="mr-1.5 h-4 w-4" />
            Insights financiers
          </div>
        </button>
        <button className={`pb-2 px-4 ${activeTab === 'whatif' ? `border-b-2 border-indigo-500 text-indigo-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('whatif')}>
          <div className="flex items-center whitespace-nowrap">
            <LineChartIcon className="mr-1.5 h-4 w-4" />
            Et si...?
          </div>
        </button>
        <button className={`pb-2 px-4 ${activeTab === 'recommendations' ? `border-b-2 border-indigo-500 text-indigo-400 font-medium` : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('recommendations')}>
          <div className="flex items-center whitespace-nowrap">
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Recommandations
          </div>
        </button>
      </div>
      {/* Tab content */}
      {isLoading ? <GlassCard className="p-6 mb-6" animate>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-400">
              Analyse de vos données financières...
            </p>
          </div>
        </GlassCard> : error ? <GlassCard className="p-6 mb-6" animate>
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircleIcon className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              Réessayer
            </button>
          </div>
        </GlassCard> : <>
          {/* Insights tab */}
          {activeTab === 'insights' && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }}>
              <GlassCard className="p-6 mb-6" animate>
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <SparklesIcon className="mr-2 h-5 w-5 text-indigo-400" />
                  Insights financiers
                </h2>
                <div className="space-y-4">
                  {insights.map(insight => <div key={insight.id} className={`p-4 rounded-lg ${getImpactBackground(insight.impact)}`}>
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full ${getImpactBackground(insight.impact)} mr-4`}>
                          {insight.impact === 'high' ? <AlertCircleIcon className={`h-5 w-5 ${getImpactColor(insight.impact)}`} /> : insight.impact === 'medium' ? <BarChart3Icon className={`h-5 w-5 ${getImpactColor(insight.impact)}`} /> : <TrendingUpIcon className={`h-5 w-5 ${getImpactColor(insight.impact)}`} />}
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{insight.title}</h3>
                          <p className="text-sm text-gray-300">
                            {insight.description}
                          </p>
                          {insight.action && <div className="mt-2 text-sm">
                              <span className="font-medium">
                                Action recommandée:{' '}
                              </span>
                              <span className="text-indigo-400">
                                {insight.action}
                              </span>
                            </div>}
                        </div>
                      </div>
                    </div>)}
                  {insights.length === 0 && <div className="text-center py-8 text-gray-400">
                      <LineChartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Pas assez de données pour générer des insights</p>
                      <p className="text-sm mt-2">
                        Ajoutez plus d'informations financières pour obtenir des
                        insights personnalisés
                      </p>
                    </div>}
                </div>
              </GlassCard>
            </motion.div>}
          {/* What if tab */}
          {activeTab === 'whatif' && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }}>
              <GlassCard className="p-6 mb-6" animate>
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <LineChartIcon className="mr-2 h-5 w-5 text-indigo-400" />
                  Et si...?
                </h2>
                {/* Scenario 1: Reduce expenses */}
                <div className="bg-black/20 p-4 rounded-lg mb-4">
                  <h3 className="font-medium mb-3">
                    Et si vous réduisiez vos dépenses de 10% ?
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-400">
                        Économies mensuelles
                      </div>
                      <div className="text-xl font-medium text-green-400">
                        +{(totalExpenses * 0.1).toFixed(0)}€
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">
                        Économies annuelles
                      </div>
                      <div className="text-xl font-medium text-green-400">
                        +{(totalExpenses * 0.1 * 12).toFixed(0)}€
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    En réduisant vos dépenses de seulement 10%, vous pourriez
                    économiser{' '}
                    <span className="text-green-400 font-medium">
                      {(totalExpenses * 0.1 * 12).toFixed(0)}€
                    </span>{' '}
                    par an, soit l'équivalent de{' '}
                    <span className="text-green-400 font-medium">
                      {Math.round(totalExpenses * 0.1 * 12 / totalIncome * 100) / 100}{' '}
                      mois
                    </span>{' '}
                    de revenus.
                  </p>
                </div>
                {/* Scenario 2: Increase income */}
                <div className="bg-black/20 p-4 rounded-lg mb-4">
                  <h3 className="font-medium mb-3">
                    Et si vous augmentiez vos revenus de 15% ?
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-400">
                        Revenus supplémentaires
                      </div>
                      <div className="text-xl font-medium text-green-400">
                        +{(totalIncome * 0.15).toFixed(0)}€
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">
                        Économies potentielles
                      </div>
                      <div className="text-xl font-medium text-green-400">
                        +{(totalIncome * 0.15 * 12).toFixed(0)}€
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Une augmentation de 15% de vos revenus vous permettrait
                    d'économiser jusqu'à{' '}
                    <span className="text-green-400 font-medium">
                      {(totalIncome * 0.15 * 12).toFixed(0)}€
                    </span>{' '}
                    par an, en maintenant votre niveau de vie actuel.
                  </p>
                </div>
                {/* Crypto equivalent section */}
                {cryptoData.length > 0 && <div className="bg-black/20 p-4 rounded-lg mt-4">
                    <h4 className="font-medium mb-3 flex items-center">
                      <div className="h-5 w-5 mr-2 text-yellow-400">₿</div>
                      Équivalent en crypto-monnaies
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Vos dépenses mensuelles ({totalExpenses}€) équivalent
                          à:
                        </span>
                        <span className="text-yellow-400 font-medium">
                          {calculateCryptoEquivalent(totalExpenses)} BTC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>
                          Votre épargne annuelle potentielle (
                          {balance > 0 ? balance * 12 : 0}€):
                        </span>
                        <span className="text-yellow-400 font-medium">
                          {calculateCryptoEquivalent(balance > 0 ? balance * 12 : 0)}{' '}
                          BTC
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-400">
                      Si vous aviez investi l'équivalent de vos dépenses
                      mensuelles en Bitcoin il y a 5 ans, cela vaudrait
                      aujourd'hui approximativement{' '}
                      {(totalExpenses * 10).toLocaleString()}€
                    </div>
                  </div>}
                {/* Activity suggestion */}
                {activitySuggestion && <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg mt-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <SparklesIcon className="h-4 w-4 mr-2 text-indigo-400" />
                      Suggestion pour économiser
                    </h4>
                    <p className="text-sm">{activitySuggestion}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Les activités gratuites peuvent remplacer jusqu'à 23% des
                      dépenses de loisirs mensuelles.
                    </p>
                  </div>}
              </GlassCard>
            </motion.div>}
          {/* Recommendations tab */}
          {activeTab === 'recommendations' && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }}>
              <GlassCard className="p-6 mb-6" animate>
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <CheckIcon className="mr-2 h-5 w-5 text-indigo-400" />
                  Recommandations
                </h2>
                {/* Recommendation 1 */}
                <div className="bg-black/20 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-green-500/20 mr-4">
                      <PiggyBankIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Optimisez votre taux d'épargne
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Avec un taux d'épargne actuel de{' '}
                        {balance > 0 ? (balance / totalIncome * 100).toFixed(1) : 0}
                        %, vous pourriez atteindre 20% en ajustant certaines
                        dépenses.
                      </p>
                      <div className="text-xs text-indigo-400">
                        Économie potentielle:{' '}
                        {(totalIncome * 0.2 - balance).toFixed(0)}€/mois
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recommendation 2 */}
                <div className="bg-black/20 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-500/20 mr-4">
                      <BarChart3Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Créez un fonds d'urgence
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Constituez un fonds d'urgence équivalent à 3-6 mois de
                        dépenses ({(totalExpenses * 3).toFixed(0)}€ -{' '}
                        {(totalExpenses * 6).toFixed(0)}€).
                      </p>
                      <div className="text-xs text-indigo-400">
                        Objectif mensuel recommandé:{' '}
                        {(totalExpenses * 0.1).toFixed(0)}€/mois
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recommendation 3 */}
                <div className="bg-black/20 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-purple-500/20 mr-4">
                      <CreditCardIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Réduisez les frais bancaires
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        Comparez les offres bancaires pour réduire vos frais
                        annuels de 40-60€.
                      </p>
                      <div className="text-xs text-indigo-400">
                        Économie potentielle: 5€/mois
                      </div>
                    </div>
                  </div>
                </div>
                {/* Market data recommendations */}
                {cryptoData.length > 0 && <div className="mt-4 p-4 bg-black/20 rounded-lg">
                    <h3 className="font-medium mb-3">
                      Recommandations d'investissement
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      Basé sur les tendances actuelles du marché et votre profil
                      financier:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="min-w-4 h-4 rounded-full bg-green-500/20 p-1 mr-2 mt-1"></div>
                        <span>
                          {cryptoData[0].price_change_percentage_24h >= 0 ? "Le marché crypto est en hausse, mais limitez l'exposition à 5% max de votre portefeuille" : "Le marché crypto est volatil, attendez une stabilisation avant d'investir"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="min-w-4 h-4 rounded-full bg-blue-500/20 p-1 mr-2 mt-1"></div>
                        <span>
                          {stockData && parseFloat(stockData.changePercent) >= 0 ? "Le marché actions est favorable, envisagez d'investir progressivement" : 'Le marché actions montre des signes de faiblesse, privilégiez les investissements défensifs'}
                        </span>
                      </li>
                    </ul>
                  </div>}
              </GlassCard>
            </motion.div>}
        </>}
      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button onClick={handleBack} className="btn btn-outline flex items-center justify-center">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Retour
        </button>
        <button onClick={handleContinue} className="btn btn-primary flex items-center justify-center">
          Continuer
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>;
}