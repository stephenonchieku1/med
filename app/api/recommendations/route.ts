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
    const { healthConditions, allergies, recentlyViewed } = body;

    if (!healthConditions || !Array.isArray(healthConditions)) {
      return NextResponse.json(
        { error: 'Health conditions array is required' },
        { status: 400 }
      );
    }

    // Filter out medicines that the user is allergic to
    const safeMedicines = medicines.filter(medicine => 
      !allergies?.some(allergy => 
        medicine.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(allergy.toLowerCase())
        )
      )
    );

    // Calculate relevance for each medicine
    const recommendations = safeMedicines
      .map(medicine => ({
        ...medicine,
        relevance: calculateRelevance(medicine, healthConditions, recentlyViewed || [])
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3); // Return top 3 recommendations

    return NextResponse.json(recommendations);
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