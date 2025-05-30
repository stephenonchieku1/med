import { NextResponse } from 'next/server';

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
  }
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({
        error: 'Search query is required'
      }, { status: 400 });
    }

    // Normalize search query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Search in our database
    const medicineInfo = medicineDatabase[normalizedQuery];
    
    if (!medicineInfo) {
      return NextResponse.json({
        error: 'Medicine not found'
      }, { status: 404 });
    }

    return NextResponse.json(medicineInfo);

  } catch (error) {
    console.error('Error searching medicine:', error);
    return NextResponse.json({
      error: 'Failed to search medicine'
    }, { status: 500 });
  }
} 