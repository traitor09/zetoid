import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden">
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content Wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto w-full pt-6 sm:pt-12 pb-16 px-4 text-center flex flex-col items-center">
        {/* Top Notification Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium mb-8 shadow-lg shadow-emerald-950/40 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Welcome to Zetoid — Stop task chaos. Start smart execution.</span>
        </div>

        {/* Main Hero Headline (Deepstash Typography Style) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-[1.15] mb-6">
          Replace{' '}
          <span className="relative inline-block text-slate-400 font-bold px-1">
            procrastination
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[5px] bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 rounded-full -rotate-1 shadow-md shadow-rose-500/30" />
          </span>{' '}
          with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy">
            intelligent clarity
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300/90 max-w-2xl font-normal leading-relaxed mb-10">
          Natural-language task capture, smart priority scoring, and AI daily digests. Built for
          speed, zero friction, and effortless productivity.
        </p>

        {/* Action Pill Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 z-20">
          <Link href="/app">
            <button
              type="button"
              className="h-12 px-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
          <Link href="/app">
            <button
              type="button"
              className="h-12 px-7 rounded-full bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 font-semibold text-base border border-emerald-500/30 hover:border-emerald-400/50 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore Dashboard</span>
            </button>
          </Link>
        </div>

        {/* Floating Tilted Cards (Deepstash Signature Cover Layout) */}
        <div className="relative w-full max-w-5xl h-[340px] sm:h-[380px] hidden md:block my-4 pointer-events-none">
          {/* Floating Card 1 - Top Left */}
          <div className="absolute top-2 left-[2%] w-64 bg-slate-900/95 border border-emerald-500/30 p-4 rounded-2xl shadow-2xl shadow-emerald-950/60 transform -rotate-12 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
            <div className="flex items-center justify-between text-[11px] font-semibold text-rose-400 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/50">
                HIGH PRIORITY (P1)
              </span>
              <span>Due Fri</span>
            </div>
            <p className="text-xs font-semibold text-slate-100 line-clamp-2">
              Submit quarterly TODO app specs & NLP pipeline
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-900/50">
                #work
              </span>
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-900/50">
                #urgent
              </span>
            </div>
          </div>

          {/* Floating Card 2 - Bottom Left */}
          <div className="absolute bottom-4 left-[10%] w-60 bg-slate-900/95 border border-emerald-500/25 p-4 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>NLP AI Parsed</span>
            </div>
            <p className="text-xs font-semibold text-slate-100">
              Buy coffee beans tomorrow morning
            </p>
            <div className="mt-2 text-[10px] text-slate-400">
              Extracted date: Tomorrow • Priority: Medium
            </div>
          </div>

          {/* Floating Card 3 - Center Top (AI Digest Preview) */}
          <div className="absolute top-0 left-[35%] w-72 bg-gradient-to-r from-emerald-950/90 to-slate-900/95 border border-emerald-400/40 p-4.5 rounded-2xl shadow-2xl shadow-emerald-500/10 transform -rotate-2 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-2 font-semibold">
              <span className="flex items-center gap-1">
                <Bot className="h-4 w-4 text-emerald-400" />
                AI Daily Briefing
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Gemini 3.8</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "Great momentum! You have 2 pending tasks today. Focus on your P1 quarterly report
              first."
            </p>
          </div>

          {/* Floating Card 4 - Top Right */}
          <div className="absolute top-4 right-[2%] w-64 bg-slate-900/95 border border-emerald-500/30 p-4 rounded-2xl shadow-2xl shadow-emerald-950/60 transform rotate-12 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Completed Task</span>
            </div>
            <p className="text-xs font-semibold text-slate-300 line-through">
              Review project architecture & AI pipeline
            </p>
            <div className="mt-2 text-[10px] text-emerald-400/80 font-medium">
              Done today • 100% completion
            </div>
          </div>

          {/* Floating Card 5 - Bottom Right */}
          <div className="absolute bottom-6 right-[12%] w-60 bg-slate-900/95 border border-emerald-500/25 p-4 rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-teal-300 mb-1.5">
              <Clock className="h-3.5 w-3.5 text-teal-400" />
              <span>Smart Schedule</span>
            </div>
            <p className="text-xs font-semibold text-slate-100">Sync with design team @ 3:00 PM</p>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
              <span>Remind via AI Digest</span>
            </div>
          </div>
        </div>

        {/* Features Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-12 pt-8 border-t border-emerald-950/60 text-left">
          <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-2xl">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">Natural Language Capture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type "Call client friday 5pm priority high #work" and Gemini parses everything
              instantly.
            </p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-2xl">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">AI Daily Digest</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start your day with a crisp, 2-line AI summary prioritizing what matters most.
            </p>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/40 p-5 rounded-2xl">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">Zero-Friction Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimistic updates, full-screen layout, and zero boilerplates for pure productivity.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator footer */}
      <div className="pb-4 text-center flex flex-col items-center gap-1 text-slate-500 text-[10px] uppercase tracking-widest">
        <span>Scroll to explore</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-emerald-500/60" />
      </div>
    </div>
  );
}
