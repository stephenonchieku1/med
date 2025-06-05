import { NextResponse } from 'next/server';
import { getTranslation } from '../../translations';

interface RecommendationRequest {
  healthConditions: string[];
  allergies: string[];
  recentlyViewed: string[];
}

// Mock medicine database - in a real app, this would be in a database
const medicines = [
  {
    id: '1',
    name: 'Paracetamol',
    overview: 'Pain reliever and fever reducer',
    ingredients: ['Paracetamol'],
    sideEffects: ['Nausea', 'Liver problems'],
    herbalAlternatives: ['Willow bark', 'Ginger'],
    conditions: ['Pain', 'Fever'],
    contraindications: ['Liver disease'],
  },
  {
    id: '2',
    name: 'Ibuprofen',
    overview: 'Non-steroidal anti-inflammatory drug',
    ingredients: ['Ibuprofen'],
    sideEffects: ['Stomach pain', 'Heartburn'],
    herbalAlternatives: ['Turmeric', 'Boswellia'],
    conditions: ['Pain', 'Inflammation'],
    contraindications: ['Stomach ulcers'],
  },
  // Add more medicines as needed
];

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms, healthConditions, allergies } = body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { error: 'Symptoms array is required' },
        { status: 400 }
      );
    }

    // TODO: Implement recommendations logic
    return NextResponse.json({
      recommendations: [
        {
          name: 'Sample Medicine',
          description: 'Sample description',
          dosage: 'Sample dosage',
          warnings: ['Sample warning']
        }
      ]
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateRelevance(medicine: any, healthConditions: string[], recentlyViewed: string[]): number {
  let relevance = 0;

  // Higher relevance for medicines that treat more of the user's conditions
  const matchingConditions = medicine.conditions.filter(condition =>
    healthConditions.some(userCondition => userCondition.toLowerCase().includes(condition.toLowerCase()))
  );
  relevance += matchingConditions.length * 2;

  // Lower relevance for recently viewed medicines
  if (recentlyViewed.includes(medicine.id)) {
    relevance -= 1;
  }

  // Add some randomness to avoid always showing the same recommendations
  relevance += Math.random();

  return relevance;
} 