import { NextResponse } from 'next/server';
import { getTranslation } from '../../translations';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, language, healthConditions, allergies } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Construct a context-aware prompt
    let contextPrompt = '';
    if (healthConditions?.length) {
      contextPrompt = `You are speaking with a patient with the following characteristics:\n`;
      contextPrompt += `- Current Health Conditions: ${healthConditions.join(', ')}\n`;
    }
    if (allergies?.length) {
      contextPrompt += `- Allergies: ${allergies.join(', ')}\n`;
    }
    if (healthConditions?.length || allergies?.length) {
      contextPrompt += '\nPlease provide responses that take into account these factors and any potential interactions or considerations.\n\n';
    }

    // Create a language-specific system prompt
    const systemPrompt = `You are Medlex.ai, a helpful healthcare assistant. Your role is to:
1. Always introduce yourself as "Medlex.ai" in your first response
2. Provide general health information and guidance
3. Help users understand medication information
4. Explain medical terms in simple language
5. Always recommend consulting healthcare professionals for specific medical advice
6. Be empathetic and supportive while maintaining professionalism
7. Never provide specific medical diagnoses or treatment plans

Important disclaimers to include when relevant:
- "This information is for general guidance only"
- "Please consult with your healthcare provider for personalized advice"
- "In case of emergency, seek immediate medical attention"

IMPORTANT: 
- You must respond ONLY in ${language} language. Do not mix languages in your response.
- When greeting in Swahili, use "Habari! Mimi ni Medlex.ai, msaidizi wako wa afya." as your introduction.
- Always maintain a professional and helpful tone while being culturally appropriate.`;

    if (!TOGETHER_API_KEY) {
      console.error('Together API key is not configured');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `${contextPrompt}User message: ${message}`
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
    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 