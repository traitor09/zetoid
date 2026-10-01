import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createTaskBodySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  dueDate: z.string().nullable().optional(),
  priority: z.number().int().min(1).max(5).optional().default(3),
  tags: z.array(z.string()).optional().default([]),
});

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [{ done: 'asc' }, { priority: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('API /api/tasks GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = createTaskBodySchema.parse(body);

    const created = await prisma.task.create({
      data: {
        title: validated.title,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        priority: validated.priority,
        tags: validated.tags,
        done: false,
      },
    });

    return NextResponse.json({ task: created });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('API /api/tasks POST error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
