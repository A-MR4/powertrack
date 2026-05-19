import { NextResponse } from 'next/server';
import { addReading, getReadings } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const readings = await getReadings();
  return NextResponse.json({ readings });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (
    typeof body.consumption !== 'number' ||
    typeof body.current !== 'number' ||
    typeof body.timestamp !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Invalid payload' }, 
      { status: 400 }
    );
  }

  const reading = await addReading({
    consumption: body.consumption,
    current: body.current,
    timestamp: body.timestamp,
  });

  // Notify WebSocket server (if running) about the new reading
  try {
    await fetch('http://localhost:3001/new-reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reading }),
    });
  } catch (err) {
    // Non-fatal: WS server may not be running in all environments
    console.warn('Failed to notify WS server', err);
  }

  return NextResponse.json({ reading }, { status: 201 });
}
