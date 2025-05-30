import { NextResponse } from 'next/server';
import axios from 'axios';

// FDA API base URL
const FDA_API_BASE = 'https://api.fda.gov/drug/label.json';

// Helper function to extract relevant information from FDA data
function extractMedicineInfo(fdaData: any) {
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
    personalizedInfo: `This medication is used to treat ${indications.join(', ')}. It contains the following active ingredients: ${activeIngredients.join(', ')}. Important safety information: ${warnings.join(' ')}. Common side effects may include: ${adverseReactions.join(', ')}. Always consult your healthcare provider before taking this medication.`
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

export async function POST(request: Request) {
  try {
    const { medicineName, extractedText, userPreferences } = await request.json();

    if (!medicineName && !extractedText) {
      return NextResponse.json({
        error: 'Either medicine name or extracted text is required'
      }, { status: 400 });
    }

    // Normalize medicine name
    const normalizedName = (medicineName || extractedText).toLowerCase().trim();

    // Try to fetch data from FDA API
    let fdaData = null;
    try {
      // First try with brand name
      const brandResponse = await axios.get(FDA_API_BASE, {
        params: {
          search: `brand_name:${normalizedName}`,
          limit: 1
        }
      });
      
      if (brandResponse.data.results && brandResponse.data.results.length > 0) {
        fdaData = brandResponse.data;
      } else {
        // If no results, try with generic name
        const genericResponse = await axios.get(FDA_API_BASE, {
          params: {
            search: `generic_name:${normalizedName}`,
            limit: 1
          }
        });
        
        if (genericResponse.data.results && genericResponse.data.results.length > 0) {
          fdaData = genericResponse.data;
        }
      }
    } catch (error) {
      console.error('Error fetching from FDA API:', error);
    }

    // If FDA API doesn't have data, use our mock database
    if (!fdaData) {
      // Try to find a match in the mock database
      const mockInfo = Object.entries(mockDatabase).find(([key]) => 
        normalizedName.includes(key) || key.includes(normalizedName)
      )?.[1];

      if (!mockInfo) {
        return NextResponse.json({
          error: 'Medicine information not available'
        }, { status: 404 });
      }

      return NextResponse.json(mockInfo);
    }

    // Process FDA data
    const medicineInfo = extractMedicineInfo(fdaData);
    return NextResponse.json(medicineInfo);

  } catch (error) {
    console.error('Error generating medicine info:', error);
    return NextResponse.json({
      error: 'Failed to generate medicine information'
    }, { status: 500 });
  }
} 