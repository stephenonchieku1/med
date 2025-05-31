'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { getTranslation } from '../translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  isFixed?: boolean;
}

// Add type definition for SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function Chatbot({ isFixed = false }: ChatbotProps) {
  const { preferences } = useUser();
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your healthcare assistant. I can help you with:\n\n' +
        '• Medicine information and side effects\n' +
        '• Dosage recommendations\n' +
        '• Drug interactions\n' +
        '• Alternative treatments\n' +
        '• General health advice\n\n' +
        'How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        setIsLoading(true);
        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've analyzed the image. Here's what I found:\n\n${data.overview}\n\nIngredients: ${data.ingredients.join(', ')}\n\nSide Effects: ${data.sideEffects.join(', ')}\n\nHerbal Alternatives: ${data.herbalAlternatives.join(', ')}`
        }]);
      } catch (error) {
        console.error('Error analyzing image:', error);
        toast.error('Failed to analyze image');
      } finally {
        setIsLoading(false);
      }
    }
  });

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = preferences.language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Don't stop recording on no-speech error
          return;
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        // Only stop if we explicitly called stop()
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [preferences.language, isListening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      // Clear the input when stopping recording
      setInput('');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);
    
    // Stop recording if it's active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: preferences.language,
          userContext: {
            age: preferences.age,
            gender: preferences.gender,
            healthConditions: preferences.healthConditions,
            allergies: preferences.allergies,
            currentMedications: preferences.currentMedications,
            medicalHistory: preferences.medicalHistory,
            lifestyle: preferences.lifestyle
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: getTranslation('chatbot.error', preferences.language) 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
    // Create a synthetic event to trigger handleSendMessage
    const event = new Event('submit') as unknown as React.FormEvent;
    handleSendMessage(event);
  };

  const renderInputForm = () => (
    <form onSubmit={handleSendMessage} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getTranslation('chatbot.input.placeholder', preferences.language)}
          className="w-full p-2 border rounded-lg"
          disabled={isProcessing}
        />
        {isListening && (
          <div className="absolute -top-6 left-0 text-sm text-red-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Recording...
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2 rounded-lg ${
          isListening ? 'bg-red-500' : 'bg-gray-200'
        } hover:bg-opacity-80 transition-colors`}
        disabled={isProcessing}
        title={isListening ? 'Stop recording' : 'Start voice input'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      <button
        type="submit"
        disabled={isProcessing || !input.trim()}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {getTranslation('chatbot.send', preferences.language)}
      </button>
    </form>
  );

  if (isFixed) {
    return (
      <div className={`flex flex-col h-full ${isFixed ? 'h-[300px]' : 'h-screen'}`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sample Questions */}
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => handleSampleQuestion("What are the common side effects of paracetamol?")}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              Side effects of paracetamol?
            </button>
            <button
              onClick={() => handleSampleQuestion("Can I take ibuprofen with high blood pressure?")}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              Ibuprofen with high BP?
            </button>
            <button
              onClick={() => handleSampleQuestion("What are some natural alternatives to antibiotics?")}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              Natural alternatives?
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about medicines, side effects, or alternatives..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-96">
          <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Healthcare Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            {renderInputForm()}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
} 