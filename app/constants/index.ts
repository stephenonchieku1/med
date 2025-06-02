export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ki', name: 'Kikuyu' },
  { code: 'luo', name: 'Luo' }
] as const;

export const AGE_RANGES = [
  { value: '0-12', label: '0-12 years' },
  { value: '13-17', label: '13-17 years' },
  { value: '18-24', label: '18-24 years' },
  { value: '25-34', label: '25-34 years' },
  { value: '35-44', label: '35-44 years' },
  { value: '45-54', label: '45-54 years' },
  { value: '55-64', label: '55-64 years' },
  { value: '65+', label: '65+ years' }
] as const;

export const COMMON_MEDICAL_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Arthritis',
  'Depression',
  'Anxiety',
  'Thyroid Disorder',
  'Cancer',
  'HIV/AIDS',
  'Epilepsy',
  'Multiple Sclerosis',
  'Parkinson\'s Disease',
  'Alzheimer\'s Disease',
  'Chronic Kidney Disease',
  'Liver Disease',
  'COPD',
  'Osteoporosis',
  'Rheumatoid Arthritis',
  'Fibromyalgia'
] as const;

export const DIET_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' }
] as const;

export const EXERCISE_LEVELS = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'heavy', label: 'Heavy' }
] as const;

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  SEARCH: '/api/search',
  ANALYZE: '/api/analyze',
  RECOMMENDATIONS: '/api/recommendations'
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']; 