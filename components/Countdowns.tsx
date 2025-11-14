import React from 'react';
import { Clock } from 'lucide-react';

const Countdowns: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
      <div className="bg-secondary-500 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg transform hover:scale-105 transition-transform cursor-default">
        <Clock className="h-4 w-4" />
        <span className="font-bold text-sm">1ère BAC</span>
        <span className="font-mono font-semibold">201j 13h 16m</span>
      </div>
      <div className="bg-primary-500 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg transform hover:scale-105 transition-transform cursor-default">
        <Clock className="h-4 w-4" />
        <span className="font-bold text-sm">2ème BAC</span>
        <span className="font-mono font-semibold">204j 13h 16m</span>
      </div>
    </div>
  );
};

export default Countdowns;