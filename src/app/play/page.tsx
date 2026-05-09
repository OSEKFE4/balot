'use client';

import React, { useState, useEffect } from 'react';

// --- Baloot Rules, Values & Power ---
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Card values for scoring
const CARD_VALUES_SUN: Record<string, number> = { 'A': 11, '10': 10, 'K': 4, 'Q': 3, 'J': 2, '9': 0, '8': 0, '7': 0 };
const CARD_VALUES_HUKM: Record<string, number> = { 'J': 20, '9': 14, 'A': 11, '10': 10, 'K': 4, 'Q': 3, '8': 0, '7': 0 };

// Card power for winning tricks (Higher is better)
const CARD_POWER_SUN: Record<string, number> = { 'A': 8, '10': 7, 'K': 6, 'Q': 5, 'J': 4, '9': 3, '8': 2, '7': 1 };
const CARD_POWER_HUKM: Record<string, number> = { 'J': 8, '9': 7, 'A': 6, '10': 5, 'K': 4, 'Q': 3, '8': 2, '7': 1 };

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
  // Real Random Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function BalootGame() {
  const [isJoined, setIsJoined] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [myCards, setMyCards] = useState<any[]>([]);
  const [tableCards, setTableCards] = useState<any[]>([]);
  const [dealer, setDealer] = useState(0); // 0: Me, 1: Khalid, 2: Fahad, 3: Sultan
  const [turn, setTurn] = useState(1); 
  const [gameStatus, setGameStatus] = useState('WAITING');
  const [scores, setScores] = useState([0, 0]);
  const [roundPoints, setRoundPoints] = useState([0, 0]);
  const [showNashra, setShowNashra] = useState(false);
  const [project, setProject] = useState<string | null>(null);
  
  // New Bidding States
  const [upCard, setUpCard] = useState<any>(null);
  const [biddingRound, setBiddingRound] = useState(1); // 1: First Round, 2: Second Round
  const [bidHistory, setBidHistory] = useState<string[]>([]);
  const [buyer, setBuyer] = useState<number | null>(null);
  const [gameType, setGameType] = useState<'SUN' | 'HUKM' | null>(null);
  const [deck, setDeck] = useState<any[]>([]);

  // Voice Announcement System
  const playVoice = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'ar-SA';
      window.speechSynthesis.speak(msg);
    }
  };

  // Initial Game Setup - Stage 1 (Dealing 5 cards and UpCard)
  const startNewGame = async () => {
    setIsJoined(true);
    setIsDealing(true);
    setGameStatus('DEALING');
    setMyCards([]);
    setTableCards([]);
    setRoundPoints([0, 0]);
    setProject(null);
    setBiddingRound(1);
    setBidHistory([]);
    setBuyer(null);
    setGameType(null);
    
    const newDeck = createBalootDeck();
    setDeck(newDeck);
    
    // Dealing 5 cards (Simulated sequence)
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 200));
      setMyCards(prev => [...prev, newDeck[i]]);
    }
    
    setUpCard(newDeck[20]);
    setIsDealing(false);
    setGameStatus('BIDDING');
    
    // Start bidding from player to the right of dealer
    const firstBidder = (dealer + 1) % 4;
    setTurn(firstBidder);
    playVoice("أول");
  };

  // Bot Bidding Logic
  useEffect(() => {
    if (isJoined && turn !== 0 && gameStatus === 'BIDDING' && !isDealing) {
      const botBiddingTimer = setTimeout(() => {
        handleBotBid();
      }, 1500);
      return () => clearTimeout(botBiddingTimer);
    }
  }, [turn, isJoined, gameStatus, isDealing]);

  const handleBotBid = () => {
    // Simple Bot Logic: 10% chance to buy Sun, 10% Hukm, 80% Pass
    const rand = Math.random();
    if (rand < 0.1) {
      buy('SUN', turn);
    } else if (rand < 0.2) {
      buy('HUKM', turn);
    } else {
      pass();
    }
  };

  const buy = (type: 'SUN' | 'HUKM', playerIdx: number) => {
    setBuyer(playerIdx);
    setGameType(type);
    setGameStatus('PLAYING');
    
    // Final Deal: Give remaining cards (3 each, buyer gets 2 + upCard)
    const remainingCards = deck.slice(21, 32); // Remaining cards after initial 20 + upcard
    // Simplified: Just give me 3 more if I bought, or whatever
    if (playerIdx === 0) {
      setMyCards(prev => [...prev, upCard, ...deck.slice(21, 23)]);
    } else {
      setMyCards(prev => [...prev, ...deck.slice(21, 24)]);
    }
    
    setTurn(0); // Playing starts from player after dealer
  };

  const pass = () => {
    const nextTurn = (turn + 1) % 4;
    setBidHistory(prev => [...prev, 'بس']);
    
    if (nextTurn === 0) {
      if (biddingRound === 1) {
        setBiddingRound(2);
      } else {
        // Everyone passed in Round 2 - Redeal
        startNewGame();
        return;
      }
    }
    setTurn(nextTurn);
  };

  const copyInviteLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('تم نسخ رابط الدعوة! أرسله لصديقك ليلعب معك كضيف.');
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
    const leadSuit = cards[0].suit;
    let winnerIdx = 0;
    let maxPower = -1;

    cards.forEach((c, index) => {
      let power = 0;
      if (gameType === 'SUN') {
        power = (c.suit === leadSuit) ? CARD_POWER_SUN[c.rank] : 0;
      } else {
        // HUKM logic (simplified: upcard suit is trump)
        const trumpSuit = upCard.suit;
        if (c.suit === trumpSuit) {
          power = CARD_POWER_HUKM[c.rank] + 100; // Trump always wins over others
        } else if (c.suit === leadSuit) {
          power = CARD_POWER_SUN[c.rank];
        }
      }
      
      if (power > maxPower) {
        maxPower = power;
        winnerIdx = index;
      }
    });

    const winnerPos = cards[winnerIdx].pos;
    const totalPoints = cards.reduce((sum, c) => {
      const valMap = (gameType === 'SUN') ? CARD_VALUES_SUN : (c.suit === upCard.suit ? CARD_VALUES_HUKM : CARD_VALUES_SUN);
      return sum + (valMap[c.rank] || 0);
    }, 0);

    const teamIndex = (winnerPos === 0 || winnerPos === 2) ? 0 : 1;
    setRoundPoints(prev => {
      const next = [...prev];
      next[teamIndex] += totalPoints;
      return next;
    });

    setTableCards([]);
    setTurn(winnerPos);

    if (myCards.length === 0 && !isDealing) {
      finishRound();
    }
  };

  const finishRound = () => {
    setGameStatus('FINISHED');
    setScores(prev => [prev[0] + roundPoints[0], prev[1] + roundPoints[1]]);
    setDealer(prev => (prev + 1) % 4); // Move dealer for next round
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
           <span onClick={copyInviteLink} style={{ cursor: 'pointer', color: '#d4af37', fontWeight: 'bold' }}>� دعوة صديق</span>
           <span>� الدردشة</span>
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
           
           <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '10px 25px', borderRadius: '8px', fontWeight: '900', color: '#1a4d2e', zIndex: 10, fontSize: '18px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', position: 'relative' }}>
              {gameStatus === 'BIDDING' ? (biddingRound === 1 ? 'أول' : 'ثاني') : (isDealing ? 'جارِ التوزيع...' : (turn === 0 ? 'دورك' : 'دور الخصم...'))}
              
              {/* UpCard during bidding */}
              {gameStatus === 'BIDDING' && upCard && (
                <div style={{ position: 'absolute', bottom: '-100px', left: '50%', transform: 'translateX(-50%)', width: '55px', height: '85px', backgroundColor: 'white', borderRadius: '6px', border: '2px solid #d4af37', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' }}>
                    <div style={{ color: upCard.color, fontWeight: 'bold', fontSize: '14px' }}>{upCard.rank}</div>
                    <div style={{ color: upCard.color, fontSize: '24px', textAlign: 'center' }}>{upCard.suit}</div>
                    <div style={{ color: upCard.color, fontWeight: 'bold', fontSize: '14px', transform: 'rotate(180deg)' }}>{upCard.rank}</div>
                </div>
              )}

              {/* Projects Indicator */}
              {project && (
                <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#d4af37', color: 'white', padding: '5px 15px', borderRadius: '10px', fontSize: '14px', animation: 'bounce 1s infinite', whiteSpace: 'nowrap' }}>
                  مشروع: {project} ✨
                </div>
              )}
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
         {gameStatus === 'BIDDING' ? (
           <>
              <button onClick={() => buy('SUN', 0)} style={{ flex: 1, maxWidth: '110px', backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '18px', borderBottom: '5px solid #333', cursor: 'pointer' }}>صن</button>
              <button onClick={() => buy('HUKM', 0)} style={{ flex: 1, maxWidth: '110px', backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '18px', borderBottom: '5px solid #333', cursor: 'pointer' }}>حكم</button>
              {biddingRound === 2 && <button onClick={() => buy('HUKM', 0)} style={{ flex: 1, maxWidth: '110px', backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '18px', borderBottom: '5px solid #333', cursor: 'pointer' }}>أشكل</button>}
              <button onClick={pass} style={{ flex: 1, maxWidth: '110px', backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '18px', borderBottom: '5px solid #333', cursor: 'pointer' }}>بس</button>
           </>
         ) : (
           ['صن', 'حكم', 'أشكل', 'بس'].map(btn => (
             <button key={btn} style={{ flex: 1, maxWidth: '110px', backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '12px', fontWeight: '900', fontSize: '18px', borderBottom: '5px solid #333', cursor: 'pointer' }}>
               {btn}
             </button>
           ))
         )}
      </div>
    </div>
  );
}



