'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import toast from 'react-hot-toast';
import axios from 'axios';
import Chatbot from '../components/Chatbot';
import UserPreferences from '../components/UserPreferences';
import CircularProgress from '../components/CircularProgress';
import { useUser } from '../context/UserContext';
import { getTranslation } from '../translations';

interface MedicineInfo {
  id: string;
  name: string;
  overview: string;
  ingredients: string[];
  sideEffects: string[];
  herbalAlternatives: string[];
  aiGeneratedInfo?: {
    primaryUses: string[];
    conditionsTreated: string[];
    additionalUses: string[];
    mechanismOfAction: string;
    dosageInfo: string;
    contraindications: string[];
    personalizedInfo: string;
  };
}

// Add type definition for Tesseract worker
interface TesseractWorker extends Worker {
  loadLanguage: (lang: string) => Promise<void>;
  initialize: (lang: string) => Promise<void>;
  recognize: (image: File) => Promise<{ data: { text: string } }>;
}

export default function Home() {
  const { preferences, addRecentlyViewed, toggleSavedMedicine } = useUser();
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<MedicineInfo[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Generate medicine information
      const response = await axios.post('/api/generate-medicine-info', {
        medicineName: searchQuery
      });
      
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      // Format the overview in the specified structure
      const formattedOverview = `USES\n${response.data.primaryUses.slice(0, 3).map((use: string) => `• ${use}`).join('\n')}\n\nMECHANISM\n• ${response.data.mechanismOfAction}\n\nDOSAGE\n${response.data.dosageInfo.split('\n').slice(0, 2).map((dosage: string) => `• ${dosage}`).join('\n')}\n\nSIDE EFFECTS\n${response.data.sideEffects.slice(0, 3).map((effect: string) => `• ${effect}`).join('\n')}\n\nWARNINGS\n${response.data.contraindications.slice(0, 3).map((warning: string) => `• ${warning}`).join('\n')}`;

      // Create a complete medicine info object
      const medicineData = {
        id: searchQuery.toLowerCase(),
        name: searchQuery,
        overview: formattedOverview,
        ingredients: [
          ...response.data.ingredients.active.map((ing: string) => `Active: ${ing}`),
          ...response.data.ingredients.inactive.map((ing: string) => `Inactive: ${ing}`)
        ],
        sideEffects: response.data.sideEffects,
        herbalAlternatives: [], // This would come from a separate API
        aiGeneratedInfo: {
          primaryUses: response.data.primaryUses,
          conditionsTreated: response.data.conditionsTreated,
          additionalUses: response.data.additionalUses,
          mechanismOfAction: response.data.mechanismOfAction,
          dosageInfo: response.data.dosageInfo,
          contraindications: response.data.contraindications,
          personalizedInfo: formattedOverview
        }
      };
      
      setMedicineInfo(medicineData);
      
      if (medicineData.id) {
        addRecentlyViewed(medicineData.id);
      }
      setImage(null);
      setExtractedText('');
      setSearchQuery(''); // Clear the search input after successful search
    } catch (error) {
      console.error('Error searching medicine:', error);
      toast.error('Failed to fetch medicine information');
    }
    setIsSearching(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setSelectedImage(file);
      
      setIsScanning(true);
      try {
        // Extract text from image
        const worker = await createWorker() as unknown as TesseractWorker;
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        const result = await worker.recognize(file);
        const extractedText = result.data.text;
        await worker.terminate();
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('No text could be extracted from the image');
        }
        
        setExtractedText(extractedText);
        
        // Extract medicine name from text (improved logic)
        const lines = extractedText.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        // Look for common medicine name patterns
        const medicineNamePatterns = [
          /(?:brand|generic|trade)\s*name:?\s*([^\n]+)/i,
          /(?:active|main)\s*ingredient:?\s*([^\n]+)/i,
          /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)$/m
        ];
        
        let medicineName = '';
        for (const pattern of medicineNamePatterns) {
          const match = extractedText.match(pattern);
          if (match && match[1]) {
            medicineName = match[1].trim();
            break;
          }
        }
        
        // If no pattern match, use the first non-empty line
        if (!medicineName && lines.length > 0) {
          medicineName = lines[0];
        }
        
        if (!medicineName) {
          throw new Error('Could not identify medicine name from the image');
        }
        
        // Clean up medicine name
        medicineName = medicineName
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, ' ')     // Normalize spaces
          .trim();
        
        // Generate medicine information
        const response = await axios.post('/api/generate-medicine-info', {
          medicineName,
          extractedText,
          userPreferences: preferences
        });
        
        if (response.data.error) {
          throw new Error(response.data.error);
        }

        // Create a complete medicine info object
        const medicineData = {
          id: medicineName.toLowerCase(),
          name: medicineName,
          overview: response.data.personalizedInfo || 'Information not available',
          ingredients: [
            ...(response.data.ingredients?.active || []).map((ing: string) => `Active: ${ing}`),
            ...(response.data.ingredients?.inactive || []).map((ing: string) => `Inactive: ${ing}`)
          ],
          sideEffects: response.data.sideEffects || ['Information not available'],
          herbalAlternatives: response.data.herbalAlternatives || ['Information not available'],
          aiGeneratedInfo: {
            primaryUses: response.data.primaryUses || ['Information not available'],
            conditionsTreated: response.data.conditionsTreated || ['Information not available'],
            additionalUses: response.data.additionalUses || ['Information not available'],
            mechanismOfAction: response.data.mechanismOfAction || 'Information not available',
            dosageInfo: response.data.dosageInfo || 'Information not available',
            contraindications: response.data.contraindications || ['Information not available'],
            personalizedInfo: response.data.personalizedInfo || 'Information not available'
          }
        };
        
        setMedicineInfo(medicineData);
        
        if (medicineData.id) {
          addRecentlyViewed(medicineData.id);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        let errorMessage = 'Failed to process image. ';
        
        if (error instanceof Error) {
          if (error.message.includes('No text could be extracted')) {
            errorMessage += 'No text could be extracted from the image. Please ensure the image is clear and contains readable text.';
          } else if (error.message.includes('Could not identify medicine name')) {
            errorMessage += 'Could not identify the medicine name from the image. Please ensure the medicine name is clearly visible.';
          } else {
            errorMessage += error.message;
          }
        }
        
        toast.error(errorMessage);
        setImage(null);
        setExtractedText('');
        setMedicineInfo(null);
      }
      setIsScanning(false);
    }
  });

  const handleDeleteImage = () => {
    setImage(null);
    setExtractedText('');
    setMedicineInfo(null);
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setMedicineInfo({
        id: 'scanned',
        name: 'Scanned Medicine',
        overview: data.overview,
        ingredients: data.ingredients || [],
        sideEffects: data.sideEffects || [],
        herbalAlternatives: data.herbalAlternatives || [],
        aiGeneratedInfo: data.aiGeneratedInfo
      });
    } catch (error) {
      console.error('Error scanning image:', error);
      toast.error(getTranslation('app.search.error', preferences.language));
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await axios.post('/api/recommendations', {
          healthConditions: preferences.healthConditions,
          allergies: preferences.allergies,
          recentlyViewed: preferences.recentlyViewed,
        });
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
    };

    loadRecommendations();
  }, [preferences.healthConditions, preferences.allergies, preferences.recentlyViewed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className={`min-h-screen ${preferences.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">
              {getTranslation('app.title', preferences.language)}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showPreferences && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <UserPreferences />
          </div>
        )}

        {/* Chatbot Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-4 bg-blue-600 text-white rounded-t-xl">
              <h3 className="font-semibold">
                {getTranslation('chatbot.title', preferences.language)}
              </h3>
            </div>
            <div className="h-[700px] overflow-y-auto p-4">
              <Chatbot isFixed={true} />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder={getTranslation('app.search.placeholder', preferences.language)}
                className="w-full p-4 pl-12 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isSearching}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <CircularProgress size={20} color="text-white" />
                  <span>{getTranslation('app.search.processing', preferences.language)}</span>
                </>
              ) : (
                <>
                  <span>{getTranslation('app.search.button', preferences.language)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-8">
          {!image ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all max-w-md  ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-base font-medium">{getTranslation('app.upload.text', preferences.language)}</p>
                <p className="text-xs text-gray-500 mt-1">{getTranslation('app.upload.supported', preferences.language)}</p>
              </div>
            </div>
          ) : (
            <div className="relative max-w-md">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="relative w-full">
                  <div className="aspect-[3/2] w-full overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={image}
                      alt="Uploaded medicine"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={handleDeleteImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="Delete image"
                      disabled={isScanning}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Image uploaded successfully</p>
                  <button
                    onClick={() => {
                      setImage(null);
                      setExtractedText('');
                      setMedicineInfo(null);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    disabled={isScanning}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload another image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading States */}
        {isSearching && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-3">
              <CircularProgress size={24} color="text-blue-600" />
              <span className="text-gray-600">
                {getTranslation('app.search.processing', preferences.language)}
              </span>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-3">
              <CircularProgress size={24} color="text-blue-600" />
              <span className="text-gray-600">
                {getTranslation('scan.processing', preferences.language)}
              </span>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {getTranslation('app.recommendations.title', preferences.language)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((medicine) => (
                <div key={medicine.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">{medicine.name}</h3>
                    <button
                      onClick={() => toggleSavedMedicine(medicine.id)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">{medicine.overview}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {getTranslation('app.upload.extractedText', preferences.language)}
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="whitespace-pre-wrap text-gray-700">{extractedText}</p>
            </div>
          </div>
        )}

        {/* Medicine Info */}
        {medicineInfo && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {getTranslation('app.medicine.info.title', preferences.language)}
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{medicineInfo.name}</h3>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold mb-3 text-blue-900">
                    {getTranslation('app.medicine.overview', preferences.language)}
                  </h4>
                  <div className="space-y-4">
                    {isGeneratingInfo ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-blue-800">
                          {getTranslation('app.search.loading', preferences.language)}
                        </span>
                      </div>
                    ) : medicineInfo.aiGeneratedInfo ? (
                      <>
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">
                            {getTranslation('app.medicine.personalizedInfo', preferences.language)}
                          </h5>
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-blue-800 leading-relaxed whitespace-pre-line">
                              {medicineInfo.aiGeneratedInfo.personalizedInfo}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-blue-800 leading-relaxed">{medicineInfo.overview}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-4">
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        {/* Chat Window */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl z-50">
            <div className="p-4 bg-blue-600 text-white rounded-t-xl flex justify-between items-center">
              <h3 className="font-semibold">
                {getTranslation('app.chat.title', preferences.language)}
              </h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4">
              <Chatbot isFixed={true} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 