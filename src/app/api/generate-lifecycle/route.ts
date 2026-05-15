import { NextResponse } from 'next/server';
import { generateFullLifecycle } from '@/services/projectService';
import { validateProjectCharter } from '@/schemas/projectCharterSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { charter } = body;

    const validation = validateProjectCharter(charter);

    if (!validation.success) {
      return NextResponse.json({
        error: 'Invalid project charter',
        details: validation.errors
      }, { status: 400 });
    }

    const lifecycle = await generateFullLifecycle(validation.data!);

    return NextResponse.json(lifecycle);
  } catch (error) {
    console.error('Error in generate-lifecycle API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
