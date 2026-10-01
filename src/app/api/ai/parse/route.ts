import { parseTaskWithAI } from '@/lib/ai/parseTask';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const parseInputSchema = z.object({
  text: z.string().min(1, 'Text input is required'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = parseInputSchema.parse(body);

    const parsedTask = await parseTaskWithAI(text);
    return NextResponse.json({ parsed: parsedTask });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('API /api/ai/parse POST error:', error);
    return NextResponse.json({ error: 'Failed to parse task with AI' }, { status: 500 });
  }
}
