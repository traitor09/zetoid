import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseTags } from '@/lib/utils';
import { summarizeDailyTasks } from '@/lib/ai/summarize';

export async function GET() {
  try {
    const rawTasks = await prisma.task.findMany({
      take: 25,
      orderBy: [{ done: 'asc' }, { priority: 'asc' }, { createdAt: 'desc' }],
    });

    const tasks = rawTasks.map((t) => ({ ...t, tags: parseTags(t.tags) }));
    const { stream, fallbackText } = await summarizeDailyTasks(tasks);

    if (stream) return stream.toTextStreamResponse();

    return new Response(fallbackText || 'No tasks summary available.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('API /api/ai/summarize GET error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const rawTasks = await prisma.task.findMany({
      take: 30,
      orderBy: [{ done: 'asc' }, { priority: 'asc' }],
    });

    const tasks = rawTasks.map((t) => ({ ...t, tags: parseTags(t.tags) }));
    const { stream, fallbackText } = await summarizeDailyTasks(tasks);

    if (stream) return stream.toTextStreamResponse();

    return new Response(fallbackText || 'Daily digest generated successfully.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('API /api/ai/summarize POST error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
