'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { getTranslation } from '../translations';
import CircularProgress from './CircularProgress';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  isFixed?: boolean;
}

// Add type definitions for speech recognition and synthesis
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    speechSynthesis: any;
  }
}

export default function Chatbot({ isFixed = false }: ChatbotProps) {
  const { preferences } = useUser();
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: getTranslation('chatbot.greeting', preferences.language),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
        
        // Add the analysis message
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: formatImageAnalysis(data),
            timestamp: new Date()
          }
        ]);

        // Add extracted text if available
        if (data.extractedText) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: formatExtractedText(data.extractedText),
              timestamp: new Date()
            }
          ]);
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: '• Error analyzing image\n• Please try again with a clearer image',
            timestamp: new Date()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = preferences.language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
          setTranscribedText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
          setTranscribedText('');
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
            // If we have transcribed text and recording stopped, send it
            if (transcribedText.trim()) {
              handleSendMessage(transcribedText);
              setTranscribedText('');
            }
            setIsListening(false);
          }
        };
      }

      // Initialize speech synthesis
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [preferences.language, isListening, transcribedText]);

  // Function to speak text
  const speakText = (text: string, messageId: string) => {
    if (!synthesisRef.current) return;

    // If already speaking this message, stop it
    if (isSpeaking && speakingMessageId === messageId) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = preferences.language;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    synthesisRef.current.speak(utterance);
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      // Send the transcribed text if it exists
      if (transcribedText.trim()) {
        handleSendMessage(transcribedText);
      }
      setTranscribedText('');
    } else {
      setTranscribedText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsProcessing(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput(''); // Clear input after sending
    setTranscribedText(''); // Clear transcribed text after sending

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language: preferences.language,
            healthConditions: preferences.healthConditions,
            allergies: preferences.allergies,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Format the response into bullet points and remove MedLex AI prefix
      const formattedResponse = data.response
        .replace(/^MedLex AI:\s*/i, '') // Remove MedLex AI prefix
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          if (!line.trim().startsWith('•') && !line.trim().startsWith('-')) {
            return `• ${line.trim()}`;
          }
          return line.trim();
        })
        .join('\n');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: formattedResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the response with the message ID
      speakText(formattedResponse.replace(/•/g, ''), botMessage.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(getTranslation('chatbot.error', preferences.language));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInput(question);
    // Create a synthetic event to trigger handleSendMessage
    const event = new Event('submit') as unknown as React.FormEvent;
    handleSendMessage(question);
  };

  const renderInputForm = () => (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      const messageToSend = isListening ? transcribedText : input;
      if (messageToSend.trim()) {
        if (isListening) {
          toggleVoiceInput(); // This will stop recording and send the message
        } else {
          handleSendMessage(messageToSend);
        }
      }
    }} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={isListening ? transcribedText : input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 
            getTranslation('chatbot.listening', preferences.language) : 
            getTranslation('chatbot.input.placeholder', preferences.language)
          }
          className="w-full p-2 border rounded-lg"
          disabled={isProcessing}
        />
        {isListening && (
          <div className="absolute -top-6 left-0 text-sm text-red-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            {getTranslation('chatbot.recording', preferences.language)}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={toggleVoiceInput}
        className={`p-2 rounded-lg ${
          isListening ? 'bg-red-500' : 'bg-gray-200'
        } hover:bg-opacity-80 transition-colors`}
        disabled={isProcessing}
        title={isListening ? 
          getTranslation('chatbot.stopRecording', preferences.language) : 
          getTranslation('chatbot.voiceInput', preferences.language)
        }
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
        disabled={isProcessing || (!input.trim() && !transcribedText.trim())}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
      >
        {isProcessing ? (
          <>
            <CircularProgress size={16} color="text-white" />
            {getTranslation('chatbot.processing', preferences.language)}
          </>
        ) : (
          getTranslation('chatbot.send', preferences.language)
        )}
      </button>
    </form>
  );

  // Update the image analysis response formatting
  const formatImageAnalysis = (data: any) => {
    const formatList = (items: string[]) => 
      items.map(item => `• ${item.trim()}`).join('\n');

    return `• Overview\n${formatList(data.overview.split('\n'))}\n\n• Ingredients\n${formatList(data.ingredients)}\n\n• Side Effects\n${formatList(data.sideEffects)}\n\n• Herbal Alternatives\n${formatList(data.herbalAlternatives)}`;
  };

  // Update the extracted text formatting
  const formatExtractedText = (text: string) => {
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => `• ${line.trim()}`)
      .join('\n');
  };

  // Update the messages rendering to use the new renderMessage function
  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => renderMessage(message))}
      {isProcessing && (
        <div className="flex justify-start">
          <div className="bg-gray-50 rounded-2xl p-4 text-gray-800 shadow-sm border border-gray-100 flex items-center gap-2">
            <CircularProgress size={20} color="text-blue-600" />
            <span className="text-sm text-gray-600">
              {getTranslation('chatbot.processing', preferences.language)}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Update the renderMessage function to include the message ID in the speak button
  const renderMessage = (message: Message) => (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          message.role === 'user'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-50 text-gray-800 shadow-sm border border-gray-100'
        }`}
      >
        <div className="flex items-start gap-2">
          <div className="flex-1">{message.content}</div>
          {message.role === 'assistant' && (
            <button
              onClick={() => speakText(message.content.replace(/•/g, ''), message.id)}
              className={`p-1 rounded-full ${
                isSpeaking && speakingMessageId === message.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              } transition-colors`}
              title={isSpeaking && speakingMessageId === message.id ? 
                getTranslation('chatbot.stopSpeaking', preferences.language) : 
                getTranslation('chatbot.speak', preferences.language)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isSpeaking && speakingMessageId === message.id ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isFixed) {
    return (
      <div className="flex flex-col h-[700px] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Fixed Sample Questions Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {getTranslation('chatbot.quickQuestions', preferences.language)}
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSampleQuestion("What are the common side effects of paracetamol?")}
              className="text-sm bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm border border-blue-100 hover:border-blue-200"
            >
              {getTranslation('chatbot.sampleQuestion1', preferences.language)}
            </button>
            <button
              onClick={() => handleSampleQuestion("Can I take ibuprofen with high blood pressure?")}
              className="text-sm bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm border border-blue-100 hover:border-blue-200"
            >
              {getTranslation('chatbot.sampleQuestion2', preferences.language)}
            </button>
            <button
              onClick={() => handleSampleQuestion("What are some natural alternatives to antibiotics?")}
              className="text-sm bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm border border-blue-100 hover:border-blue-200"
            >
              {getTranslation('chatbot.sampleQuestion3', preferences.language)}
            </button>
          </div>
        </div>

        {renderMessages()}

        {/* Fixed Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {renderInputForm()}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-xl w-96 flex flex-col h-[800px] overflow-hidden">
          {/* Floating Sample Questions Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {getTranslation('chatbot.quickQuestions', preferences.language)}
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSampleQuestion("What are the common side effects of paracetamol?")}
                className="text-sm bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm border border-blue-100 hover:border-blue-200"
              >
                {getTranslation('chatbot.sampleQuestion1', preferences.language)}
              </button>
              <button
                onClick={() => handleSampleQuestion("Can I take ibuprofen with high blood pressure?")}
                className="text-sm bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm border border-blue-100 hover:border-blue-200"
              >
                {getTranslation('chatbot.sampleQuestion2', preferences.language)}
              </button>
              <button
                onClick={() => handleSampleQuestion("What are some natural alternatives to antibiotics?")}
                className="text-sm bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm border border-blue-100 hover:border-blue-200"
              >
                {getTranslation('chatbot.sampleQuestion3', preferences.language)}
              </button>
            </div>
          </div>

          {renderMessages()}

          {/* Floating Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            {renderInputForm()}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
} 