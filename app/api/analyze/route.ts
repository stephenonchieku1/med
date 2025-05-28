import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Here you would typically integrate with a medical database or AI service
    // For now, we'll return mock data
    const mockResponse = {
      overview: "This is a sample medicine used for treating common conditions. Always consult with a healthcare professional before use.",
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
    console.error('Error analyzing medicine:', error);
    return NextResponse.json(
      { error: 'Failed to analyze medicine' },
      { status: 500 }
    );
  }
} 