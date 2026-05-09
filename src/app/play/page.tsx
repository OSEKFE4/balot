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
      <div style={{ backgroundColor: '#1a4d2e', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <Lobby onJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#e8e1d5', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', direction: 'rtl', overflow: 'hidden' }}>
      {/* Top Bar - Score and Menu */}
      <div style={{ backgroundColor: '#333', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', zIndex: 100 }}>
        <div style={{ display: 'flex', gap: '20px' }}>
           <span style={{ opacity: 0.7 }}>الإعدادات</span>
           <span style={{ opacity: 0.7 }}>الدردشة</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#aaa' }}>لنا</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#d4af37' }}>{gameState.scores[0]}</div>
          </div>
          <div style={{ paddingRight: '15px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#aaa' }}>لهم</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#d4af37' }}>{gameState.scores[1]}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
           <span style={{ color: '#d4af37', fontWeight: 'bold' }}>أبو هذال</span>
        </div>
      </div>

      {/* Main Table Area */}
      <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
        <div style={{ width: '100%', maxWidth: '600px', height: '100%', maxHeight: '600px', position: 'relative' }}>
          <GameBoard 
            players={gameState.players}
            tableCards={gameState.tableCards}
            currentPlayerId={socket?.id || 'me'}
          />
        </div>
      </div>

      {/* Action Buttons - Bottom */}
      <div style={{ backgroundColor: '#222', padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px', borderRadius: '30px 30px 0 0', boxShadow: '0 -5px 20px rgba(0,0,0,0.4)' }}>
          <button style={{ backgroundColor: '#555', color: 'white', fontWeight: 'bold', padding: '15px 30px', borderRadius: '12px', border: 'none', minWidth: '80px', cursor: 'pointer', borderBottom: '4px solid #333' }}>صن</button>
          <button style={{ backgroundColor: '#555', color: 'white', fontWeight: 'bold', padding: '15px 30px', borderRadius: '12px', border: 'none', minWidth: '80px', cursor: 'pointer', borderBottom: '4px solid #333' }}>حكم</button>
          <button style={{ backgroundColor: '#555', color: 'white', fontWeight: 'bold', padding: '15px 30px', borderRadius: '12px', border: 'none', minWidth: '80px', cursor: 'pointer', borderBottom: '4px solid #333' }}>أشكل</button>
          <button style={{ backgroundColor: '#555', color: 'white', fontWeight: 'bold', padding: '15px 30px', borderRadius: '12px', border: 'none', minWidth: '80px', cursor: 'pointer', borderBottom: '4px solid #333' }}>بس</button>
      </div>
    </div>
  );
}
