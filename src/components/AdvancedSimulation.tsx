import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, HomeIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
export function AdvancedSimulation() {
  const navigate = useNavigate();
  const {
    themeColors
  } = useTheme();
  return <div className="w-full max-w-6xl mx-auto pb-20 p-4">
      <GlassCard className="p-6" animate>
        <div className="flex flex-col items-center text-center">
          <AlertCircleIcon className="h-16 w-16 text-yellow-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Maintenance temporaire</h2>
          <p className="mb-6">
            Le module de simulation avancée est actuellement en maintenance.
            Nous travaillons à le rendre disponible très prochainement.
          </p>
          <div className="flex space-x-4">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-black/30 hover:bg-black/40 rounded-lg">
              Retour au tableau de bord
            </button>
            <button onClick={() => navigate('/dashboard')} className={`px-6 py-3 bg-gradient-to-r ${themeColors?.primary || 'from-indigo-500 to-purple-600'} rounded-lg`}>
              Voir mes finances
            </button>
          </div>
        </div>
      </GlassCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <GlassCard className="p-4" animate>
          <div className="flex items-center mb-3">
            <HomeIcon className="h-5 w-5 mr-2 text-blue-400" />
            <h3 className="font-medium">Fonctionnalités à venir</h3>
          </div>
          <p className="text-sm">
            Les simulations avancées vous permettront bientôt de visualiser
            différents scénarios pour votre avenir financier.
          </p>
        </GlassCard>
        <GlassCard className="p-4" animate>
          <div className="flex items-center mb-3">
            <HomeIcon className="h-5 w-5 mr-2 text-green-400" />
            <h3 className="font-medium">Planification d'objectifs</h3>
          </div>
          <p className="text-sm">
            Définissez des objectifs financiers et suivez votre progression vers
            leur réalisation.
          </p>
        </GlassCard>
        <GlassCard className="p-4" animate>
          <div className="flex items-center mb-3">
            <HomeIcon className="h-5 w-5 mr-2 text-purple-400" />
            <h3 className="font-medium">Comparaison de scénarios</h3>
          </div>
          <p className="text-sm">
            Comparez différentes stratégies financières pour optimiser votre
            patrimoine.
          </p>
        </GlassCard>
      </div>
    </div>;
}