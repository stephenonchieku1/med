import React from 'react';
import { Language } from '../context/UserContext';
import { useTranslation } from '../hooks/useTranslation';

interface TranslatedTextProps {
  translationKey: string;
  language: Language;
  className?: string;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  translationKey,
  language,
  className
}) => {
  const translatedText = useTranslation(translationKey, language);
  return <span className={className}>{translatedText}</span>;
}; 