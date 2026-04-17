import { NextResponse } from 'next/server';

const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY,
  ...(process.env.GEMINI_API_KEYS || '').split(',').map((key) => key.trim()),
].filter((key, index, arr): key is string => Boolean(key) && arr.indexOf(key) === index);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_MODELS = [
  GEMINI_MODEL,
  ...(process.env.GEMINI_MODELS || '').split(',').map((model) => model.trim()),
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
].filter((value, index, arr) => Boolean(value) && arr.indexOf(value) === index);

export const dynamic = 'force-dynamic';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
  sw: 'Swahili',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  it: 'Italian',
  nl: 'Dutch',
  tr: 'Turkish',
  ki: 'Kikuyu',
  luo: 'Dholuo',
};

const fallbackResponse = (userMessage: string, language: string) => {
  const languageLabel = LANGUAGE_LABELS[language] || 'English';
  return [
    `Medlex.ai is currently in fallback mode while the AI provider is temporarily unavailable.`,
    `Requested language: ${languageLabel}.`,
    `General guidance for your question: "${userMessage.slice(0, 120)}${userMessage.length > 120 ? '...' : ''}"`,
    `Please consult your healthcare provider for personalized medical advice.`,
    `If symptoms are severe or urgent, seek immediate medical attention.`,
  ].join('\n');
};

const quotaExceededResponse = (language: string, retryAfterSeconds?: number) => {
  const languageLabel = LANGUAGE_LABELS[language] || 'English';
  return [
    `Medlex.ai could not reach Gemini because the current API quota is exhausted.`,
    `Requested language: ${languageLabel}.`,
    retryAfterSeconds
      ? `Please retry in about ${retryAfterSeconds} seconds, or switch to a different Gemini API key.`
      : `Please retry later, or switch to a different Gemini API key with available quota.`,
    `If this persists, check Gemini billing/quota settings for your project.`,
  ].join('\n');
};

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
    const languageLabel = LANGUAGE_LABELS[language] || 'English';
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
- You must respond ONLY in ${languageLabel}. Do not mix languages in your response.
- When greeting in Swahili, use "Habari! Mimi ni Medlex.ai, msaidizi wako wa afya." as your introduction.
- Always maintain a professional and helpful tone while being culturally appropriate.`;

    if (GEMINI_API_KEYS.length === 0) {
      console.warn('Gemini API key missing. Returning fallback response.');
      return NextResponse.json({ response: fallbackResponse(message, language), fallback: true });
    }

    const attempts: Array<{ keyIndex: number; model: string; status?: number; error?: string }> = [];
    let maxRetryAfterSeconds = 0;
    let sawQuotaExhausted = false;

    for (let keyIndex = 0; keyIndex < GEMINI_API_KEYS.length; keyIndex += 1) {
      const apiKey = GEMINI_API_KEYS[keyIndex];
      for (const model of GEMINI_MODELS) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: `${contextPrompt}User message: ${message}` }],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 700,
                },
              }),
              signal: controller.signal,
            }
          );

          if (!response.ok) {
            let providerError = '';
            try {
              providerError = JSON.stringify(await response.json());
            } catch {
              providerError = await response.text();
            }

            if (response.status === 429 && providerError.includes('RESOURCE_EXHAUSTED')) {
              sawQuotaExhausted = true;
              const retryMatch = providerError.match(/retryDelay":"(\d+)s"/);
              if (retryMatch?.[1]) {
                const seconds = Number(retryMatch[1]);
                if (!Number.isNaN(seconds)) {
                  maxRetryAfterSeconds = Math.max(maxRetryAfterSeconds, seconds);
                }
              }
            }

            attempts.push({ keyIndex, model, status: response.status, error: providerError });
            continue;
          }

          const data = await response.json();
          const content =
            data?.candidates?.[0]?.content?.parts
              ?.map((part: { text?: string }) => part?.text || '')
              .join('')
              .trim() || '';

          if (!content) {
            attempts.push({ keyIndex, model, error: 'Missing content in Gemini response' });
            continue;
          }

          return NextResponse.json({
            response: content,
            provider: 'gemini',
            model,
            keyIndex,
            fallback: keyIndex > 0 || model !== GEMINI_MODELS[0],
          });
        } catch (modelError) {
          attempts.push({
            keyIndex,
            model,
            error: modelError instanceof Error ? modelError.message : 'Unknown Gemini error',
          });
        } finally {
          clearTimeout(timeout);
        }
      }
    }

    console.error('All Gemini model attempts failed:', attempts);
    if (sawQuotaExhausted) {
      return NextResponse.json({
        response: quotaExceededResponse(language, maxRetryAfterSeconds || undefined),
        fallback: true,
        provider: 'gemini',
        reason: 'quota_exhausted',
        retryAfterSeconds: maxRetryAfterSeconds || undefined,
        providerError: process.env.NODE_ENV === 'development' ? JSON.stringify(attempts) : undefined,
      });
    }

    return NextResponse.json({
      response: fallbackResponse(message, language),
      fallback: true,
      provider: 'gemini',
      providerError: process.env.NODE_ENV === 'development' ? JSON.stringify(attempts) : undefined,
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ response: fallbackResponse('general medical question', 'en'), fallback: true });
  }
} 