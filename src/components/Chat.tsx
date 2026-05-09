'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const Chat = () => {
  const [messages, setMessages] = useState([
    { user: 'خالد', text: 'هلا والله' },
    { user: 'فهد', text: 'من بيبدأ؟' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input) {
      setMessages([...messages, { user: 'أنت', text: input }]);
      setInput('');
    }
  };

  return (
    <div className="w-80 h-96 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col overflow-hidden">
      <div className="bg-white/5 p-4 border-b border-white/10 font-bold text-secondary">الدردشة</div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.user === 'أنت' ? 'items-start' : 'items-end'}`}>
            <span className="text-xs text-white/40 mb-1">{msg.user}</span>
            <div className={`px-4 py-2 rounded-2xl text-sm ${
              msg.user === 'أنت' ? 'bg-secondary text-primary-dark font-bold' : 'bg-white/10 text-white'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/5 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب هنا..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
        />
        <button 
          onClick={handleSend}
          className="bg-secondary p-2 rounded-xl text-primary-dark"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
