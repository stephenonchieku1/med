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

export async function POST(request: Request) {
  try {
    const { healthConditions, allergies, recentlyViewed } = await request.json() as RecommendationRequest;

    // Filter medicines based on health conditions and allergies
    const recommendations = medicines
      .filter(medicine => {
        // Don't recommend medicines that are contraindicated for the user's conditions
        const hasContraindication = medicine.contraindications.some(contra =>
          healthConditions.some(condition => condition.toLowerCase().includes(contra.toLowerCase()))
        );
        if (hasContraindication) return false;

        // Don't recommend medicines that contain allergens
        const hasAllergen = medicine.ingredients.some(ingredient =>
          allergies.some(allergy => ingredient.toLowerCase().includes(allergy.toLowerCase()))
        );
        if (hasAllergen) return false;

        // Prioritize medicines that treat the user's conditions
        const treatsCondition = medicine.conditions.some(condition =>
          healthConditions.some(userCondition => userCondition.toLowerCase().includes(condition.toLowerCase()))
        );
        return treatsCondition;
      })
      .map(medicine => ({
        ...medicine,
        relevance: calculateRelevance(medicine, healthConditions, recentlyViewed),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5); // Return top 5 recommendations

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
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