import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // TODO: Implement search logic
    return NextResponse.json({
      results: [
        {
          name: 'Sample Medicine',
          description: 'Sample description',
          category: 'Sample category'
        }
      ]
    });
  } catch (error) {
    console.error('Error in search route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 