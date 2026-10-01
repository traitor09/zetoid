'use client';

import { Bot, ChevronDown, ChevronUp, RefreshCw, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/Button';

export const AIDigestWidget: React.FC = () => {
  const [digest, setDigest] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);

  const fetchDigest = useCallback(async () => {
    setLoading(true);
    setDigest('');
    try {
      const response = await fetch('/api/ai/summarize');
      if (!response.ok) throw new Error('Digest response not ok');

      if (!response.body) {
        const text = await response.text();
        setDigest(text);
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setDigest(accumulated);
      }
    } catch (err) {
      console.error('Failed to stream digest:', err);
      setDigest(
        'Welcome to Zetoid! Organize your day, set priorities, and harness AI parsing to capture tasks effortlessly.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDigest();
  }, [fetchDigest]);

  return (
    <div className="glass-card rounded-2xl p-5 mb-8 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/25 via-slate-900/60 to-teal-950/25 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="h-4.5 w-4.5 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
              AI Daily Digest
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/20">
                Gemini 3.8 Flash
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchDigest}
            disabled={loading}
            className="text-slate-400 hover:text-white p-1.5 h-8 w-8"
            title="Refresh AI Digest"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-white p-1.5 h-8 w-8"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 text-sm text-slate-200 leading-relaxed font-normal bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/30 min-h-[60px]">
          {loading && !digest ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>Analyzing tasks & generating briefing...</span>
            </div>
          ) : (
            <div className="whitespace-pre-line">{digest}</div>
          )}
        </div>
      )}
    </div>
  );
};
