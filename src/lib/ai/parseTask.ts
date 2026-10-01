import { ParsedTask } from '@/types/task';
import { generateObject } from 'ai';
import { z } from 'zod';
import { model } from './provider';

// Zod schema for structured task output
export const taskParseSchema = z.object({
  title: z
    .string()
    .describe('The main concise actionable task title, stripped of temporal/priority keywords'),
  dueDate: z
    .string()
    .nullable()
    .describe(
      'ISO 8601 string date representation (YYYY-MM-DD) if specified or relative (e.g. today, tomorrow, Friday), else null',
    ),
  priority: z
    .number()
    .int()
    .describe(
      '1 for high/urgent, 3 for medium/normal, 5 for low/casual. Default is 3 if unspecified',
    ),
  tags: z
    .array(z.string())
    .describe('Extracted tags or categories (e.g. #work -> work, call mom -> personal/family)'),
});

export async function parseTaskWithAI(input: string): Promise<ParsedTask> {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      title: '',
      dueDate: null,
      priority: 3,
      tags: [],
    };
  }

  // Fallback check if API key is not configured
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return fallbackParse(trimmed);
  }

  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const systemPrompt = `You are Zetoid AI, a task extractor.
Current local date: ${todayStr}.
Parse natural language task inputs into structured JSON:
- Extract clear task title.
- Calculate concrete ISO YYYY-MM-DD date for relative terms (e.g. "tomorrow", "next Monday", "5pm Friday"). If no time/date specified, dueDate is null.
- Priority: 1 = urgent/high/important, 3 = normal/medium, 5 = low/casual/someday.
- Tags: array of relevant context tags (without '#' prefix).`;

    const { object } = await generateObject({
      model,
      schema: taskParseSchema,
      prompt: input,
      system: systemPrompt,
    });

    return {
      title: object.title || trimmed,
      dueDate: object.dueDate ?? null,
      priority: [1, 3, 5].includes(object.priority) ? object.priority : 3,
      tags: Array.isArray(object.tags) ? object.tags : [],
    };
  } catch (error) {
    console.warn('AI Parsing failed or fallback triggered:', error);
    return fallbackParse(trimmed);
  }
}

/**
 * Deterministic fallback parser when AI is unavailable or fails.
 */
function fallbackParse(input: string): ParsedTask {
  let title = input;
  let priority = 3;
  const tags: string[] = [];
  let dueDate: string | null = null;

  // Simple priority keyword matching
  if (/!high|p1|urgent|asap|important/i.test(input)) {
    priority = 1;
    title = title.replace(/!high|p1|urgent|asap|important/gi, '');
  } else if (/!low|p3|casual|someday/i.test(input)) {
    priority = 5;
    title = title.replace(/!low|p3|casual|someday/gi, '');
  }

  // Tag extraction (#tag)
  const tagMatches = input.match(/#(\w+)/g);
  if (tagMatches) {
    tagMatches.forEach((t) => tags.push(t.substring(1)));
    title = title.replace(/#(\w+)/g, '');
  }

  // Simple date keyword matching
  const now = new Date();
  if (/today/i.test(input)) {
    dueDate = now.toISOString().split('T')[0];
    title = title.replace(/today/gi, '');
  } else if (/tomorrow/i.test(input)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    dueDate = tomorrow.toISOString().split('T')[0];
    title = title.replace(/tomorrow/gi, '');
  }

  return {
    title: title.trim() || input,
    dueDate,
    priority,
    tags,
  };
}
