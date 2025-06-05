import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, targetLanguage } = body;

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    // TODO: Implement translation logic
    return NextResponse.json({
      translatedText: `Translated: ${text}`,
      sourceLanguage: 'en',
      targetLanguage
    });
  } catch (error) {
    console.error('Error in translate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 