import React from 'react';
import { Check, Zap, Brain, Database, MessageSquare } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../utils/translations.ts';

interface FeaturesProps {
  language: Language;
}

const Features: React.FC<FeaturesProps> = ({ language }) => {
  const t = translations[language].features;
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-dark tracking-tight sm:text-5xl">
          {t.whyUs}
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          {t.whyUsSub}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureItem 
          icon={<MessageSquare className="h-6 w-6 text-primary" />}
          title={t.list[0].title}
          subtitle={t.list[0].sub}
        />
        <FeatureItem 
          icon={<Check className="h-6 w-6 text-secondary" />}
          title={t.list[1].title}
          subtitle={t.list[1].sub}
          isGreenIcon
        />
        <FeatureItem 
          icon={<Zap className="h-6 w-6 text-primary" />}
          title={t.list[2].title}
          subtitle={t.list[2].sub}
        />
        <FeatureItem 
          icon={<Database className="h-6 w-6 text-purple-500" />}
          title={t.list[3].title}
          subtitle={t.list[3].sub}
        />
        <FeatureItem 
          icon={<Brain className="h-6 w-6 text-pink-500" />}
          title={t.list[4].title}
          subtitle={t.list[4].sub}
          className="md:col-span-2"
        />
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode, title: string, subtitle: string, isGreenIcon?: boolean, className?: string }> = ({ icon, title, subtitle, className }) => (
  <div className={`flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-primary/50 transition-all transform hover:-translate-y-1 ${className || ''}`}>
    <div className={`flex-shrink-0 p-3 rounded-full bg-gray-50 me-5`}>
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-bold text-dark">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  </div>
);

export default Features;