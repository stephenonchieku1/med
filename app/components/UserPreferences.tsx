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

  const handleAllergiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const allergiesList = value.split(',').map(item => item.trim()).filter(Boolean);
    setAllergies(allergiesList);
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

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

  return (
    <div className="space-y-6 p-4" data-testid="user-preferences">
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          data-testid="language-select"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="diet" className="block text-sm font-medium text-gray-700">
          Dietary Preferences
        </label>
        <select
          id="diet"
          value={diet}
          onChange={(e) => setDiet(e.target.value as Diet)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          data-testid="diet-select"
        >
          <option value="omnivore">Omnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="pescatarian">Pescatarian</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
          Allergies
        </label>
        <input
          type="text"
          id="allergies"
          value={allergies.join(', ')}
          onChange={handleAllergiesChange}
          placeholder="Enter allergies separated by commas"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          data-testid="allergies-input"
        />
      </div>

      <div>
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">Taste Preferences</legend>
          <div className="mt-2 space-y-2">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={() => handlePreferenceChange(key as keyof typeof preferences)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  data-testid={`preference-${key}`}
                />
                <label htmlFor={key} className="ml-2 block text-sm text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Basic Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
            <select
              value={preferences.ageRange || ''}
              onChange={(e) => updatePreferences({ ageRange: e.target.value || null })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select age range</option>
              {ageRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={preferences.gender}
              onChange={(e) => updatePreferences({ gender: e.target.value as 'male' | 'female' | 'other' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={preferences.weight || ''}
              onChange={(e) => updatePreferences({ weight: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter weight"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
            <input
              type="number"
              value={preferences.height || ''}
              onChange={(e) => updatePreferences({ height: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter height"
            />
          </div>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Lifestyle</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.lifestyle?.smoking ?? false}
                onChange={(e) => updateLifestyle({ smoking: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Smoking</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.lifestyle?.alcohol ?? false}
                onChange={(e) => updateLifestyle({ alcohol: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Alcohol Consumption</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Level</label>
            <select
              value={preferences.lifestyle?.exercise ?? 'none'}
              onChange={(e) => updateLifestyle({ exercise: e.target.value as 'none' | 'light' | 'moderate' | 'heavy' })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diet</label>
            <select
              value={preferences.lifestyle?.diet ?? 'omnivore'}
              onChange={(e) => updateLifestyle({ diet: e.target.value as Diet })}
              className="w-full p-2 border rounded-lg"
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

      {/* Current Medications */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current Medications</h3>
        <form onSubmit={handleAddMedication} className="flex gap-2 mb-2">
          <input
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            placeholder="Add current medication..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {(preferences.currentMedications || []).map((medication, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
            >
              {medication}
              <button
                onClick={() => removeCurrentMedication(medication)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Medical History */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Medical History</h3>
        <form onSubmit={handleAddMedicalHistory} className="flex gap-2 mb-2">
          <input
            type="text"
            value={newMedicalHistory}
            onChange={(e) => setNewMedicalHistory(e.target.value)}
            placeholder="Add medical history..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {(preferences.medicalHistory || []).map((condition, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
            >
              {condition}
              <button
                onClick={() => removeMedicalHistory(condition)}
                className="ml-2 text-yellow-600 hover:text-yellow-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Emergency Contact</h3>
        <form onSubmit={handleUpdateEmergencyContact} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={newEmergencyContact.name}
              onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              value={newEmergencyContact.relationship}
              onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter relationship"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={newEmergencyContact.phone}
              onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter phone number"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Update Emergency Contact
          </button>
        </form>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Language Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => updatePreferences({ language: e.target.value as Language })}
              className="w-full p-2 border rounded-lg"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Language (Optional)
            </label>
            <select
              value={preferences.secondaryLanguage || ''}
              onChange={(e) => updatePreferences({ secondaryLanguage: e.target.value as Language || null })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">None</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getTranslation('preferences.theme', preferences.language)}
        </label>
        <select
          value={preferences.theme}
          onChange={(e) => updatePreferences({ theme: e.target.value as 'light' | 'dark' })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Font Size */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getTranslation('preferences.fontSize', preferences.language)}
        </label>
        <select
          value={preferences.fontSize}
          onChange={(e) => updatePreferences({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={(e) => updatePreferences({ notifications: e.target.checked })}
            className="rounded text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700">
            {getTranslation('preferences.notifications', preferences.language)}
          </span>
        </label>
      </div>

      {/* Medical Conditions */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Medical Conditions</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Common Conditions
          </label>
          <div className="grid grid-cols-2 gap-2">
            {commonConditions.map(condition => (
              <label key={condition} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.healthConditions?.includes(condition) ?? false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addHealthCondition(condition);
                    } else {
                      removeHealthCondition(condition);
                    }
                  }}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{condition}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Conditions
          </label>
          <form onSubmit={handleAddCondition} className="flex gap-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add other condition..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Allergies */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Allergies</h3>
        <form onSubmit={handleAddAllergy} className="flex gap-2 mb-2">
          <input
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Add an allergy..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {(preferences.allergies || []).map((allergy, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
            >
              {allergy}
              <button
                onClick={() => removeAllergy(allergy)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPreferences; 