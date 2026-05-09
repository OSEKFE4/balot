'use client';

import React, { useState, useEffect } from 'react';

// --- Baloot Rules & Values ---
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const CARD_VALUES_SUN: Record<string, number> = {
  'A': 11, '10': 10, 'K': 4, 'Q': 3, 'J': 2, '9': 0, '8': 0, '7': 0
};

const createBalootDeck = () => {
  let deck: any[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ 
        suit, 
        rank, 
        color: (suit === '♥' || suit === '♦') ? '#e11d48' : '#111',
        id: Math.random().toString(36).substr(2, 9),
        value: CARD_VALUES_SUN[rank] || 0
      });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export default function BalootGame() {
  const [isJoined, setIsJoined] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [myCards, setMyCards] = useState<any[]>([]);
  const [tableCards, setTableCards] = useState<any[]>([]);
  const [turn, setTurn] = useState(0); 
  const [gameStatus, setGameStatus] = useState('WAITING');
  const [scores, setScores] = useState([0, 0]); // لنا، لهم
  const [roundPoints, setRoundPoints] = useState([0, 0]);
  const [showNashra, setShowNashra] = useState(false);

  // Animated Dealing Sequence (3-2)
  const startNewGame = async () => {
    setIsJoined(true);
    setIsDealing(true);
    setGameStatus('DEALING');
    setMyCards([]);
    setTableCards([]);
    setRoundPoints([0, 0]);
    
    const deck = createBalootDeck();
    
    // Simulate animated dealing to 4 players
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 300));
      setMyCards(prev => [...prev, deck[i]]);
    }
    
    setIsDealing(false);
    setGameStatus('PLAYING');
    setTurn(0);
  };

  // Bot Logic with Point Calculation
  useEffect(() => {
    if (isJoined && turn !== 0 && gameStatus === 'PLAYING' && !isDealing) {
      const botTimer = setTimeout(() => {
        const botCard = { 
          suit: SUITS[Math.floor(Math.random() * 4)], 
          rank: RANKS[Math.floor(Math.random() * 8)],
          playerId: turn,
          value: 0
        };
        botCard.value = CARD_VALUES_SUN[botCard.rank] || 0;
        playCard(botCard, true);
      }, 1200);
      return () => clearTimeout(botTimer);
    }
  }, [turn, isJoined, gameStatus, isDealing]);

  const playCard = (card: any, isBot = false) => {
    const newTableCards = [...tableCards, { ...card, pos: turn }];
    setTableCards(newTableCards);
    
    if (!isBot) {
      setMyCards(prev => prev.filter(c => c.id !== card.id));
    }

    // Check if trick is finished (4 cards)
    if (newTableCards.length === 4) {
      setTimeout(() => {
        calculateTrickWinner(newTableCards);
      }, 1000);
    } else {
      setTurn(prev => (prev + 1) % 4);
    }
  };

  const calculateTrickWinner = (cards: any[]) => {
    const totalTrickPoints = cards.reduce((sum, c) => sum + c.value, 0);
    // Simplified winner logic: first player of trick wins for now
    const winnerPos = Math.floor(Math.random() * 4); 
    const teamIndex = (winnerPos === 0 || winnerPos === 2) ? 0 : 1;

    setRoundPoints(prev => {
      const next = [...prev];
      next[teamIndex] += totalTrickPoints;
      return next;
    });

    setTableCards([]);
    setTurn(winnerPos);

    // If hand is empty, show Nashra
    if (myCards.length === 0 && !isDealing) {
      finishRound();
    }
  };

  const finishRound = () => {
    setGameStatus('FINISHED');
    setScores(prev => [prev[0] + roundPoints[0], prev[1] + roundPoints[1]]);
    setShowNashra(true);
  };

  if (!isJoined) {
    return (
      <div style={{ backgroundColor: '#1a4d2e', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', color: '#d4af37', marginBottom: '2rem', fontWeight: '900' }}>أبو هذال</h1>
          <button 
            onClick={startNewGame}
            style={{ backgroundColor: '#d4af37', color: '#1a4d2e', border: 'none', padding: '20px 60px', fontSize: '1.8rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
          >
            لعب سريع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#e8e1d5', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', direction: 'rtl', overflow: 'hidden', position: 'fixed', inset: 0, fontFamily: 'Arial, sans-serif' }}>
      
      {/* Nashra Overlay */}
      {showNashra && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '80%', maxWidth: '400px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1a4d2e', marginBottom: '20px' }}>النشرة</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px', fontSize: '1.5rem' }}>
                 <div><div style={{ color: '#aaa', fontSize: '14px' }}>لنا</div><div style={{ fontWeight: 'bold' }}>{roundPoints[0]}</div></div>
                 <div style={{ borderLeft: '1px solid #ddd' }}></div>
                 <div><div style={{ color: '#aaa', fontSize: '14px' }}>لهم</div><div style={{ fontWeight: 'bold' }}>{roundPoints[1]}</div></div>
              </div>
              <button 
                onClick={() => { setShowNashra(false); startNewGame(); }}
                style={{ width: '100%', backgroundColor: '#1a4d2e', color: 'white', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                جولة جديدة
              </button>
           </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ backgroundColor: '#333', color: 'white', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', opacity: 0.8 }}>
           <span>💬 الدردشة</span>
           <span>👥 مشاركة</span>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.6)', padding: '5px 25px', borderRadius: '12px', gap: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ textAlign: 'center' }}><div style={{ color: '#aaa', fontSize: '10px' }}>لنا</div><div style={{ fontSize: '24px', fontWeight: '900', color: '#d4af37' }}>{scores[0]}</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ color: '#aaa', fontSize: '10px' }}>لهم</div><div style={{ fontSize: '24px', fontWeight: '900', color: '#d4af37' }}>{scores[1]}</div></div>
        </div>
        <div style={{ fontWeight: 'bold', color: '#d4af37', fontSize: '1.2rem' }}>أبو هذال</div>
      </div>

      {/* Main Table Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Table Surface (Carpet) */}
        <div style={{ width: '320px', height: '320px', backgroundColor: '#8b0000', borderRadius: '25px', position: 'relative', border: '10px solid #c4a484', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'repeating-linear-gradient(0deg, #000, #000 5px, #8b0000 5px, #8b0000 10px)' }}></div>
           
           <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '10px 25px', borderRadius: '8px', fontWeight: '900', color: '#1a4d2e', zIndex: 10, fontSize: '18px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
              {isDealing ? 'جارِ التوزيع...' : (turn === 0 ? 'دورك' : 'دور الخصم...')}
           </div>
           
           {/* Center Cards (Played) */}
           {tableCards.map((c, i) => (
             <div key={i} style={{ 
               position: 'absolute', 
               width: '50px', height: '75px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
               display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
               transform: c.pos === 0 ? 'translateY(60px)' : c.pos === 1 ? 'translateX(-60px)' : c.pos === 2 ? 'translateY(-60px)' : 'translateX(60px)',
               transition: 'all 0.3s'
             }}>
                <div style={{ color: (c.suit === '♥' || c.suit === '♦') ? 'red' : 'black', fontWeight: 'bold' }}>{c.rank}</div>
                <div style={{ fontSize: '20px', color: (c.suit === '♥' || c.suit === '♦') ? 'red' : 'black' }}>{c.suit}</div>
             </div>
           ))}
        </div>

        {/* AI Players */}
        <div style={{ position: 'absolute', top: '30px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#555', borderRadius: '50%', border: '3px solid white', margin: '0 auto 5px' }}></div>
          <div style={{ color: '#333', fontSize: '14px', fontWeight: '900' }}>خالد</div>
        </div>
        <div style={{ position: 'absolute', left: '30px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#555', borderRadius: '50%', border: '3px solid white', margin: '0 auto 5px' }}></div>
          <div style={{ color: '#333', fontSize: '14px', fontWeight: '900' }}>فهد</div>
        </div>
        <div style={{ position: 'absolute', right: '30px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#555', borderRadius: '50%', border: '3px solid white', margin: '0 auto 5px' }}></div>
          <div style={{ color: '#333', fontSize: '14px', fontWeight: '900' }}>سلطان</div>
        </div>

        {/* My Cards */}
        <div style={{ position: 'absolute', bottom: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ display: 'flex', gap: '8px', padding: '10px' }}>
              {myCards.map((card, i) => (
                <div 
                  key={card.id} 
                  onClick={() => !isDealing && turn === 0 && playCard(card)}
                  style={{ 
                    width: '60px', height: '95px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ccc', 
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)', cursor: turn === 0 ? 'pointer' : 'default',
                    transform: isDealing ? 'translateY(100px)' : 'translateY(0)',
                    transition: 'all 0.4s ease-out',
                    opacity: isDealing ? 0 : 1
                  }}
                >
                   <div style={{ color: card.color, fontWeight: '900', fontSize: '16px' }}>{card.rank}</div>
                   <div style={{ color: card.color, fontSize: '32px', textAlign: 'center' }}>{card.suit}</div>
                   <div style={{ color: card.color, fontWeight: '900', fontSize: '16px', transform: 'rotate(180deg)' }}>{card.rank}</div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{ backgroundColor: '#222', padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px', borderTop: '4px solid #444' }}>
         {['صن', 'حكم', 'أشكل', 'بس'].map(btn => (
           <button key={btn} style={{ flex: 1, maxWidth: '110px', backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '18px', borderBottom: '5px solid #333', cursor: 'pointer' }}>
             {btn}
           </button>
         ))}
      </div>
    </div>
  );
}



