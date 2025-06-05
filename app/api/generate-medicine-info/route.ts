import { NextResponse } from 'next/server';
import axios from 'axios';

// FDA API base URL
const FDA_API_BASE = 'https://api.fda.gov/drug/label.json';

// Helper function to summarize FDA data using AI
async function summarizeFDAData(fdaData: any) {
  const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
  const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

  if (!TOGETHER_API_KEY) {
    console.error('Together API key is not configured');
    return null;
  }

  try {
    // Extract all relevant text from FDA data
    const results = fdaData.results[0];
    const textToSummarize = `
      Indications: ${results.indications_and_usage?.join(' ') || ''}
      Warnings: ${results.warnings?.join(' ') || ''}
      Adverse Reactions: ${results.adverse_reactions?.join(' ') || ''}
      Drug Interactions: ${results.drug_interactions?.join(' ') || ''}
      Dosage: ${results.dosage_and_administration?.join(' ') || ''}
      Clinical Pharmacology: ${results.clinical_pharmacology?.join(' ') || ''}
      Active Ingredients: ${results.openfda?.active_ingredient?.join(', ') || ''}
      Inactive Ingredients: ${results.openfda?.inactive_ingredient?.join(', ') || ''}
    `;

    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: `You are a medical information summarizer. Your task is to analyze FDA drug label data and provide a clear, structured summary. Format your response exactly as follows:

PRIMARY USES:
• [List 3-5 main uses in bullet points]

MECHANISM OF ACTION:
• [1-2 bullet points explaining how the drug works]

DOSAGE INFORMATION:
• [List key dosage points in bullet format]
• Include standard adult dose
• Include any special instructions
• Include maximum daily dose if applicable

SIDE EFFECTS:
• Common: [List 3-5 most common side effects]
• Serious: [List 2-3 serious side effects that need immediate attention]
• Rare: [List 1-2 rare but important side effects]

IMPORTANT WARNINGS:
• [List 3-5 most critical warnings]

DRUG INTERACTIONS:
• [List 3-5 most important drug interactions]

Use simple, patient-friendly language. Focus on the most important information. If certain information is not available, indicate "Information not provided" for that section.`
          },
          {
            role: 'user',
            content: textToSummarize
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Together AI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing FDA data:', error);
    return null;
  }
}

// Helper function to extract relevant information from FDA data
async function extractMedicineInfo(fdaData: any) {
  const results = fdaData.results[0];
  
  // Extract active ingredients
  const activeIngredients = results.openfda?.active_ingredient || [];
  const inactiveIngredients = results.openfda?.inactive_ingredient || [];
  
  // Extract warnings and adverse reactions
  const warnings = results.warnings || [];
  const adverseReactions = results.adverse_reactions || [];
  
  // Extract drug interactions
  const drugInteractions = results.drug_interactions || [];
  
  // Extract dosage and administration
  const dosageAndAdmin = results.dosage_and_administration || [];
  
  // Extract clinical pharmacology
  const clinicalPharm = results.clinical_pharmacology || [];
  
  // Extract indications and usage
  const indications = results.indications_and_usage || [];

  // Get AI-generated summary
  const aiSummary = await summarizeFDAData(fdaData);

  return {
    primaryUses: indications,
    conditionsTreated: results.openfda?.indication || [],
    additionalUses: results.openfda?.pharm_class_epc || [],
    mechanismOfAction: clinicalPharm,
    dosageInfo: dosageAndAdmin,
    contraindications: warnings,
    sideEffects: adverseReactions,
    drugInteractions: drugInteractions,
    ingredients: {
      active: activeIngredients,
      inactive: inactiveIngredients
    },
    personalizedInfo: aiSummary || `This medication is used to treat ${indications.join(', ')}. It contains the following active ingredients: ${activeIngredients.join(', ')}. Important safety information: ${warnings.join(' ')}. Common side effects may include: ${adverseReactions.join(', ')}. Always consult your healthcare provider before taking this medication.`
  };
}

// Mock database for common medicines
const mockDatabase = {
  'quinine': {
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
    sideEffects: [
      'Headache',
      'Dizziness',
      'Nausea',
      'Ringing in ears',
      'Vision changes',
      'Irregular heartbeat'
    ],
    drugInteractions: [
      'Anticoagulants',
      'Certain antibiotics',
      'Antidepressants'
    ],
    ingredients: {
      active: ['Quinine sulfate'],
      inactive: ['Starch', 'Magnesium stearate', 'Talc']
    },
    herbalAlternatives: [
      'Cinchona bark',
      'Artemisia annua',
      'Andrographis paniculata'
    ],
    personalizedInfo: `Quinine is a medication that is often used to treat malaria, a disease that is spread through the bites of infected mosquitoes. It is also sometimes used to relieve muscle cramps and prevent leg cramps in people with certain medical conditions. However, it is important to note that quinine can have serious side effects and should only be used under the supervision of a healthcare professional.`
  },
  'paracetamol': {
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
    sideEffects: [
      'Nausea',
      'Stomach pain',
      'Loss of appetite',
      'Dark urine',
      'Yellowing of skin or eyes'
    ],
    drugInteractions: [
      'Warfarin',
      'Alcohol',
      'Other products containing paracetamol'
    ],
    ingredients: {
      active: ['Paracetamol'],
      inactive: ['Pregelatinized starch', 'Potato starch', 'Stearic acid']
    },
    herbalAlternatives: [
      'Willow bark',
      'Turmeric',
      'Ginger',
      'Boswellia'
    ],
    personalizedInfo: `Paracetamol (also known as acetaminophen) is a common over-the-counter medication used to relieve pain and reduce fever. It is generally safe when used as directed, but it's important to be aware of the maximum daily dose to avoid liver damage.`
  }
};

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { medicineName } = body;

    if (!medicineName) {
      return NextResponse.json(
        { error: 'Medicine name is required' },
        { status: 400 }
      );
    }

    // TODO: Implement medicine info generation logic
    return NextResponse.json({
      name: medicineName,
      overview: 'Generated medicine information',
      ingredients: [],
      sideEffects: [],
      herbalAlternatives: []
    });
  } catch (error) {
    console.error('Error generating medicine info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 