"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { useEffect } from "react";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.reload();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent"></div>
      </div>

      {/* User Status */}
      <div className="absolute top-8 left-8 z-20">
        {user ? (
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="text-white font-bold">مرحباً، {user.name}</span>
            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowAuth(true)}
            className="btn-primary py-2 px-6"
          >
            دخول / تسجيل
          </button>
        )}
      </div>

      {/* Hero Content */}
      <div className="z-10 text-center max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black text-secondary mb-6 drop-shadow-lg">
          أبـو هـذال
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium">
          أفضل منصة لألعاب البلوت والجاكارو في الخليج
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link 
            href={user ? "/play" : "#"} 
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setShowAuth(true);
              }
            }}
            className="btn-primary text-xl px-12 py-4"
          >
            العب الآن
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "لعب جماعي", desc: "نافس آلاف اللاعبين في أي وقت" },
            { title: "بطولات يومية", desc: "جوائز قيمة للفائزين الأوائل" },
            { title: "دردشة وتواصل", desc: "كون صداقات جديدة أثناء اللعب" }
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <h3 className="text-secondary font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-white/40 text-sm">
        جميع الحقوق محفوظة © أبو هذال {new Date().getFullYear()}
      </footer>
    </main>
  );
}
