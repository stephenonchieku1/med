import { NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // TODO: Implement medicine info lookup logic
    return NextResponse.json({
      name: query,
      overview: 'Medicine information will be implemented here',
      ingredients: [],
      sideEffects: [],
      herbalAlternatives: []
    });
  } catch (error) {
    console.error('Error in medicine-info route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 