import React from 'react';
import { TeacherProfile } from '../types';

interface NavbarProps {
  profile: TeacherProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600 p-2 rounded-lg text-white font-bold flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide flex items-center gap-2">
              Classroom App <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">AI Assistant</span>
            </h1>
            <p className="text-xs text-slate-400">Trợ lý AI Bộ Môn Công Nghệ & Hoạt Động Trải Nghiệm - Hướng Nghiệp</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Vercel Edge CDN & API</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <span className="text-cyan-400">🛡️</span>
            <span>Supabase Auth Guard (Active)</span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
            <img src={profile.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-emerald-500" />
            <div className="text-left">
              <p className="font-semibold text-white">{profile.fullName}</p>
              <p className="text-[10px] text-slate-400">{profile.schoolName}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
