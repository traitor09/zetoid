'use client';

import { Task, TaskFilter } from '@/types/task';
import { AlertTriangle, Calendar, CheckCircle2, Layers, Search, Sparkles } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { TaskItem } from './TaskItem';
import { Input } from './ui/Input';

interface TaskListProps {
  initialTasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ initialTasks }) => {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const totalCount = initialTasks.length;
  const completedCount = initialTasks.filter((t) => t.done).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = initialTasks.filter((t) => !t.done && t.priority === 1).length;

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((task) => {
      // Search filter
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Status/Date filter
      if (filter === 'completed') return task.done;
      if (filter === 'high') return !task.done && task.priority === 1;

      if (filter === 'today') {
        if (task.done || !task.dueDate) return false;
        const d = new Date(task.dueDate);
        const today = new Date();
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      }

      if (filter === 'upcoming') {
        if (task.done || !task.dueDate) return false;
        const d = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      }

      // Default 'all': show pending tasks first, completed tasks later
      return true;
    });
  }, [initialTasks, filter, searchQuery]);

  return (
    <div className="space-y-6 w-full">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Tasks', count: pendingCount, icon: Layers },
            { id: 'today', label: 'Today', icon: Calendar },
            { id: 'high', label: 'High Priority', count: highPriorityCount, icon: AlertTriangle },
            { id: 'upcoming', label: 'Upcoming', icon: Sparkles },
            { id: 'completed', label: 'Completed', count: completedCount, icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as TaskFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
                    : 'bg-emerald-950/20 text-slate-400 hover:text-slate-200 hover:bg-emerald-900/30 border border-emerald-900/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-emerald-500/30 text-emerald-200'
                        : 'bg-emerald-950/60 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <Input
            icon={<Search className="h-4 w-4 text-emerald-400/80" />}
            placeholder="Search tasks or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Task List Grid/Column */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3 w-full">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center border border-emerald-900/30 my-6 w-full">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-200 mb-1">
            {searchQuery
              ? `No tasks matching "${searchQuery}"`
              : filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'high'
                  ? 'No high priority tasks'
                  : 'No tasks found'}
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search keywords or tags.'
              : 'Add your first task above using natural language like "Submit report tomorrow priority high #work".'}
          </p>
        </div>
      )}
    </div>
  );
};
