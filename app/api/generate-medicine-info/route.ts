export const runtime = 'edge';

// Mock database of medicine information
const medicineDatabase = {
  'quinine': {
    id: 'quinine-001',
    name: 'Quinine',
    overview: 'Quinine is a medication used to treat malaria and babesiosis.',
    ingredients: {
      active: ['Quinine sulfate'],
      inactive: ['Starch', 'Magnesium stearate', 'Talc']
    },
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Headache',
      'Cardiac arrhythmias',
      'Thrombocytopenia'
    ],
    primaryUses: [
      'Treatment of malaria',
      'Management of muscle cramps',
      'Prevention of leg cramps'
    ],
    conditionsTreated: [
      'Malaria',
      'Babesiosis',
      'Nocturnal leg cramps'
    ],
    additionalUses: [
      'Treatment of certain parasitic infections',
      'Management of fever in malaria patients'
    ],
    mechanismOfAction: 'Quinine works by interfering with the growth and reproduction of the malaria parasite in red blood cells. It also affects the excitability of muscle fibers, which helps with muscle cramps.',
    dosageInfo: 'The typical dosage for malaria treatment is 600-650mg every 8 hours for 7 days. For leg cramps, the dosage is typically 200-300mg at bedtime. Always follow your healthcare provider\'s instructions.',
    contraindications: [
      'History of quinine hypersensitivity',
      'Severe kidney or liver disease',
      'Blood disorders',
      'Pregnancy (especially first trimester)',
      'History of thrombocytopenia'
    ],
    herbalAlternatives: [
      'Artemisia annua (Sweet wormwood)',
      'Cinchona bark'
    ],
    personalizedInfo: 'Quinine is a medication that is often used to treat malaria, a disease that is spread through the bites of infected mosquitoes. It is also sometimes used to relieve muscle cramps and prevent leg cramps in people with certain medical conditions. However, it is important to note that quinine can have serious side effects and should only be used under the supervision of a healthcare professional.'
  },
  'aspirin': {
    id: 'aspirin-001',
    name: 'Aspirin',
    overview: 'Aspirin is used to reduce fever and relieve mild to moderate pain.',
    ingredients: {
      active: ['Acetylsalicylic acid'],
      inactive: ['Cellulose', 'Corn starch', 'Hypromellose']
    },
    sideEffects: [
      'Upset stomach',
      'Heartburn',
      'Stomach bleeding',
      'Allergic reactions'
    ],
    primaryUses: [
      'Pain relief',
      'Fever reduction',
      'Anti-inflammatory'
    ],
    conditionsTreated: [
      'Headaches',
      'Muscle aches',
      'Arthritis',
      'Fever'
    ],
    additionalUses: [
      'Blood thinning',
      'Prevention of heart attacks',
      'Prevention of strokes'
    ],
    mechanismOfAction: 'Aspirin works by inhibiting the production of prostaglandins, which are chemicals that cause pain, fever, and inflammation. It also helps prevent blood clots by making platelets less sticky.',
    dosageInfo: 'For adults and children 12 years and older: 325-650mg every 4-6 hours as needed, not exceeding 4000mg in 24 hours. For children under 12: consult a healthcare provider for appropriate dosage.',
    contraindications: [
      'Allergy to aspirin',
      'Bleeding disorders',
      'Stomach ulcers',
      'Asthma',
      'Pregnancy (especially third trimester)'
    ],
    herbalAlternatives: [
      'Willow bark',
      'White willow'
    ],
    personalizedInfo: 'Aspirin is a common over-the-counter medication used to relieve pain, reduce fever, and decrease inflammation. It is also used in low doses to prevent heart attacks and strokes in people at high risk. However, it can cause stomach irritation and should be used with caution in people with certain medical conditions.'
  },
  'paracetamol': {
    id: 'paracetamol-001',
    name: 'Paracetamol',
    overview: 'Paracetamol is used to treat pain and fever.',
    ingredients: {
      active: ['Paracetamol'],
      inactive: ['Pregelatinized starch', 'Potato starch', 'Stearic acid']
    },
    sideEffects: [
      'Nausea',
      'Stomach pain',
      'Liver damage',
      'Allergic reactions'
    ],
    primaryUses: [
      'Pain relief',
      'Fever reduction'
    ],
    conditionsTreated: [
      'Headaches',
      'Muscle aches',
      'Arthritis',
      'Backaches',
      'Toothaches',
      'Colds',
      'Fevers'
    ],
    additionalUses: [
      'Post-surgical pain management',
      'Post-vaccination fever'
    ],
    mechanismOfAction: 'Paracetamol works by inhibiting the production of prostaglandins in the brain, which are chemicals that cause pain and fever. It is thought to work primarily in the central nervous system.',
    dosageInfo: 'For adults and children 12 years and older: 500-1000mg every 4-6 hours as needed, not exceeding 4000mg in 24 hours. For children under 12: consult a healthcare provider for appropriate dosage.',
    contraindications: [
      'Severe liver disease',
      'Allergy to paracetamol',
      'Alcohol abuse'
    ],
    herbalAlternatives: [
      'Willow bark',
      'Ginger',
      'Turmeric'
    ],
    personalizedInfo: 'Paracetamol (also known as acetaminophen) is a common over-the-counter medication used to relieve pain and reduce fever. It is generally safe when used as directed, but it\'s important to be aware of the maximum daily dose to avoid liver damage.'
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { medicineName } = body;

    if (!medicineName) {
      return new Response(
        JSON.stringify({ error: 'Medicine name is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Normalize medicine name
    const normalizedName = medicineName.toLowerCase().trim();
    
    // Look up in our database
    const medicineInfo = medicineDatabase[normalizedName];
    
    if (!medicineInfo) {
      return new Response(
        JSON.stringify({ error: 'Medicine not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(medicineInfo),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating medicine info:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 