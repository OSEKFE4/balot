'use client';

import React, { useState } from 'react';

export default function SimplePlayPage() {
  const [isJoined, setIsJoined] = useState(false);

  // Simple Score State
  const scores = [27, 115];

  if (!isJoined) {
    return (
      <div style={{ backgroundColor: '#1a4d2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h1 style={{ fontSize: '5rem', marginBottom: '2rem', color: '#d4af37' }}>أبو هذال</h1>
          <button 
            onClick={() => setIsJoined(true)}
            style={{ backgroundColor: '#d4af37', color: '#1a4d2e', border: 'none', padding: '20px 60px', fontSize: '2rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
          >
            لعب سريع
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#e8e1d5', minHeight: '100vh', display: 'flex', flexDirection: 'column', direction: 'rtl', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Top Bar - Scores (Matched to Kammelna) */}
      <div style={{ backgroundColor: '#333', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ textAlign: 'center', opacity: 0.7 }}><div style={{ fontSize: '20px' }}>💬</div><div style={{ fontSize: '10px' }}>تقارير</div></div>
          <div style={{ textAlign: 'center', opacity: 0.7 }}><div style={{ fontSize: '20px' }}>👥</div><div style={{ fontSize: '10px' }}>مشاركة</div></div>
        </div>

        <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.6)', padding: '5px 20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', gap: '20px' }}>
          <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
            <div style={{ fontSize: '12px', color: '#aaa' }}>لنا</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'white' }}>{scores[0]}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#aaa' }}>لهم</div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'white' }}>{scores[1]}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ textAlign: 'center', opacity: 0.7 }}><div style={{ fontSize: '20px' }}>🏆</div><div style={{ fontSize: '10px' }}>التصويت</div></div>
          <div style={{ textAlign: 'center', opacity: 0.7 }}><div style={{ fontSize: '20px' }}>🎮</div><div style={{ fontSize: '10px' }}>التمرين</div></div>
        </div>
      </div>

      {/* Main Game Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Sadu Carpet Background */}
        <div style={{ width: '320px', height: '320px', backgroundColor: '#8b0000', borderRadius: '15px', position: 'relative', border: '10px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', opacity: 0.3, background: 'repeating-linear-gradient(0deg, #000, #000 5px, #8b0000 5px, #8b0000 10px)' }}></div>
          <div style={{ position: 'absolute', backgroundColor: 'white', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', fontSize: '20px', color: '#1a4d2e', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>استوى الورق</div>
          
          {/* Played Cards in center */}
          <div style={{ position: 'absolute', top: '20px', width: '40px', height: '60px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ccc' }}></div>
          <div style={{ position: 'absolute', bottom: '20px', width: '40px', height: '60px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ccc' }}></div>
          <div style={{ position: 'absolute', left: '20px', width: '40px', height: '60px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ccc' }}></div>
          <div style={{ position: 'absolute', right: '20px', width: '40px', height: '60px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ccc' }}></div>
        </div>

        {/* Players (Fixed Positions) */}
        <div style={{ position: 'absolute', bottom: '20px', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#aaa', borderRadius: '50%', margin: '0 auto 10px', border: '2px solid white' }}></div>
          <div style={{ color: '#333', fontWeight: 'bold' }}>أنت</div>
          {/* Cards in Hand */}
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            {[1,2,3,4,5].map(i => <div key={i} style={{ width: '45px', height: '70px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>)}
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '80px', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#aaa', borderRadius: '50%', margin: '0 auto 5px', border: '2px solid white' }}></div>
          <div style={{ color: '#333', fontSize: '12px' }}>خالد</div>
        </div>

        <div style={{ position: 'absolute', left: '30px', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#aaa', borderRadius: '50%', margin: '0 auto 5px', border: '2px solid white' }}></div>
          <div style={{ color: '#333', fontSize: '12px' }}>فهد</div>
        </div>

        <div style={{ position: 'absolute', right: '30px', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#aaa', borderRadius: '50%', margin: '0 auto 5px', border: '2px solid white' }}></div>
          <div style={{ color: '#333', fontSize: '12px' }}>سلطان</div>
        </div>
      </div>

      {/* Action Panel - Bottom (Matched to Kammelna) */}
      <div style={{ backgroundColor: '#222', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', borderRadius: '30px 30px 0 0', boxShadow: '0 -5px 20px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', color: '#d4af37', fontSize: '12px', fontWeight: 'bold' }}>🟡 خلك ملك</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button style={{ flex: 1, backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', borderBottom: '4px solid #333' }}>صن</button>
          <button style={{ flex: 1, backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', borderBottom: '4px solid #333' }}>حكم</button>
          <button style={{ flex: 1, backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', borderBottom: '4px solid #333' }}>أشكل</button>
          <button style={{ flex: 1, backgroundColor: '#555', color: 'white', border: 'none', padding: '18px 0', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', borderBottom: '4px solid #333' }}>بس</button>
        </div>
      </div>
    </div>
  );
}
