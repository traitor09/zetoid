'use client';

import { formatDueDate, getPriorityBadgeProps } from '@/lib/utils';
import { deleteTaskAction, toggleTaskAction, updateTaskAction } from '@/server/actions';
import { Task } from '@/types/task';
import { Calendar, Check, Edit2, Save, Tag, Trash2, X } from 'lucide-react';
import React, { useOptimistic, useState, useTransition } from 'react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  );
  const [editTags, setEditTags] = useState(task.tags.join(', '));

  // Optimistic state for done status
  const [optimisticDone, setOptimisticDone] = useOptimistic(
    task.done,
    (_current, newDone: boolean) => newDone,
  );

  const handleToggle = () => {
    const nextDone = !optimisticDone;
    startTransition(async () => {
      setOptimisticDone(nextDone);
      try {
        await toggleTaskAction(task.id, nextDone);
      } catch (err) {
        console.error('Failed to toggle task:', err);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTaskAction(task.id);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    const parsedTags = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      try {
        await updateTaskAction(task.id, {
          title: editTitle.trim(),
          priority: editPriority,
          dueDate: editDueDate || null,
          tags: parsedTags,
        });
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update task:', err);
      }
    });
  };

  const badgeProps = getPriorityBadgeProps(task.priority);
  const formattedDate = formatDueDate(task.dueDate);

  return (
    <div
      className={`group relative glass-card rounded-xl p-4 transition-all duration-200 border ${
        optimisticDone
          ? 'bg-slate-900/40 border-emerald-950/20 opacity-70'
          : 'bg-emerald-950/20 border-emerald-900/30 hover:border-emerald-800/60'
      }`}
    >
      {!isEditing ? (
        <div className="flex items-center justify-between gap-3">
          {/* Left: Checkbox & Task Title */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={handleToggle}
              disabled={isPending}
              className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                optimisticDone
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                  : 'border-emerald-800/80 hover:border-emerald-400 bg-emerald-950/60'
              }`}
            >
              {optimisticDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </button>

            <div className="min-w-0 flex-1">
              <span
                className={`text-sm sm:text-base font-medium transition-all block truncate ${
                  optimisticDone ? 'line-through text-slate-500' : 'text-slate-100'
                }`}
              >
                {task.title}
              </span>

              {/* Task Meta (Date & Tags & Priority) */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge
                  variant={task.priority === 1 ? 'high' : task.priority === 5 ? 'low' : 'medium'}
                  size="sm"
                >
                  {badgeProps.label}
                </Badge>

                {formattedDate && (
                  <Badge variant="default" size="sm" className="text-slate-400">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {formattedDate}
                  </Badge>
                )}

                {task.tags && task.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="emerald" size="sm">
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="p-1.5 h-8 w-8 text-slate-400 hover:text-white"
              title="Edit Task"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="p-1.5 h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
              title="Delete Task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Edit Mode Form */
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-slate-950 border border-emerald-500/50 text-slate-100 rounded-lg p-2.5 text-sm focus:outline-none"
            placeholder="Task title"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label
                htmlFor={`edit-priority-${task.id}`}
                className="text-[10px] font-medium text-slate-400 mb-1 block"
              >
                Priority
              </label>
              <select
                id={`edit-priority-${task.id}`}
                value={editPriority}
                onChange={(e) => setEditPriority(Number(e.target.value))}
                className="w-full bg-slate-950 border border-emerald-900/40 text-slate-200 rounded-lg text-xs p-2"
              >
                <option value={1}>High (P1)</option>
                <option value={3}>Medium (P2)</option>
                <option value={5}>Low (P3)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`edit-date-${task.id}`}
                className="text-[10px] font-medium text-slate-400 mb-1 block"
              >
                Due Date
              </label>
              <input
                id={`edit-date-${task.id}`}
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-900/40 text-slate-200 rounded-lg text-xs p-2"
              />
            </div>

            <div>
              <label
                htmlFor={`edit-tags-${task.id}`}
                className="text-[10px] font-medium text-slate-400 mb-1 block"
              >
                Tags (comma separated)
              </label>
              <input
                id={`edit-tags-${task.id}`}
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-900/40 text-slate-200 rounded-lg text-xs p-2"
                placeholder="work, meeting"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="text-xs"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="text-xs">
              <Save className="h-3.5 w-3.5" /> Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
