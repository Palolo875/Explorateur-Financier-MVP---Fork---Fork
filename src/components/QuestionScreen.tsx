import React, { useEffect, useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { ArrowRightIcon, SearchIcon, ClockIcon, SparklesIcon, TrendingUpIcon, NewspaperIcon, QuoteIcon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useFinanceStore } from '../stores/financeStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { externalApiService } from '../services/ExternalAPIService';
import { useWeatherData } from '../services/ExternalAPIService';
export function QuestionScreen() {
  const [question, setQuestion] = useState('');
  const {
    setUserQuestion
  } = useFinance();
  const {
    addQuestionToHistory,
    questionHistory
  } = useFinanceStore();
  const navigate = useNavigate();
  const {
    themeColors
  } = useTheme();
  const [suggestions] = useState(['Comment optimiser mon budget mensuel ?', "Puis-je m'acheter une voiture électrique ?", 'Comment réduire mes dépenses fixes ?', "Quel est mon potentiel d'investissement ?", "Comment créer un fonds d'urgence efficace ?"]);
  // Nouveaux états pour les intégrations API
  const [quote, setQuote] = useState<{
    content: string;
    author: string;
  } | null>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [newsLoading, setNewsLoading] = useState(false);
  // Récupérer une citation inspirante au chargement
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const quoteData = await externalApiService.getQuote();
        if (quoteData) {
          setQuote(quoteData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la citation:', error);
      }
    };
    fetchQuote();
  }, []);
  // Récupérer des actualités en fonction des mots-clés de la question
  useEffect(() => {
    const fetchNews = async () => {
      if (question.length < 5) return;
      // Extraire des mots-clés de la question
      const keywords = extractKeywords(question);
      if (!keywords) return;
      setNewsLoading(true);
      try {
        const articles = await externalApiService.getNewsArticles(keywords, 2);
        setRelatedNews(articles || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des actualités:', error);
      } finally {
        setNewsLoading(false);
      }
    };
    // Utiliser un délai pour éviter trop d'appels API pendant la saisie
    const timer = setTimeout(() => {
      if (question) fetchNews();
    }, 800);
    return () => clearTimeout(timer);
  }, [question]);
  // Récupérer un conseil en fonction de l'humeur sélectionnée
  const fetchAdviceForMood = async (mood: number) => {
    try {
      // Passer explicitement le paramètre mood à la méthode getAdvice
      const adviceData = await externalApiService.getAdvice(mood);
      if (adviceData) {
        // Adapter le message en fonction de l'humeur
        const moodPrefix = mood <= 3 ? 'Puisque vous êtes détendu, ' : mood >= 8 ? 'Pour gérer votre stress, ' : '';
        setAdvice(moodPrefix + adviceData.advice.toLowerCase());
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du conseil:', error);
    }
  };
  // Extraire des mots-clés pertinents de la question
  const extractKeywords = (text: string): string => {
    // Liste de mots-clés financiers à rechercher
    const financialKeywords = ['budget', 'épargne', 'investissement', 'bourse', 'actions', 'immobilier', 'crédit', 'prêt', 'hypothèque', 'retraite', 'assurance', 'impôts', 'voiture', 'électrique', 'dépenses', 'revenus', 'salaire', 'dette', 'économies'];
    // Convertir en minuscules et rechercher les mots-clés
    const lowerText = text.toLowerCase();
    const foundKeywords = financialKeywords.filter(keyword => lowerText.includes(keyword));
    if (foundKeywords.length > 0) {
      return foundKeywords.slice(0, 2).join(' ');
    }
    // Si aucun mot-clé spécifique n'est trouvé, retourner un terme générique
    return 'finance personnelle';
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setUserQuestion(question);
    addQuestionToHistory(question);
    navigate('/mapping');
  };
  const handleSuggestionClick = (suggestion: string) => {
    setQuestion(suggestion);
  };
  const handleHistoryClick = (historicalQuestion: string) => {
    setQuestion(historicalQuestion);
  };
  // Ajouter un état pour la ville de l'utilisateur
  const [userCity, setUserCity] = useState('Paris');
  // Utiliser le hook pour la météo
  const {
    data: weatherData
  } = useWeatherData(userCity);
  const renderWeatherWidget = () => {
    if (!weatherData) return null;
    return <div className="mb-4 bg-black/20 rounded-lg p-3 flex items-center">
        <img src={weatherData.icon} alt={weatherData.condition} className="w-10 h-10 mr-2" />
        <div>
          <div className="flex items-center">
            <span className="text-sm font-medium">{weatherData.location}</span>
            <span className="text-sm ml-2 text-gray-400">
              ({weatherData.condition})
            </span>
          </div>
          <div className="text-lg font-bold">{weatherData.temperature}°C</div>
        </div>
        <div className="ml-auto text-xs text-gray-400">
          <div>Humidité: {weatherData.humidity}%</div>
          <div>Vent: {weatherData.windSpeed} km/h</div>
        </div>
      </div>;
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCity(e.target.value);
  };
  return <motion.div className="w-full max-w-2xl mx-auto animate-fadeIn" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5
  }}>
      <div className="mb-8 text-center">
        <motion.h1 className="text-5xl font-bold mb-3" initial={{
        y: -20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2,
        duration: 0.5
      }}>
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.primary}`}>
            Révélez
          </span>{' '}
          votre équation financière
        </motion.h1>
        {quote && <motion.div className="italic text-base text-gray-300 mb-4 flex items-center justify-center" initial={{
        y: -10,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.25,
        duration: 0.5
      }}>
            <QuoteIcon className="h-4 w-4 mr-2 text-indigo-400" />"
            {quote.content}"
            <span className="text-xs text-gray-400 ml-2">— {quote.author}</span>
          </motion.div>}
        <motion.p className="text-lg text-gray-300 mb-6" initial={{
        y: -20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.3,
        duration: 0.5
      }}>
          Posez une question sur votre situation financière et découvrez des
          insights personnalisés
        </motion.p>
        <motion.div className="flex flex-wrap justify-center gap-2 mb-8" initial={{
        y: -20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.4,
        duration: 0.5
      }}>
          {suggestions.map((suggestion, index) => <button key={index} onClick={() => handleSuggestionClick(suggestion)} className={`text-sm px-3 py-1.5 rounded-full border ${themeColors.border} hover:bg-white/10 transition-colors duration-200`}>
              {suggestion}
            </button>)}
        </motion.div>
      </div>
      <GlassCard className="p-8 mb-8" animate>
        {renderWeatherWidget()}
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
            <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Posez votre question financière..." className={`w-full bg-black/20 border ${themeColors.border} rounded-xl py-4 pl-14 pr-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-transparent focus:ring-indigo-500/50`} required />
            <SparklesIcon className="absolute right-4 top-4 text-indigo-400 h-6 w-6 opacity-70" />
          </div>
          {/* Actualités en rapport avec la question */}
          <div className="mb-4 bg-black/20 rounded-lg p-3">
            <label className="text-sm text-gray-300 mb-1 block">
              Votre ville (pour les données locales)
            </label>
            <input type="text" value={userCity} onChange={handleCityChange} placeholder="Paris" className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-white" />
          </div>
          {/* Actualités en rapport avec la question */}
          {relatedNews.length > 0 && <div className="mb-6 bg-black/20 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <NewspaperIcon className="h-4 w-4 mr-2 text-indigo-400" />
                <h3 className="text-sm font-medium">Actualités en rapport</h3>
              </div>
              <div className="space-y-2">
                {relatedNews.map((article, index) => <div key={index} className="text-sm hover:bg-black/20 p-2 rounded-lg transition-colors">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200">
                      {article.title}
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      {article.source?.name}
                    </p>
                  </div>)}
              </div>
            </div>}
          {/* Slider émotionnel */}
          <div className="mb-6 bg-black/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Votre état émotionnel</h3>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                Influence vos décisions financières
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 w-20">Détendu</span>
              <input type="range" min="1" max="10" defaultValue="5" onChange={e => fetchAdviceForMood(parseInt(e.target.value))} className="flex-1 h-2 bg-black/40 rounded-lg appearance-none cursor-pointer" aria-label="Niveau de stress émotionnel" />
              <span className="text-xs text-gray-400 w-20 text-right">
                Stressé
              </span>
            </div>
            {/* Conseil basé sur l'humeur */}
            {advice && <div className="mt-3 text-xs italic text-indigo-300">
                <p>{advice}</p>
              </div>}
          </div>
          <div className="flex justify-end">
            <button type="submit" className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 text-lg font-medium shadow-lg`} disabled={!question}>
              Explorer ma situation
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </form>
      </GlassCard>
      {questionHistory.length > 0 && <GlassCard className="p-6" animate>
          <div className="flex items-center mb-4">
            <ClockIcon className="mr-2 h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-medium">Explorations récentes</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {questionHistory.map((historyItem, index) => <div key={index} className={`bg-black/20 rounded-xl p-4 cursor-pointer hover:bg-black/30 transition-colors flex items-center justify-between`} onClick={() => handleHistoryClick(historyItem)}>
                <div>
                  <p className="text-base">{historyItem}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {index === 0 ? "À l'instant" : index === 1 ? 'Hier' : `Il y a ${index + 1} jours`}
                  </p>
                </div>
                <TrendingUpIcon className="h-5 w-5 text-indigo-400 opacity-70" />
              </div>)}
          </div>
        </GlassCard>}
    </motion.div>;
}