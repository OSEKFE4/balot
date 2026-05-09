'use client';

import React, { useState } from 'react';

interface LobbyProps {
  onJoin: (name: string, roomId: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');

  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 w-full max-w-md shadow-2xl">
      <h2 className="text-3xl font-black text-secondary mb-8 text-center">أبو هذال بلوت</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white/60 text-sm mb-2 mr-2">اسم اللاعب</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ادخل اسمك هنا..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm mb-2 mr-2">رقم الغرفة</label>
          <input 
            type="text" 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="مثال: 1234"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <button 
          onClick={() => onJoin(name, roomId)}
          disabled={!name || !roomId}
          className="w-full btn-primary py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          دخول
        </button>
      </div>
    </div>
  );
};
