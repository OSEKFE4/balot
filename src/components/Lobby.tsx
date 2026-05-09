'use client';

import React, { useState } from 'react';
import { Play, Users, Trophy } from 'lucide-react';

interface LobbyProps {
  onJoin: (name: string, roomId: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleQuickPlay = () => {
    // Generate a random room ID or use a default one
    const randomRoom = "1234"; 
    onJoin(name || 'لاعب محترف', randomRoom);
  };

  return (
    <div className="z-20 w-full max-w-4xl flex flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center">
        <h2 className="text-6xl md:text-7xl font-black text-secondary mb-4 drop-shadow-2xl">أبو هذال</h2>
        <p className="text-white/60 text-xl font-medium">اختر كيف تريد اللعب اليوم</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
        {/* Quick Play Card */}
        <button 
          onClick={handleQuickPlay}
          className="group relative bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur-xl p-8 rounded-[40px] border-2 border-secondary/30 hover:border-secondary transition-all duration-300 text-right overflow-hidden shadow-2xl"
        >
          <div className="absolute -left-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Play size={200} fill="currentColor" />
          </div>
          <div className="relative z-10">
            <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center text-primary-dark mb-6 shadow-lg">
              <Play size={32} fill="currentColor" />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">لعب سريع</h3>
            <p className="text-white/50 text-lg">ادخل إلى أقرب طاولة متاحة وابدأ اللعب فوراً</p>
          </div>
        </button>

        {/* Private Table Card */}
        <button className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border-2 border-white/10 hover:border-white/30 transition-all duration-300 text-right overflow-hidden shadow-2xl">
          <div className="absolute -left-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Users size={200} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">طاولة خاصة</h3>
            <p className="text-white/50 text-lg">أنشئ طاولة خاصة والعب مع أصدقائك فقط</p>
          </div>
        </button>
      </div>

      {/* Stats Preview */}
      <div className="flex gap-12 text-white/40 font-bold">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <span>1,240 لاعب متصل</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy size={20} />
          <span>85 بطولة نشطة</span>
        </div>
      </div>
    </div>
  );
};
