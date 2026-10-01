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
    // Return mock fallback if API key is absent
    const mockText = `You have ${pendingTasks.length} pending task(s) and ${completedToday.length} completed. Stay focused on your top priority items today!`;
    return {
      stream: null,
      fallbackText: mockText,
    };
  }

  const prompt = `Here is the user's current task list:
Pending (${pendingTasks.length}): ${JSON.stringify(taskSummary)}
Completed recently: ${completedToday.length}

Write a short, crisp daily digest for the user in at most 2 sentences. Do NOT use bullet points, list items, or line breaks. Highlight the single most important task to focus on today. Keep it under 180 characters.`;

  const result = streamText({
    model,
    system:
      'You are Zetoid AI assistant. Provide short, single-paragraph daily digests (maximum 2 short sentences). Never use bullet points, markdown formatting, or line breaks.',
    prompt,
  });

  return {
    stream: result,
    fallbackText: null,
  };
}
