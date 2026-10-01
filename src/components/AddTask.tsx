'use client';

import { createTaskAction, parseNaturalLanguageAction } from '@/server/actions';
import { ParsedTask } from '@/types/task';
import { AlertCircle, Calendar, Loader2, Plus, Sparkles, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface AddTaskProps {
  onSuccess?: () => void;
  autoFocus?: boolean;
}

export const AddTask: React.FC<AddTaskProps> = ({ onSuccess, autoFocus = false }) => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isParsing, setIsParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedTask | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);

  // Manual fields state
  const [manualTitle, setManualTitle] = useState('');
  const [manualDueDate, setManualDueDate] = useState('');
  const [manualPriority, setManualPriority] = useState<number>(3);
  const [manualTagInput, setManualTagInput] = useState('');

  const handleSmartParse = async () => {
    if (!input.trim()) return;
    setIsParsing(true);
    setErrorMsg(null);
    try {
      const result = await parseNaturalLanguageAction(input);
      setParsed(result);
      setManualTitle(result.title);
      setManualDueDate(result.dueDate || '');
      setManualPriority(result.priority || 3);
      setManualTagInput(result.tags ? result.tags.join(', ') : '');
    } catch (err) {
      console.error('Parse error:', err);
      setErrorMsg('Failed to parse with AI. Standard task creation enabled.');
      setParsed({
        title: input.trim(),
        dueDate: null,
        priority: 3,
        tags: [],
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = manualTitle || parsed?.title || input.trim();
    if (!finalTitle) {
      setErrorMsg('Please enter a task title');
      return;
    }

    const tagsArray = manualTagInput
      ? manualTagInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : parsed?.tags || [];

    const dueDateValue = manualDueDate || parsed?.dueDate || null;
    const priorityValue = manualPriority || parsed?.priority || 3;

    startTransition(async () => {
      try {
        await createTaskAction({
          title: finalTitle,
          dueDate: dueDateValue,
          priority: priorityValue,
          tags: tagsArray,
        });

        // Reset state
        setInput('');
        setParsed(null);
        setManualTitle('');
        setManualDueDate('');
        setManualPriority(3);
        setManualTagInput('');
        setManualMode(false);
        setErrorMsg(null);

        router.refresh();
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error('Task creation error:', err);
        setErrorMsg('Failed to save task to database.');
      }
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 mb-8 border border-emerald-900/40 shadow-2xl relative">
      <div className="flex items-center justify-between mb-3">
        <label
          htmlFor="task-input"
          className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Natural Language Task Capture
        </label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="text-xs text-slate-400 hover:text-emerald-300 underline transition-colors"
        >
          {manualMode ? 'Hide details' : 'Edit details manually'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative flex items-center">
          <input
            id="task-input"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (parsed) setParsed(null);
            }}
            placeholder="e.g. Call client friday 3pm priority high #work"
            autoFocus={autoFocus}
            className="w-full bg-emerald-950/20 border border-emerald-900/40 text-slate-100 placeholder-slate-500 rounded-xl py-3.5 pl-4 pr-32 text-sm sm:text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSmartParse}
              disabled={isParsing || !input.trim()}
              className="text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 text-xs px-2.5 py-1.5"
              title="Parse with AI"
            >
              {isParsing ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
              ) : (
                <Sparkles className="h-4 w-4 text-emerald-400" />
              )}
              <span className="hidden sm:inline">AI Parse</span>
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isPending || (!input.trim() && !manualTitle.trim())}
              className="py-1.5 px-3"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>

        {/* AI Parsed Live Preview Pill Chips */}
        {parsed && (
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-2 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Parsed Task Preview
              </span>
              <span className="text-[10px] text-slate-400">Click submit to save</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white text-sm bg-slate-900 px-3 py-1 rounded-lg border border-emerald-900/50">
                {parsed.title}
              </span>

              {parsed.dueDate && (
                <Badge variant="emerald" size="sm">
                  <Calendar className="h-3 w-3" />
                  {parsed.dueDate}
                </Badge>
              )}

              <Badge
                variant={parsed.priority === 1 ? 'high' : parsed.priority === 5 ? 'low' : 'medium'}
                size="sm"
              >
                Priority{' '}
                {parsed.priority === 1
                  ? 'High (P1)'
                  : parsed.priority === 5
                    ? 'Low (P3)'
                    : 'Medium (P2)'}
              </Badge>

              {parsed.tags &&
                parsed.tags.length > 0 &&
                parsed.tags.map((tag) => (
                  <Badge key={tag} variant="emerald" size="sm">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Manual Fine-Tuning Drawer */}
        {manualMode && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/40">
            <div>
              <label
                htmlFor="manual-title-input"
                className="text-[11px] font-medium text-slate-400 mb-1 block"
              >
                Task Title
              </label>
              <input
                id="manual-title-input"
                type="text"
                value={manualTitle || input}
                onChange={(e) => setManualTitle(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-900/40 text-slate-200 rounded-lg text-xs p-2 focus:outline-none focus:border-emerald-500"
                placeholder="Title"
              />
            </div>
            <div>
              <label
                htmlFor="manual-date-input"
                className="text-[11px] font-medium text-slate-400 mb-1 block"
              >
                Due Date
              </label>
              <input
                id="manual-date-input"
                type="date"
                value={manualDueDate}
                onChange={(e) => setManualDueDate(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-900/40 text-slate-200 rounded-lg text-xs p-2 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label
                htmlFor="manual-priority-select"
                className="text-[11px] font-medium text-slate-400 mb-1 block"
              >
                Priority
              </label>
              <select
                id="manual-priority-select"
                value={manualPriority}
                onChange={(e) => setManualPriority(Number(e.target.value))}
                className="w-full bg-slate-900 border border-emerald-900/40 text-slate-200 rounded-lg text-xs p-2 focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>High Priority (P1)</option>
                <option value={3}>Medium Priority (P2)</option>
                <option value={5}>Low Priority (P3)</option>
              </select>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/40">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>
    </div>
  );
};
