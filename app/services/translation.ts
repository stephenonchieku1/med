import { Language } from '../context/UserContext';

// Cache for translations to avoid unnecessary API calls
const translationCache = new Map<string, string>();

export async function translateText(text: string, sourceLanguage: Language, targetLanguage: Language): Promise<string> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLanguage,
        targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

export function getCachedTranslation(
  text: string,
  sourceLanguage: Language,
  targetLanguage: Language
): string {
  const cacheKey = `${text}:${sourceLanguage}:${targetLanguage}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // For initial render, return the text as is
  // The actual translation will be handled by the useEffect hook
  return text;
}

export function setCachedTranslation(
  text: string,
  sourceLanguage: Language,
  targetLanguage: Language,
  translation: string
): void {
  const cacheKey = `${text}:${sourceLanguage}:${targetLanguage}`;
  translationCache.set(cacheKey, translation);
} 