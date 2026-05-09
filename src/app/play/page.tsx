'use client';

import React, { useState, useEffect } from 'react';

// --- Baloot Logic Engine ---
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createBalootDeck = () => {
  let deck: any[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ suit, rank, color: (suit === '♥' || suit === '♦') ? 'red' : 'black' });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export default function BalootGame() {
  const [isJoined, setIsJoined] = useState(false);
  const [myCards, setMyCards] = useState<any[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const startNewGame = () => {
    const deck = createBalootDeck();
    setMyCards(deck.slice(0, 5)); // Initial 5 cards
    setIsJoined(true);
    setGameStarted(true);
  };

  if (!isJoined) {
    return (
      <div style={{ backgroundColor: '#1a4d2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', color: '#d4af37', marginBottom: '2rem', fontWeight: '900' }}>أبو هذال</h1>
          <button 
            onClick={startNewGame}
            style={{ backgroundColor: '#d4af37', color: '#1a4d2e', border: 'none', padding: '15px 50px', fontSize: '1.5rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer' }}
          >
            لعب سريع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#e8e1d5', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', direction: 'rtl', overflow: 'hidden', position: 'fixed', inset: 0 }}>
      
      {/* Top Bar - Scores */}
      <div style={{ backgroundColor: '#333', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
        <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
           <span>💬 الدردشة</span>
           <span>👥 مشاركة</span>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px 20px', borderRadius: '10px', gap: '20px', border: '1px solid #555' }}>
          <div style={{ textAlign: 'center' }}><div style={{ color: '#aaa', fontSize: '10px' }}>لنا</div><div style={{ fontSize: '20px', fontWeight: '900' }}>27</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ color: '#aaa', fontSize: '10px' }}>لهم</div><div style={{ fontSize: '20px', fontWeight: '900' }}>115</div></div>
        </div>
        <div style={{ fontWeight: 'bold', color: '#d4af37' }}>أبو هذال</div>
      </div>

      {/* Main Table Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* The Table (Sadu Carpet) */}
        <div style={{ width: '300px', height: '300px', backgroundColor: '#8b0000', borderRadius: '20px', position: 'relative', border: '8px solid #c4a484', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)' }}></div>
           <div style={{ backgroundColor: 'white', padding: '8px 20px', borderRadius: '5px', fontWeight: 'black', color: '#1a4d2e', zIndex: 10 }}>استوى الورق</div>
           
           {/* Center Cards (Played) */}
           <div style={{ position: 'absolute', bottom: '20px', width: '45px', height: '65px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}></div>
           <div style={{ position: 'absolute', top: '20px', width: '45px', height: '65px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}></div>
           <div style={{ position: 'absolute', left: '20px', width: '45px', height: '65px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}></div>
           <div style={{ position: 'absolute', right: '20px', width: '45px', height: '65px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}></div>
        </div>

        {/* Opponents */}
        {/* Top */}
        <div style={{ position: 'absolute', top: '20px', textAlign: 'center' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: '#999', borderRadius: '50%', border: '2px solid white', margin: '0 auto' }}></div>
          <div style={{ color: '#333', fontSize: '12px', fontWeight: 'bold' }}>خالد</div>
        </div>
        {/* Left */}
        <div style={{ position: 'absolute', left: '20px', textAlign: 'center' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: '#999', borderRadius: '50%', border: '2px solid white', margin: '0 auto' }}></div>
          <div style={{ color: '#333', fontSize: '12px', fontWeight: 'bold' }}>فهد</div>
        </div>
        {/* Right */}
        <div style={{ position: 'absolute', right: '20px', textAlign: 'center' }}>
          <div style={{ width: '45px', height: '45px', backgroundColor: '#999', borderRadius: '50%', border: '2px solid white', margin: '0 auto' }}></div>
          <div style={{ color: '#333', fontSize: '12px', fontWeight: 'bold' }}>سلطان</div>
        </div>

        {/* My Hand (Bottom) */}
        <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ color: '#333', fontWeight: 'bold', marginBottom: '5px' }}>أنت</div>
           <div style={{ display: 'flex', gap: '5px' }}>
              {myCards.map((card, i) => (
                <div key={i} style={{ width: '55px', height: '85px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                   <div style={{ color: card.color, fontWeight: 'bold', fontSize: '14px' }}>{card.rank}</div>
                   <div style={{ color: card.color, fontSize: '24px', textAlign: 'center' }}>{card.suit}</div>
                   <div style={{ color: card.color, fontWeight: 'bold', fontSize: '14px', transform: 'rotate(180deg)' }}>{card.rank}</div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{ backgroundColor: '#222', padding: '15px', display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '5px solid #444' }}>
         {['صن', 'حكم', 'أشكل', 'بس'].map(btn => (
           <button key={btn} style={{ flex: 1, maxWidth: '100px', backgroundColor: '#555', color: 'white', border: 'none', padding: '15px 0', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', borderBottom: '4px solid #333', cursor: 'pointer' }}>
             {btn}
           </button>
         ))}
      </div>
    </div>
  );
}

