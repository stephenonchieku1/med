'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar' | 'hi' | 'sw' | 'pt' | 'ru' | 'ja' | 'ko' | 'it' | 'nl' | 'tr';
export type Diet = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';
export type Theme = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';
export type ExerciseLevel = 'none' | 'light' | 'moderate' | 'heavy';
export type Sex = 'male' | 'female' | 'other';

interface Lifestyle {
  smoking: boolean;
  alcohol: boolean;
  exercise: ExerciseLevel;
  diet: Diet;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Preferences {
  language: Language;
  secondaryLanguage: Language | null;
  diet: Diet;
  theme: Theme;
  fontSize: FontSize;
  exerciseLevel: ExerciseLevel;
  healthConditions: string[];
  allergies: string[];
  savedMedicines: string[];
  recentlyViewed: string[];
  age: number;
  gender: Sex;
  ageRange: string | null;
  weight: number | null;
  height: number | null;
  lifestyle: Lifestyle;
  currentMedications: string[];
  medicalHistory: string[];
  notifications: boolean;
  emergencyContact: EmergencyContact | null;
}

interface UserContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  diet: Diet;
  setDiet: (diet: Diet) => void;
  allergies: string[];
  setAllergies: (allergies: string[]) => void;
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;
  updatePreferences: (prefs: Partial<Preferences>) => void;
  addHealthCondition: (condition: string) => void;
  removeHealthCondition: (condition: string) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  addCurrentMedication: (medication: string) => void;
  removeCurrentMedication: (medication: string) => void;
  addMedicalHistory: (condition: string) => void;
  removeMedicalHistory: (condition: string) => void;
  updateLifestyle: (lifestyle: Partial<Lifestyle>) => void;
  updateEmergencyContact: (contact: EmergencyContact | null) => void;
  addRecentlyViewed: (medicineId: string) => void;
  toggleSavedMedicine: (medicineId: string) => void;
}

const defaultPreferences: Preferences = {
  language: 'en',
  secondaryLanguage: null,
  diet: 'omnivore',
  theme: 'light',
  fontSize: 'medium',
  exerciseLevel: 'none',
  healthConditions: [],
  allergies: [],
  savedMedicines: [],
  recentlyViewed: [],
  age: 0,
  gender: 'male',
  ageRange: null,
  weight: null,
  height: null,
  lifestyle: {
    smoking: false,
    alcohol: false,
    exercise: 'none',
    diet: 'omnivore'
  },
  currentMedications: [],
  medicalHistory: [],
  notifications: true,
  emergencyContact: null
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [diet, setDiet] = useState<Diet>('omnivore');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  const updatePreferences = (newPrefs: Partial<Preferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPrefs,
      lifestyle: {
        ...prev.lifestyle,
        ...(newPrefs.lifestyle || {})
      }
    }));
  };

  const addHealthCondition = (condition: string) => {
    if (!condition.trim()) return;
    setPreferences(prev => ({
      ...prev,
      healthConditions: [...prev.healthConditions, condition.trim()]
    }));
  };

  const removeHealthCondition = (condition: string) => {
    setPreferences(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.filter(c => c !== condition)
    }));
  };

  const addAllergy = (allergy: string) => {
    if (!allergy.trim()) return;
    setPreferences(prev => ({
      ...prev,
      allergies: [...prev.allergies, allergy.trim()]
    }));
  };

  const removeAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addCurrentMedication = (medication: string) => {
    if (!medication.trim()) return;
    setPreferences(prev => ({
      ...prev,
      currentMedications: [...prev.currentMedications, medication.trim()]
    }));
  };

  const removeCurrentMedication = (medication: string) => {
    setPreferences(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter(m => m !== medication)
    }));
  };

  const addMedicalHistory = (condition: string) => {
    if (!condition.trim()) return;
    setPreferences(prev => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, condition.trim()]
    }));
  };

  const removeMedicalHistory = (condition: string) => {
    setPreferences(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter(c => c !== condition)
    }));
  };

  const updateLifestyle = (lifestyle: Partial<Lifestyle>) => {
    setPreferences(prev => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, ...lifestyle }
    }));
  };

  const updateEmergencyContact = (contact: EmergencyContact | null) => {
    setPreferences(prev => ({
      ...prev,
      emergencyContact: contact
    }));
  };

  const addRecentlyViewed = (medicineId: string) => {
    setPreferences(prev => ({
      ...prev,
      recentlyViewed: [...new Set([medicineId, ...prev.recentlyViewed])].slice(0, 10)
    }));
  };

  const toggleSavedMedicine = (medicineId: string) => {
    setPreferences(prev => ({
      ...prev,
      savedMedicines: prev.savedMedicines?.includes(medicineId)
        ? prev.savedMedicines.filter(id => id !== medicineId)
        : [...(prev.savedMedicines || []), medicineId]
    }));
  };

  return (
    <UserContext.Provider
      value={{
        language,
        setLanguage,
        diet,
        setDiet,
        allergies,
        setAllergies,
        preferences,
        setPreferences,
        updatePreferences,
        addHealthCondition,
        removeHealthCondition,
        addAllergy,
        removeAllergy,
        addCurrentMedication,
        removeCurrentMedication,
        addMedicalHistory,
        removeMedicalHistory,
        updateLifestyle,
        updateEmergencyContact,
        addRecentlyViewed,
        toggleSavedMedicine
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 