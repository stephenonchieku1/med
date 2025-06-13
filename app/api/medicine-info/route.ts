import { NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Mock database of medicine information
const medicineDatabase = {
  'quinine': {
    id: 'quinine-001',
    name: 'Quinine',
    overview: 'Quinine is a medication used to treat malaria and babesiosis.',
    ingredients: [
      'Active: Quinine sulfate',
      'Inactive: Starch, Magnesium stearate, Talc'
    ],
    sideEffects: [
      'Common: Nausea, vomiting, headache',
      'Severe: Cardiac arrhythmias, Thrombocytopenia'
    ],
    herbalAlternatives: [
      'Artemisia annua (Sweet wormwood)',
      'Cinchona bark'
    ]
  },
  'aspirin': {
    id: 'aspirin-001',
    name: 'Aspirin',
    overview: 'Aspirin is used to reduce fever and relieve mild to moderate pain.',
    ingredients: [
      'Active: Acetylsalicylic acid',
      'Inactive: Cellulose, Corn starch, Hypromellose'
    ],
    sideEffects: [
      'Common: Upset stomach, heartburn',
      'Severe: Stomach bleeding, Allergic reactions'
    ],
    herbalAlternatives: [
      'Willow bark',
      'White willow'
    ]
  },
  'paracetamol': {
    id: 'paracetamol-001',
    name: 'Paracetamol',
    overview: 'Paracetamol is used to treat pain and fever.',
    ingredients: [
      'Active: Paracetamol',
      'Inactive: Pregelatinized starch, Potato starch, Stearic acid'
    ],
    sideEffects: [
      'Common: Nausea, stomach pain',
      'Severe: Liver damage, Allergic reactions'
    ],
    herbalAlternatives: [
      'Willow bark',
      'Ginger',
      'Turmeric'
    ]
  }
};

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

    // Normalize search query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Search in our database
    const medicineInfo = medicineDatabase[normalizedQuery];
    
    if (!medicineInfo) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(medicineInfo);
  } catch (error) {
    console.error('Error in medicine-info route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 