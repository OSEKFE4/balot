'use client';

import React, { useState } from 'react';
import { Mail, User, Lock, ArrowRight } from 'lucide-react';

interface AuthProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const savedUser = localStorage.getItem(`user_${formData.email}`);
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.password === formData.password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          window.location.reload();
          onClose();
        } else {
          alert('كلمة المرور خاطئة');
        }
      } else {
        alert('المستخدم غير موجود');
      }
    } else {
      localStorage.setItem(`user_${formData.email}`, JSON.stringify(formData));
      localStorage.setItem('currentUser', JSON.stringify(formData));
      window.location.reload();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-primary-dark border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-secondary">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h2>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <ArrowRight className="rotate-180" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm text-white/60 mr-2">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                  <input
                    type="text"
                    required
                    placeholder="ادخل اسمك..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-secondary transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-white/60 mr-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                <input
                  type="email"
                  required
                  placeholder="example@mail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-secondary transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60 mr-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-secondary transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-4 text-lg mt-4">
              {isLogin ? 'دخول' : 'تسجيل'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/60 hover:text-secondary transition-colors text-sm"
            >
              {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
