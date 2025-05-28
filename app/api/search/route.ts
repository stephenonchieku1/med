import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Here you would typically integrate with a medical database or AI service
    // For now, we'll return mock data
    const mockResponse = {
      overview: `Information about ${query}. This medicine is commonly used for treating various conditions. Always consult with a healthcare professional before use.`,
      ingredients: [
        "Active Ingredient 1",
        "Active Ingredient 2",
        "Inactive Ingredient 1",
        "Inactive Ingredient 2"
      ],
      sideEffects: [
        "Common: Headache, nausea",
        "Serious: Allergic reactions (rare)",
        "Other: Drowsiness, dizziness"
      ],
      herbalAlternatives: [
        "Ginger: Natural anti-inflammatory",
        "Turmeric: Pain relief properties",
        "Peppermint: Digestive aid"
      ]
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error searching medicine:', error);
    return NextResponse.json(
      { error: 'Failed to search medicine' },
      { status: 500 }
    );
  }
} 