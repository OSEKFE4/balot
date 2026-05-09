'use client';

import React, { useState, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { Lobby } from '@/components/Lobby';
import { Chat } from '@/components/Chat';
import { Card, Player, GameState } from '@/types/game';
import { io, Socket } from 'socket.io-client';

export default function PlayPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentTurn: 0,
    dealer: 0,
    deck: [],
    tableCards: [],
    scores: [0, 0],
    status: 'WAITING'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const userData = savedUser ? JSON.parse(savedUser) : { name: 'لاعب' };

    // Use current window location for socket if not localhost
    const socketUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
      ? 'http://localhost:3001' 
      : window.location.origin;

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket');
      newSocket.emit('join_game', '1234', { name: userData.name });
    });

    newSocket.on('game_update', (updatedState: GameState) => {
      setGameState(updatedState);
    });

    newSocket.on('card_played', (data: { card: Card; playerId: string }) => {
      setGameState(prev => ({
        ...prev,
        tableCards: [...prev.tableCards, data]
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleJoin = (name: string, roomId: string) => {
    setIsJoined(true); // Switch UI immediately
    if (socket && socket.connected) {
      socket.emit('join_game', roomId, { name });
    } else {
      // Mock data if socket is not connected
      setGameState(prev => ({
        ...prev,
        players: [
          { id: 'me', name: name || 'أنت', cards: [
            { suit: 'HEARTS', rank: 'ACE' },
            { suit: 'SPADES', rank: '10' },
            { suit: 'CLUBS', rank: 'JACK' },
            { suit: 'DIAMONDS', rank: '9' },
            { suit: 'HEARTS', rank: 'KING' },
          ], team: 0 },
          { id: '2', name: 'خالد (بوت)', cards: [], team: 1 },
          { id: '3', name: 'فهد (بوت)', cards: [], team: 0 },
          { id: '4', name: 'سلطان (بوت)', cards: [], team: 1 },
        ],
        status: 'PLAYING'
      }));
    }
  };

  const handlePlayCard = (card: Card) => {
    if (socket) {
      socket.emit('play_card', '1234', card); // Hardcoded roomId for now
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-primary relative flex items-center justify-center p-8 overflow-hidden">
        {/* Background stripes for texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,_#000,_#000_100px,_transparent_100px,_transparent_200px)]"></div>
        </div>
        <Lobby onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8e1d5] flex flex-col items-center justify-between p-0 relative overflow-hidden font-sans">
      {/* Top Bar - Score and Menu */}
      <div className="w-full bg-[#3a3a3a] text-white p-2 flex flex-col gap-1 shadow-lg z-50 border-b border-black/20">
        <div className="flex justify-between items-center px-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center opacity-80 hover:opacity-100 cursor-pointer">
              <div className="bg-white/10 p-1.5 rounded-lg"><Chat size={18} /></div>
              <span className="text-[9px] mt-0.5">الدردشة</span>
            </div>
            <div className="flex flex-col items-center opacity-80 hover:opacity-100 cursor-pointer">
              <div className="bg-white/10 p-1.5 rounded-lg"><Users size={18} /></div>
              <span className="text-[9px] mt-0.5">مشاركة</span>
            </div>
          </div>

          <div className="flex items-center bg-[#2a2a2a] rounded-2xl px-6 py-1.5 gap-6 border-2 border-white/5 shadow-inner">
            <div className="flex flex-col items-center border-l-2 border-white/10 pl-6">
              <span className="text-[10px] text-white/40 font-bold">لنا</span>
              <span className="text-2xl font-black text-white leading-none">{gameState.scores[0]}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-white/40 font-bold">لهم</span>
              <span className="text-2xl font-black text-white leading-none">{gameState.scores[1]}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center opacity-80 hover:opacity-100 cursor-pointer">
              <div className="bg-white/10 p-1.5 rounded-lg"><Trophy size={18} /></div>
              <span className="text-[9px] mt-0.5">البطولات</span>
            </div>
            <div className="flex flex-col items-center opacity-80 hover:opacity-100 cursor-pointer">
              <div className="bg-white/10 p-1.5 rounded-lg"><Play size={18} /></div>
              <span className="text-[9px] mt-0.5">خروج</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 w-full relative flex items-center justify-center p-2">
        <div className="w-full h-full max-w-2xl z-10 flex items-center justify-center">
          <GameBoard 
            players={gameState.players}
            tableCards={gameState.tableCards}
            currentPlayerId={socket?.id || 'me'}
          />
        </div>
      </div>

      {/* Action Buttons - Bottom */}
      <div className="w-full bg-[#333333] p-4 flex flex-col gap-4 z-50 rounded-t-[30px] shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-white/60 text-xs">خلك ملك</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button className="bg-[#5a5a5a] text-white font-bold py-4 rounded-xl shadow-inner border-b-4 border-black/40 active:border-b-0 active:translate-y-1 transition-all">صن</button>
          <button className="bg-[#5a5a5a] text-white font-bold py-4 rounded-xl shadow-inner border-b-4 border-black/40 active:border-b-0 active:translate-y-1 transition-all">حكم</button>
          <button className="bg-[#5a5a5a] text-white font-bold py-4 rounded-xl shadow-inner border-b-4 border-black/40 active:border-b-0 active:translate-y-1 transition-all">أشكل</button>
          <button className="bg-[#5a5a5a] text-white font-bold py-4 rounded-xl shadow-inner border-b-4 border-black/40 active:border-b-0 active:translate-y-1 transition-all">بس</button>
        </div>
      </div>
    </div>
  );
}
