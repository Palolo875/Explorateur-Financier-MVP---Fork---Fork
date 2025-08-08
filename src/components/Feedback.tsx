import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { MessageSquareIcon, StarIcon, SendIcon, CheckIcon, ThumbsUpIcon, ThumbsDownIcon, SmileIcon, FrownIcon, MehIcon } from 'lucide-react';
export function Feedback() {
  const {
    themeColors
  } = useTheme();
  const [feedbackType, setFeedbackType] = useState('general');
  const [satisfaction, setSatisfaction] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(0);
  const feedbackTypes = [{
    id: 'general',
    name: 'Général'
  }, {
    id: 'feature',
    name: 'Fonctionnalité'
  }, {
    id: 'bug',
    name: 'Bug'
  }, {
    id: 'suggestion',
    name: 'Suggestion'
  }];
  const microsurveys = [{
    id: 1,
    question: "Comment trouvez-vous l'interface utilisateur de Rivela?",
    options: ['Très intuitive', 'Facile à utiliser', 'Parfois confuse', 'Difficile à naviguer']
  }, {
    id: 2,
    question: 'Quelles fonctionnalités aimeriez-vous voir ajoutées?',
    options: ['Plus de graphiques', 'Conseils financiers personnalisés', 'Intégration avec des banques', 'Planification de retraite avancée']
  }, {
    id: 3,
    question: "À quelle fréquence utilisez-vous l'application?",
    options: ['Quotidiennement', 'Quelques fois par semaine', 'Quelques fois par mois', 'Rarement']
  }];
  const handleSubmit = e => {
    e.preventDefault();
    // In a real app, you would send the feedback to your server
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText('');
      setSatisfaction(0);
    }, 3000);
  };
  const handleSurveyResponse = response => {
    // In a real app, you would send the survey response to your server
    if (currentSurvey < microsurveys.length - 1) {
      setCurrentSurvey(currentSurvey + 1);
    } else {
      // Reset to first survey after completing all
      setCurrentSurvey(0);
    }
  };
  return <div className="w-full max-w-4xl mx-auto pb-20">
      <motion.div className="mb-6" initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Feedback</h1>
            <p className={`${themeColors.textSecondary}`}>
              Aidez-nous à améliorer Rivela avec vos commentaires
            </p>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback form */}
        <GlassCard className="p-6" animate>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquareIcon className="h-5 w-5 mr-2 text-indigo-400" />
            Donnez votre avis
          </h2>
          {submitted ? <div className="bg-green-500/20 border border-green-500/30 text-green-300 p-4 rounded-lg flex items-center justify-center flex-col h-64">
              <CheckIcon className="h-12 w-12 mb-2" />
              <p className="text-lg font-medium">Merci pour votre feedback!</p>
              <p className="text-sm">Votre avis est important pour nous.</p>
            </div> : <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm mb-2">Type de feedback</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {feedbackTypes.map(type => <button key={type.id} type="button" onClick={() => setFeedbackType(type.id)} className={`py-2 px-3 text-sm rounded-lg transition-all ${feedbackType === type.id ? `bg-gradient-to-r ${themeColors.primary} text-white` : 'bg-black/20 hover:bg-black/30'}`}>
                      {type.name}
                    </button>)}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">
                  Niveau de satisfaction
                </label>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" onClick={() => setSatisfaction(rating)} className={`p-2 rounded-full transition-all ${satisfaction === rating ? 'bg-indigo-500 text-white' : 'bg-black/20 hover:bg-black/30'}`}>
                      <StarIcon className="h-6 w-6" />
                    </button>)}
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-400">
                  <span>Pas satisfait</span>
                  <span>Très satisfait</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Votre message</label>
                <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Partagez vos commentaires, suggestions ou signalement de bugs..." className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-h-[120px]"></textarea>
              </div>
              <button type="submit" className={`w-full py-2 rounded-lg bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white flex items-center justify-center`}>
                <SendIcon className="h-4 w-4 mr-2" />
                Envoyer le feedback
              </button>
            </form>}
        </GlassCard>
        {/* Microsurvey */}
        <div className="space-y-6">
          <GlassCard className="p-6" animate>
            <h2 className="text-xl font-semibold mb-4">Micro-sondage</h2>
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-medium mb-4">
                {microsurveys[currentSurvey].question}
              </h3>
              <div className="space-y-2">
                {microsurveys[currentSurvey].options.map((option, index) => <button key={index} onClick={() => handleSurveyResponse(option)} className="w-full text-left p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-all">
                    {option}
                  </button>)}
              </div>
              <div className="mt-4 text-xs text-gray-400 flex justify-between">
                <span>
                  Question {currentSurvey + 1} sur {microsurveys.length}
                </span>
                <button onClick={() => setCurrentSurvey((currentSurvey + 1) % microsurveys.length)} className="text-indigo-400 hover:text-indigo-300">
                  Passer
                </button>
              </div>
            </div>
          </GlassCard>
          {/* Quick feedback */}
          <GlassCard className="p-6" animate>
            <h2 className="text-xl font-semibold mb-4">Feedback rapide</h2>
            <p className={`text-sm ${themeColors.textSecondary} mb-4`}>
              Comment évaluez-vous votre expérience avec Rivela aujourd'hui?
            </p>
            <div className="flex justify-center space-x-6">
              <button className="flex flex-col items-center p-3 rounded-lg bg-black/20 hover:bg-green-900/20 hover:text-green-400 transition-all">
                <SmileIcon className="h-8 w-8 mb-1" />
                <span className="text-sm">Bien</span>
              </button>
              <button className="flex flex-col items-center p-3 rounded-lg bg-black/20 hover:bg-yellow-900/20 hover:text-yellow-400 transition-all">
                <MehIcon className="h-8 w-8 mb-1" />
                <span className="text-sm">Moyen</span>
              </button>
              <button className="flex flex-col items-center p-3 rounded-lg bg-black/20 hover:bg-red-900/20 hover:text-red-400 transition-all">
                <FrownIcon className="h-8 w-8 mb-1" />
                <span className="text-sm">Mauvais</span>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>;
}