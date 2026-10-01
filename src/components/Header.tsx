'use client';

import { Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-900/30 mb-6">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300/90 font-black text-xl flex items-center justify-center shadow-sm group-hover:border-emerald-400/50 group-hover:scale-105 transition-all">
            Z<span className="text-emerald-400/80">.</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                Zetoid
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-300/90 border border-emerald-500/20">
                AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart task management & NLP capture
            </p>
          </div>
        </Link>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-3">
          <Link href="/new">
            <Button variant="secondary" size="sm" className="hidden sm:flex">
              <Sparkles className="h-4 w-4 text-emerald-300/80" />
              NLP Smart Add
            </Button>
          </Link>
          <Link href="/new">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
