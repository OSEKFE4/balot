'use client';

import React, { useState, useEffect } from 'react';

// --- Baloot Logic & AI Engine ---
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createBalootDeck = () => {
  let deck: any[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ 
        suit, 
        rank, 
        color: (suit === '♥' || suit === '♦') ? '#e11d48' : '#111',
        id: Math.random().toString(36).substr(2, 9)
      });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export default function BalootGame() {
  const [isJoined, setIsJoined] = useState(false);
  const [myCards, setMyCards] = useState<any[]>([]);
  const [tableCards, setTableCards] = useState<any[]>([]);
  const [turn, setTurn] = useState(0); // 0: You, 1: Khalid, 2: Fahad, 3: Sultan
  const [gameStatus, setGameStatus] = useState('WAITING');

  // Initial Game Setup
  const startNewGame = () => {
    const deck = createBalootDeck();
    setMyCards(deck.slice(0, 5)); 
    setTableCards([]);
    setTurn(0);
    setIsJoined(true);
    setGameStatus('PLAYING');
  };

  // Bot Logic ( Khalid, Fahad, Sultan )
  useEffect(() => {
    if (isJoined && turn !== 0 && gameStatus === 'PLAYING') {
      const botTimer = setTimeout(() => {
        const botCard = { 
          suit: SUITS[Math.floor(Math.random() * 4)], 
          rank: RANKS[Math.floor(Math.random() * 8)],
          playerId: turn
        };
        playCard(botCard, true);
      }, 1500); // Bot thinks for 1.5 seconds
      return () => clearTimeout(botTimer);
    }
  }, [turn, isJoined, gameStatus]);

  const playCard = (card: any, isBot = false) => {
    setTableCards(prev => [...prev, { ...card, pos: turn }]);
    
    if (!isBot) {
      setMyCards(prev => prev.filter(c => c.id !== card.id));
    }

    setTurn(prev => (prev + 1) % 4);
  };

  if (!isJoined) {
    return (
      <div style={{ backgroundColor: '#1a4d2e', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', color: '#d4af37', marginBottom: '2rem', fontWeight: '900', textShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>أبو هذال</h1>
          <button 
            onClick={startNewGame}
            style={{ backgroundColor: '#d4af37', color: '#1a4d2e', border: 'none', padding: '20px 60px', fontSize: '1.8rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
          >
            لعب سريع (مع الكمبيوتر)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#e8e1d5', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', direction: 'rtl', overflow: 'hidden', position: 'fixed', inset: 0, fontFamily: 'Arial, sans-serif' }}>
      
      {/* Top Bar */}
      <div style={{ backgroundColor: '#333', color: 'white', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', opacity: 0.8 }}>
           <span>💬 الدردشة</span>
           <span>👥 مشاركة</span>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.6)', padding: '5px 25px', borderRadius: '12px', gap: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ textAlign: 'center' }}><div style={{ color: '#aaa', fontSize: '10px' }}>لنا</div><div style={{ fontSize: '24px', fontWeight: '900', color: '#d4af37' }}>27</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ color: '#aaa', fontSize: '10px' }}>لهم</div><div style={{ fontSize: '24px', fontWeight: '900', color: '#d4af37' }}>115</div></div>
        </div>
        <div style={{ fontWeight: 'bold', color: '#d4af37', fontSize: '1.2rem' }}>أبو هذال</div>
      </div>

      {/* Main Table Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Table Surface (Carpet) */}
        <div style={{ width: '320px', height: '320px', backgroundColor: '#8b0000', borderRadius: '25px', position: 'relative', border: '10px solid #c4a484', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'repeating-linear-gradient(0deg, #000, #000 5px, #8b0000 5px, #8b0000 10px)' }}></div>
           
           <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '10px 25px', borderRadius: '8px', fontWeight: '900', color: '#1a4d2e', zIndex: 10, fontSize: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
              {turn === 0 ? 'دورك' : 'دور الكمبيوتر...'}
           </div>
           
           {/* Center Cards (Played) */}
           {tableCards.map((c, i) => (
             <div key={i} style={{ 
               position: 'absolute', 
               width: '50px', height: '75px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ddd', boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
               display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
               transform: c.pos === 0 ? 'translateY(60px)' : c.pos === 1 ? 'translateX(-60px)' : c.pos === 2 ? 'translateY(-60px)' : 'translateX(60px)'
             }}>
                <div style={{ color: (c.suit === '♥' || c.suit === '♦') ? 'red' : 'black', fontWeight: 'bold' }}>{c.rank}</div>
                <div style={{ fontSize: '20px', color: (c.suit === '♥' || c.suit === '♦') ? 'red' : 'black' }}>{c.suit}</div>
             </div>
           ))}
        </div>

        {/* AI Players (Khalid, Fahad, Sultan) */}
        <div style={{ position: 'absolute', top: '30px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#555', borderRadius: '50%', border: '3px solid white', margin: '0 auto 5px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}></div>
          <div style={{ color: '#333', fontSize: '14px', fontWeight: '900', backgroundColor: 'rgba(255,255,255,0.5)', px: '10px', borderRadius: '10px' }}>خالد</div>
          {turn === 1 && <div style={{ fontSize: '10px', color: '#1a4d2e', fontWeight: 'bold' }}>يفكر...</div>}
        </div>

        <div style={{ position: 'absolute', left: '30px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#555', borderRadius: '50%', border: '3px solid white', margin: '0 auto 5px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}></div>
          <div style={{ color: '#333', fontSize: '14px', fontWeight: '900', backgroundColor: 'rgba(255,255,255,0.5)', px: '10px', borderRadius: '10px' }}>فهد</div>
          {turn === 2 && <div style={{ fontSize: '10px', color: '#1a4d2e', fontWeight: 'bold' }}>يفكر...</div>}
        </div>

        <div style={{ position: 'absolute', right: '30px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#555', borderRadius: '50%', border: '3px solid white', margin: '0 auto 5px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}></div>
          <div style={{ color: '#333', fontSize: '14px', fontWeight: '900', backgroundColor: 'rgba(255,255,255,0.5)', px: '10px', borderRadius: '10px' }}>سلطان</div>
          {turn === 3 && <div style={{ fontSize: '10px', color: '#1a4d2e', fontWeight: 'bold' }}>يفكر...</div>}
        </div>

        {/* My Cards (Bottom Hand) */}
        <div style={{ position: 'absolute', bottom: '15px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ display: 'flex', gap: '8px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '20px' }}>
              {myCards.length > 0 ? myCards.map((card, i) => (
                <div 
                  key={card.id} 
                  onClick={() => turn === 0 && playCard(card)}
                  style={{ 
                    width: '60px', height: '95px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ccc', 
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)', cursor: turn === 0 ? 'pointer' : 'default',
                    transform: turn === 0 ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.2s',
                    hover: { transform: 'translateY(-10px)' }
                  }}
                >
                   <div style={{ color: card.color, fontWeight: '900', fontSize: '16px' }}>{card.rank}</div>
                   <div style={{ color: card.color, fontSize: '32px', textAlign: 'center' }}>{card.suit}</div>
                   <div style={{ color: card.color, fontWeight: '900', fontSize: '16px', transform: 'rotate(180deg)' }}>{card.rank}</div>
                </div>
              )) : <div style={{ color: '#333', fontWeight: 'bold' }}>انتهى ورقك!</div>}
           </div>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ backgroundColor: '#222', padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px', borderTop: '4px solid #444' }}>
         {['صن', 'حكم', 'أشكل', 'بس'].map(btn => (
           <button 
            key={btn} 
            style={{ 
              flex: 1, maxWidth: '110px', backgroundColor: '#555', color: 'white', border: 'none', 
              padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '18px', 
              borderBottom: '5px solid #333', cursor: 'pointer', transition: 'all 0.1s'
            }}
            onMouseDown={(e:any) => e.target.style.borderBottom = '0px'}
            onMouseUp={(e:any) => e.target.style.borderBottom = '5px solid #333'}
           >
             {btn}
           </button>
         ))}
      </div>
    </div>
  );
}


