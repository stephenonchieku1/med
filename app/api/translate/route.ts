import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const HF_API_KEY = process.env.HF_API_KEY;
const NLLB_MODEL = 'facebook/nllb-200-distilled-1.3B';

const hf = new HfInference(HF_API_KEY);

// Map of language codes to NLLB language codes
const LANGUAGE_MAP: { [key: string]: string } = {
  'en': 'eng_Latn',
  'es': 'spa_Latn',
  'fr': 'fra_Latn',
  'de': 'deu_Latn',
  'zh': 'zho_Hans',
  'ar': 'ara_Arab',
  'hi': 'hin_Deva',
  'sw': 'swh_Latn',
  'pt': 'por_Latn',
  'ru': 'rus_Cyrl',
  'ja': 'jpn_Jpan',
  'ko': 'kor_Hang',
  'it': 'ita_Latn',
  'nl': 'nld_Latn',
  'tr': 'tur_Latn',
  'ki': 'kik_Latn',  // Kikuyu
  'luo': 'luo_Latn', // Luo
};

export async function POST(req: Request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const sourceCode = LANGUAGE_MAP[sourceLanguage];
    const targetCode = LANGUAGE_MAP[targetLanguage];

    if (!sourceCode || !targetCode) {
      return NextResponse.json(
        { error: 'Unsupported language pair' },
        { status: 400 }
      );
    }

    const response = await hf.translation({
      model: NLLB_MODEL,
      inputs: text,
      parameters: {
        source_language: sourceCode,
        target_language: targetCode,
      },
    });

    return NextResponse.json({ translation: response.translation_text });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
} 