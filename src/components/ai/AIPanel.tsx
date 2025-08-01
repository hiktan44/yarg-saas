'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  X, 
  Minimize2, 
  Maximize2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  FileText,
  Brain
} from 'lucide-react';
import Button from '../ui/Button';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  llmProvider?: 'openai' | 'anthropic' | 'google';
  metadata?: {
    documentTitle?: string;
    processingTime?: number;
    tokenCount?: number;
  };
}

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocument?: {
    id: string;
    title: string;
    content: string;
    institution: string;
  };
  messages: AIMessage[];
  onSendMessage: (message: string, llmProvider: string) => void;
  isLoading: boolean;
}

export default function AIPanel({
  isOpen,
  onClose,
  selectedDocument,
  messages,
  onSendMessage,
  isLoading
}: AIPanelProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLLM, setSelectedLLM] = useState<'openai' | 'anthropic' | 'google'>('openai');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;
    
    onSendMessage(inputMessage, selectedLLM);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const llmOptions = [
    { id: 'openai', name: 'ChatGPT', icon: '🤖', color: 'bg-green-100 text-green-800' },
    { id: 'anthropic', name: 'Claude', icon: '🧠', color: 'bg-orange-100 text-orange-800' },
    { id: 'google', name: 'Gemini', icon: '✨', color: 'bg-blue-100 text-blue-800' }
  ];

  const suggestedQuestions = [
    "Bu belgenin ana konusu nedir?",
    "Önemli hukuki sonuçları nelerdir?",
    "Bu karar hangi durumlar için emsal teşkil eder?",
    "Belgeyi özetleyebilir misin?",
    "Bu kararın benzer örnekleri var mı?"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed right-0 top-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 flex flex-col ${
            isMinimized ? 'w-80' : 'w-96 lg:w-[32rem]'
          }`}
        >
          {/* Panel Başlığı */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  AI Analiz
                </h3>
                {selectedDocument && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-48">
                    {selectedDocument.title}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* LLM Seçici */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Modeli
                  </span>
                </div>
                <div className="flex gap-2">
                  {llmOptions.map((llm) => (
                    <button
                      key={llm.id}
                      onClick={() => setSelectedLLM(llm.id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedLLM === llm.id
                          ? llm.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="mr-1">{llm.icon}</span>
                      {llm.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mesajlar */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && selectedDocument && (
                  <div className="space-y-4">
                    {/* Doküman Bilgisi */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Analiz için seçilen doküman
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {selectedDocument.title}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {selectedDocument.institution}
                      </p>
                    </div>

                    {/* Önerilen Sorular */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Önerilen Sorular
                      </h4>
                      <div className="space-y-2">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => setInputMessage(question)}
                            className="w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {question}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      
                      {message.metadata && (
                        <div className="mt-2 text-xs opacity-70">
                          {message.metadata.processingTime && (
                            <span>⏱️ {message.metadata.processingTime}ms</span>
                          )}
                        </div>
                      )}

                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                            className="p-1 h-6 w-6"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Analiz ediliyor...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Mesaj Girişi */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      selectedDocument
                        ? "Doküman hakkında soru sorun..."
                        : "Bir doküman seçin ve soru sorun..."
                    }
                    disabled={!selectedDocument || isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || !selectedDocument || isLoading}
                    className="px-4 py-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}