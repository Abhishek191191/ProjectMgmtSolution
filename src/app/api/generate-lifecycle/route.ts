import { NextResponse } from 'next/server';
import { ProjectCharter } from '@/types';
import { generateFullLifecycle } from '@/services/projectService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { charter }: { charter: ProjectCharter } = body;

    if (!charter || !charter.title) {
      return NextResponse.json({ error: 'Valid project charter is required' }, { status: 400 });
    }

    const lifecycle = await generateFullLifecycle(charter);

    return NextResponse.json(lifecycle);
  } catch (error) {
    console.error('Error in generate-lifecycle API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
