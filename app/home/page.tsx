'use client';

import { useState, useEffect, useRef } from 'react';
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
  const { preferences, addRecentlyViewed, setLanguage, updatePreferences } = useUser();
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const medicineInfoRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', extractedText);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze image');
        }

        const data = await response.json();
        
        // Format the overview in the specified structure
        const formattedOverview = `USES\n${data.aiGeneratedInfo.primaryUses.slice(0, 3).map((use: string) => `• ${use}`).join('\n')}\n\nMECHANISM\n• ${data.aiGeneratedInfo.mechanismOfAction}\n\nDOSAGE\n${data.aiGeneratedInfo.dosageInfo.split('\n').slice(0, 2).map((dosage: string) => `• ${dosage}`).join('\n')}\n\nSIDE EFFECTS\n${data.sideEffects.slice(0, 3).map((effect: string) => `• ${effect}`).join('\n')}\n\nWARNINGS\n${data.aiGeneratedInfo.contraindications.slice(0, 3).map((warning: string) => `• ${warning}`).join('\n')}`;
        
        // Create a complete medicine info object
        const medicineData = {
          id: data.name?.toLowerCase() || 'unknown',
          name: data.name || 'Unknown Medicine',
          overview: formattedOverview,
          ingredients: data.ingredients || ['Information not available'],
          sideEffects: data.sideEffects || ['Information not available'],
          herbalAlternatives: data.herbalAlternatives || ['Information not available'],
          aiGeneratedInfo: {
            primaryUses: data.aiGeneratedInfo.primaryUses,
            conditionsTreated: data.aiGeneratedInfo.conditionsTreated,
            additionalUses: data.aiGeneratedInfo.additionalUses,
            mechanismOfAction: data.aiGeneratedInfo.mechanismOfAction,
            dosageInfo: data.aiGeneratedInfo.dosageInfo,
            contraindications: data.aiGeneratedInfo.contraindications,
            personalizedInfo: formattedOverview
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
      // Extract text from image using Tesseract.js
      const worker = await createWorker() as unknown as TesseractWorker;
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const result = await worker.recognize(selectedImage);
      const extractedText = result.data.text;
      await worker.terminate();
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the image');
      }

      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('text', extractedText);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      
      // Create a complete medicine info object
      const medicineData = {
        id: data.name?.toLowerCase() || 'unknown',
        name: data.name || 'Unknown Medicine',
        overview: data.overview || 'Information not available',
        ingredients: data.ingredients || ['Information not available'],
        sideEffects: data.sideEffects || ['Information not available'],
        herbalAlternatives: data.herbalAlternatives || ['Information not available'],
        aiGeneratedInfo: data.aiGeneratedInfo || {
          primaryUses: ['Information not available'],
          conditionsTreated: ['Information not available'],
          additionalUses: ['Information not available'],
          mechanismOfAction: 'Information not available',
          dosageInfo: 'Information not available',
          contraindications: ['Information not available'],
          personalizedInfo: 'Information not available'
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
        errorMessage += error.message;
      }
      
      toast.error(errorMessage);
      setImage(null);
      setExtractedText('');
      setMedicineInfo(null);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = preferences.theme === 'dark';

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-slate-900'}`}>
      <div className={`sticky top-0 z-30 border-b backdrop-blur-xl ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-white/60 bg-white/50'}`}>
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg">✦</div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{getTranslation('app.title', preferences.language)}</h1>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clinical AI workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={preferences.language}
              onChange={(e) => setLanguage(e.target.value as typeof preferences.language)}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                isDark
                  ? 'border-slate-700 bg-slate-900 text-slate-200'
                  : 'border-slate-200 bg-white/80 text-slate-700'
              }`}
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="pt">PT</option>
              <option value="sw">SW</option>
              <option value="ki">Kikuyu (KI)</option>
              <option value="luo">Dholuo (LUO)</option>
            </select>
            <button
              onClick={() => updatePreferences({ theme: isDark ? 'light' : 'dark' })}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                isDark
                  ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200'
                  : 'border-slate-200 bg-white/80 hover:bg-white text-slate-700'
              }`}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646a9.003 9.003 0 1011.708 11.708z" />
                </svg>
              )}
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                isDark
                  ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200'
                  : 'border-slate-200 bg-white/80 hover:bg-white text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[440px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <div className={`relative h-full overflow-hidden rounded-3xl border p-2 shadow-2xl ${
            isDark ? 'border-slate-800 bg-slate-900/85' : 'border-white/60 bg-white/75'
          }`}>
            <div className={`pointer-events-none absolute inset-0 ${
              isDark
                ? 'bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_80%_100%,rgba(59,130,246,0.12),transparent_50%)]'
                : 'bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_80%_100%,rgba(59,130,246,0.16),transparent_50%)]'
            }`} />
            <div className="relative h-full min-h-0 overflow-hidden rounded-2xl">
              <Chatbot isFixed={true} />
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className={`rounded-2xl border p-5 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-white/60 bg-white/70'}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Medication Intelligence</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Search by medicine name or upload packaging for OCR analysis.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="relative">
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
                  className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm transition focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:ring-cyan-500'
                      : 'border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:ring-cyan-400'
                  }`}
                  disabled={isSearching}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <CircularProgress size={18} color="text-white" />
                    <span>{getTranslation('app.search.processing', preferences.language)}</span>
                  </>
                ) : (
                  <>
                    <span>{getTranslation('app.search.button', preferences.language)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <div className={`rounded-2xl border p-5 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-white/60 bg-white/70'}`}>
              <h4 className="mb-3 text-base font-semibold">{getTranslation('app.upload.text', preferences.language)}</h4>
              {!image ? (
                <div
                  {...getRootProps()}
                  className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
                    isDragActive
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : isDark
                      ? 'border-slate-700 hover:border-cyan-500 hover:bg-slate-800'
                      : 'border-slate-300 hover:border-cyan-500 hover:bg-cyan-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3 h-12 w-12 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">{getTranslation('app.upload.text', preferences.language)}</p>
                    <p className={`mt-1 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{getTranslation('app.upload.supported', preferences.language)}</p>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl border p-3 ${isDark ? 'border-slate-700 bg-slate-950/50' : 'border-slate-200 bg-white'}`}>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-slate-100">
                    <img src={image} alt="Uploaded medicine" className="h-full w-full object-contain" />
                    <button
                      onClick={handleDeleteImage}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow transition hover:bg-red-600"
                      title="Delete image"
                      disabled={isScanning}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Image uploaded successfully</p>
                    <button
                      onClick={() => {
                        setImage(null);
                        setExtractedText('');
                        setMedicineInfo(null);
                      }}
                      className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
                      disabled={isScanning}
                    >
                      Upload another
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={`rounded-2xl border p-5 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-white/60 bg-white/70'}`}>
              <h4 className="mb-3 text-base font-semibold">Live Processing Status</h4>
              <div className="space-y-3">
                <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Search Request</p>
                    {isSearching ? <CircularProgress size={18} color="text-cyan-500" /> : <span className="text-xs text-emerald-500">Idle</span>}
                  </div>
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{getTranslation('app.search.processing', preferences.language)}</p>
                </div>
                <div className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">OCR + Analysis</p>
                    {isScanning ? <CircularProgress size={18} color="text-cyan-500" /> : <span className="text-xs text-emerald-500">Idle</span>}
                  </div>
                  <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{getTranslation('scan.processing', preferences.language)}</p>
                </div>
              </div>
            </div>
          </div>

          {extractedText && (
            <div className={`rounded-2xl border p-6 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-white/60 bg-white/70'}`}>
              <h2 className="mb-4 text-lg font-semibold">{getTranslation('app.upload.extractedText', preferences.language)}</h2>
              <div className={`rounded-xl border p-4 text-sm ${isDark ? 'border-slate-700 bg-slate-950/50 text-slate-300' : 'border-slate-200 bg-white text-slate-700'}`}>
                <p className="whitespace-pre-wrap">{extractedText}</p>
              </div>
            </div>
          )}

          {medicineInfo && (
            <div ref={medicineInfoRef} className={`rounded-2xl border p-6 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-white/60 bg-white/70'}`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{getTranslation('app.medicine.info.title', preferences.language)}</h2>
                <span className={`rounded-full px-3 py-1 text-xs ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-cyan-50 text-cyan-700'}`}>AI Generated</span>
              </div>
              <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-700 bg-slate-950/50' : 'border-slate-200 bg-white'}`}>
                <h3 className="mb-4 text-2xl font-semibold">{medicineInfo.name}</h3>
                <div className={`rounded-xl p-5 ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-blue-50'}`}>
                  <h4 className={`mb-3 text-base font-semibold ${isDark ? 'text-cyan-300' : 'text-blue-900'}`}>
                    {getTranslation('app.medicine.overview', preferences.language)}
                  </h4>
                  <div className="space-y-4">
                    {isGeneratingInfo ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-500"></div>
                        <span className={`ml-3 ${isDark ? 'text-slate-300' : 'text-blue-800'}`}>
                          {getTranslation('app.search.loading', preferences.language)}
                        </span>
                      </div>
                    ) : medicineInfo.aiGeneratedInfo ? (
                      <div>
                        <h5 className={`mb-2 text-sm font-medium ${isDark ? 'text-cyan-200' : 'text-blue-900'}`}>
                          {getTranslation('app.medicine.personalizedInfo', preferences.language)}
                        </h5>
                        <div className={`rounded-lg p-4 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-blue-800'} shadow-sm`}>
                          <p className="whitespace-pre-line leading-relaxed">
                            {medicineInfo.aiGeneratedInfo.personalizedInfo}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={`rounded-lg p-4 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-blue-800'} shadow-sm`}>
                        <p className="leading-relaxed">{medicineInfo.overview}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {showPreferences && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className={`h-full w-full max-w-2xl overflow-y-auto border-l p-5 ${isDark ? 'border-slate-800 bg-slate-950 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Settings & Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className={`rounded-lg px-3 py-2 text-sm ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                Close
              </button>
            </div>
            <UserPreferences />
          </div>
        </div>
      )}
    </main>
  );
} 