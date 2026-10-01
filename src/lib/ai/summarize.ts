import { Task } from '@/types/task';
import { streamText } from 'ai';
import { model } from './provider';

export async function summarizeDailyTasks(tasks: Task[]) {
  const pendingTasks = tasks.filter((t) => !t.done);
  const completedToday = tasks.filter((t) => t.done);

  const taskSummary = pendingTasks.map((t) => ({
    title: t.title,
    priority: t.priority === 1 ? 'High' : t.priority === 3 ? 'Medium' : 'Low',
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : 'No date',
    tags: t.tags.join(', '),
  }));

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    // Return mock stream fallback if API key is absent
    const mockText = `Good day! You have ${pendingTasks.length} pending task(s) and completed ${completedToday.length} task(s). Focus on your highest priority items first!`;
    return {
      stream: null,
      fallbackText: mockText,
    };
  }

  const prompt = `Here is the user's current task list:
Pending Tasks (${pendingTasks.length}):
${JSON.stringify(taskSummary, null, 2)}

Completed Tasks recently (${completedToday.length}).

Please generate a brief (2-3 sentences), upbeat, action-oriented daily briefing. Highlight high-priority items if any exist. Keep it encouraging and bulleted.`;

  const result = streamText({
    model,
    system:
      'You are Zetoid AI companion, an encouraging productivity assistant. Keep daily digests concise, clear, and inspiring.',
    prompt,
  });

  return {
    stream: result,
    fallbackText: null,
  };
}
