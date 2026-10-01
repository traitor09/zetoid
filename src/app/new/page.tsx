'use client';

import { AddTask } from '@/components/AddTask';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewTaskPage() {
  const router = useRouter();

  return (
    <div className="w-full py-4 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-900/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-300/90">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Smart NLP Task Capture</h1>
            <p className="text-xs text-slate-400">
              Type naturally using dates, priority terms, or hashtags. Gemini 3.8 Flash will
              structure it automatically.
            </p>
          </div>
        </div>

        <AddTask autoFocus onSuccess={() => router.push('/')} />

        <div className="mt-8 pt-6 border-t border-emerald-950/40">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            NLP Parser Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
              <span className="text-emerald-300/90 font-mono block mb-1">
                "Submit quarterly report by Friday 5pm priority high #work"
              </span>
              <span className="text-slate-400 text-[11px]">
                Extracts title, calculates Friday date, sets P1 priority, tags as work.
              </span>
            </div>
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
              <span className="text-emerald-300/90 font-mono block mb-1">
                "Buy fresh coffee beans tomorrow #personal"
              </span>
              <span className="text-slate-400 text-[11px]">
                Extracts title, computes tomorrow's date, sets default P2, tags as personal.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
