import { useState, useEffect } from 'react';
import { Language } from '../context/UserContext';
import { getTranslation, loadTranslation } from '../translations';

export function useTranslation(key: string, language: Language) {
  const [translatedText, setTranslatedText] = useState(() => getTranslation(key, language));

  useEffect(() => {
    const loadTranslatedText = async () => {
      const translation = await loadTranslation(key, language);
      setTranslatedText(translation);
    };

    if (language !== 'en') {
      loadTranslatedText();
    }
  }, [key, language]);

  return translatedText;
} 