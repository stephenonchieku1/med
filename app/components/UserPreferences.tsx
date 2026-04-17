'use client';

import React from 'react';
import { useUser, Language, Diet } from '../context/UserContext';
import { getTranslation } from '../translations';

const UserPreferences: React.FC = () => {
  const {
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
    updateEmergencyContact
  } = useUser();

  const [newCondition, setNewCondition] = React.useState('');
  const [newAllergy, setNewAllergy] = React.useState('');
  const [newMedication, setNewMedication] = React.useState('');
  const [newMedicalHistory, setNewMedicalHistory] = React.useState('');
  const [newEmergencyContact, setNewEmergencyContact] = React.useState({
    name: '',
    relationship: '',
    phone: ''
  });

  const languages: { code: Language; name: string }[] = [
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
    { code: 'ki', name: 'Gĩkũyũ' },
    { code: 'luo', name: 'Dholuo' }
  ];

  // Age range options
  const ageRanges = [
    { value: '0-12', label: '0-12 years' },
    { value: '13-17', label: '13-17 years' },
    { value: '18-24', label: '18-24 years' },
    { value: '25-34', label: '25-34 years' },
    { value: '35-44', label: '35-44 years' },
    { value: '45-54', label: '45-54 years' },
    { value: '55-64', label: '55-64 years' },
    { value: '65+', label: '65+ years' }
  ];

  // Common medical conditions
  const commonConditions = [
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
  ];

  const handleAddCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCondition.trim()) {
      addHealthCondition(newCondition.trim());
      setNewCondition('');
    }
  };

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAllergy.trim()) {
      addAllergy(newAllergy.trim());
      setNewAllergy('');
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedication.trim()) {
      addCurrentMedication(newMedication.trim());
      setNewMedication('');
    }
  };

  const handleAddMedicalHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedicalHistory.trim()) {
      addMedicalHistory(newMedicalHistory.trim());
      setNewMedicalHistory('');
    }
  };

  const handleUpdateEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmergencyContact.name && newEmergencyContact.phone) {
      updateEmergencyContact(newEmergencyContact);
      setNewEmergencyContact({ name: '', relationship: '', phone: '' });
    }
  };

  const panelClass = preferences.theme === 'dark'
    ? 'border-slate-700 bg-slate-900'
    : 'border-slate-200 bg-white';

  const fieldClass = preferences.theme === 'dark'
    ? 'bg-slate-800 text-white border-slate-600'
    : 'bg-white text-gray-900 border-gray-300';

  return (
    <div className={`space-y-6 p-2 ${preferences.theme === 'dark' ? 'text-white' : 'text-gray-900'}`} data-testid="user-preferences">
      <div className={`rounded-2xl border p-5 ${panelClass}`}>
        <h3 className="text-lg font-semibold">Profile & Care Context</h3>
        <p className={`mt-1 text-sm ${preferences.theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Core patient context to improve safety and personalization.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Age Range</label>
            <select
              value={preferences.ageRange || ''}
              onChange={(e) => updatePreferences({ ageRange: e.target.value || null })}
              className={`w-full rounded-lg border p-2 ${fieldClass}`}
            >
              <option value="">Select age range</option>
              {ageRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Gender</label>
            <select
              value={preferences.gender}
              onChange={(e) => updatePreferences({ gender: e.target.value as 'male' | 'female' | 'other' })}
              className={`w-full rounded-lg border p-2 ${fieldClass}`}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              value={preferences.weight || ''}
              onChange={(e) => updatePreferences({ weight: e.target.value ? parseFloat(e.target.value) : null })}
              className={`w-full rounded-lg border p-2 ${fieldClass}`}
              placeholder="Enter weight"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              value={preferences.height || ''}
              onChange={(e) => updatePreferences({ height: e.target.value ? parseFloat(e.target.value) : null })}
              className={`w-full rounded-lg border p-2 ${fieldClass}`}
              placeholder="Enter height"
            />
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${panelClass}`}>
        <h3 className="text-lg font-semibold">Lifestyle</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={preferences.lifestyle?.smoking ?? false}
              onChange={(e) => updateLifestyle({ smoking: e.target.checked })}
              className="rounded"
            />
            Smoking
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={preferences.lifestyle?.alcohol ?? false}
              onChange={(e) => updateLifestyle({ alcohol: e.target.checked })}
              className="rounded"
            />
            Alcohol Consumption
          </label>
          <div>
            <label className="mb-2 block text-sm font-medium">Exercise Level</label>
            <select
              value={preferences.lifestyle?.exercise ?? 'none'}
              onChange={(e) => updateLifestyle({ exercise: e.target.value as 'none' | 'light' | 'moderate' | 'heavy' })}
              className={`w-full rounded-lg border p-2 ${fieldClass}`}
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Diet</label>
            <select
              value={preferences.lifestyle?.diet ?? 'omnivore'}
              onChange={(e) => updateLifestyle({ diet: e.target.value as Diet })}
              className={`w-full rounded-lg border p-2 ${fieldClass}`}
            >
              <option value="omnivore">Omnivore</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${panelClass}`}>
        <h3 className="text-lg font-semibold">Medical Conditions</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {commonConditions.map(condition => (
            <label key={condition} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Array.isArray(preferences.healthConditions) && preferences.healthConditions.includes(condition)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences({
                      ...preferences,
                      healthConditions: [...(preferences.healthConditions || []), condition]
                    });
                  } else {
                    setPreferences({
                      ...preferences,
                      healthConditions: (preferences.healthConditions || []).filter(c => c !== condition)
                    });
                  }
                }}
                className="h-4 w-4 rounded"
              />
              {condition}
            </label>
          ))}
        </div>
        <form onSubmit={handleAddCondition} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            placeholder="Add other condition..."
            className={`flex-1 rounded-lg border p-2 ${fieldClass}`}
          />
          <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">Add</button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`rounded-2xl border p-5 ${panelClass}`}>
          <h3 className="text-lg font-semibold">Allergies</h3>
          <form onSubmit={handleAddAllergy} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add an allergy..."
              className={`flex-1 rounded-lg border p-2 ${fieldClass}`}
            />
            <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">Add</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {(preferences.allergies || []).map((allergy, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">
                {allergy}
                <button onClick={() => removeAllergy(allergy)} className="ml-2">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${panelClass}`}>
          <h3 className="text-lg font-semibold">Current Medications</h3>
          <form onSubmit={handleAddMedication} className="mt-4 flex gap-2">
            <input
              type="text"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              placeholder="Add current medication..."
              className={`flex-1 rounded-lg border p-2 ${fieldClass}`}
            />
            <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">Add</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {(preferences.currentMedications || []).map((medication, index) => (
              <span key={index} className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                {medication}
                <button onClick={() => removeCurrentMedication(medication)} className="ml-2">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${panelClass}`}>
        <h3 className="text-lg font-semibold">Medical History</h3>
        <form onSubmit={handleAddMedicalHistory} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMedicalHistory}
            onChange={(e) => setNewMedicalHistory(e.target.value)}
            placeholder="Add medical history..."
            className={`flex-1 rounded-lg border p-2 ${fieldClass}`}
          />
          <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">Add</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {(preferences.medicalHistory || []).map((condition, index) => (
            <span key={index} className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
              {condition}
              <button onClick={() => removeMedicalHistory(condition)} className="ml-2">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${panelClass}`}>
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        <form onSubmit={handleUpdateEmergencyContact} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            value={newEmergencyContact.name}
            onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
            className={`rounded-lg border p-2 ${fieldClass}`}
            placeholder="Name"
          />
          <input
            type="text"
            value={newEmergencyContact.relationship}
            onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
            className={`rounded-lg border p-2 ${fieldClass}`}
            placeholder="Relationship"
          />
          <input
            type="tel"
            value={newEmergencyContact.phone}
            onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
            className={`rounded-lg border p-2 ${fieldClass}`}
            placeholder="Phone"
          />
          <button type="submit" className="sm:col-span-3 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
            Update Emergency Contact
          </button>
        </form>
      </div>

      <div className={`rounded-2xl border p-5 ${panelClass}`}>
        <h3 className="text-lg font-semibold">Experience Preferences</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">{getTranslation('preferences.fontSize', preferences.language)}</label>
            <select
              value={preferences.fontSize}
              onChange={(e) => updatePreferences({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
              className={`w-full rounded-lg border p-2 ${fieldClass}`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <label className="mt-7 flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => updatePreferences({ notifications: e.target.checked })}
              className="rounded"
            />
            {getTranslation('preferences.notifications', preferences.language)}
          </label>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences; 