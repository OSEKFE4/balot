'use client';

import React, { useState } from 'react';
import { Play, Users, Trophy } from 'lucide-react';

interface LobbyProps {
  onJoin: (name: string, roomId: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleQuickPlay = () => {
    const randomRoom = "1234"; 
    onJoin(name || 'لاعب محترف', randomRoom);
  };

  return (
    <div className="relative z-50 w-full max-w-4xl flex flex-col items-center gap-12 py-10">
      <div className="text-center">
        <h2 className="text-6xl md:text-8xl font-black text-secondary mb-4 drop-shadow-2xl">أبو هذال</h2>
        <p className="text-white text-2xl font-bold bg-black/20 px-6 py-2 rounded-full">اختر كيف تريد اللعب اليوم</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
        {/* Quick Play Card */}
        <button 
          onClick={handleQuickPlay}
          className="group relative bg-secondary p-8 rounded-[40px] border-4 border-white/20 hover:scale-105 transition-all duration-300 text-right shadow-[0_0_50px_rgba(212,175,55,0.3)]"
        >
          <div className="relative z-10">
            <div className="bg-primary-dark w-20 h-20 rounded-3xl flex items-center justify-center text-secondary mb-6 shadow-xl">
              <Play size={40} fill="currentColor" />
            </div>
            <h3 className="text-4xl font-black text-primary-dark mb-2">لعب سريع</h3>
            <p className="text-primary-dark/70 text-xl font-bold">ادخل وابدأ اللعب فوراً</p>
          </div>
        </button>

        {/* Private Table Card */}
        <button className="group relative bg-white/10 backdrop-blur-2xl p-8 rounded-[40px] border-4 border-white/10 hover:scale-105 transition-all duration-300 text-right shadow-2xl">
          <div className="relative z-10">
            <div className="bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl">
              <Users size={40} />
            </div>
            <h3 className="text-4xl font-black text-white mb-2">طاولة خاصة</h3>
            <p className="text-white/60 text-xl font-bold">العب مع أصدقائك فقط</p>
          </div>
        </button>
      </div>
    </div>
  );
};
