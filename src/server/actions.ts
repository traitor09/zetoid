'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { parseTaskWithAI } from '@/lib/ai/parseTask';
import { Task } from '@/types/task';
import { parseTags } from '@/lib/utils';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  dueDate: z.string().nullable().optional(),
  priority: z.number().int().min(1).max(5).optional().default(3),
  tags: z.array(z.string()).optional().default([]),
});

function mapDBTaskToTask(dbTask: {
  id: string;
  title: string;
  dueDate: Date | null;
  priority: number;
  tags: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Task {
  return {
    ...dbTask,
    tags: parseTags(dbTask.tags),
  };
}

export async function getTasksAction(): Promise<Task[]> {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [
        { done: 'asc' },
        { priority: 'asc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    return tasks.map(mapDBTaskToTask);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return [];
  }
}

export async function parseNaturalLanguageAction(input: string) {
  return await parseTaskWithAI(input);
}

export async function createTaskAction(input: {
  title: string;
  dueDate?: string | null;
  priority?: number;
  tags?: string[];
}) {
  const validated = createTaskSchema.parse(input);

  const newTask = await prisma.task.create({
    data: {
      title: validated.title,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      priority: validated.priority,
      tags: JSON.stringify(validated.tags),
      done: false,
    },
  });

  revalidatePath('/');
  return mapDBTaskToTask(newTask);
}

export async function toggleTaskAction(id: string, done: boolean) {
  if (!id) throw new Error('Task ID is required');

  const updated = await prisma.task.update({
    where: { id },
    data: { done },
  });

  revalidatePath('/');
  return mapDBTaskToTask(updated);
}

export async function deleteTaskAction(id: string) {
  if (!id) throw new Error('Task ID is required');

  await prisma.task.delete({ where: { id } });

  revalidatePath('/');
  return { success: true, id };
}

export async function updateTaskAction(
  id: string,
  data: {
    title?: string;
    dueDate?: string | null;
    priority?: number;
    tags?: string[];
    done?: boolean;
  }
) {
  if (!id) throw new Error('Task ID is required');

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.dueDate !== undefined)
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
  if (data.done !== undefined) updateData.done = data.done;

  const updated = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/');
  return mapDBTaskToTask(updated);
}
