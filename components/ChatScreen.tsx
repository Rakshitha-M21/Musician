
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from "@google/genai";
import { Musician, ChatMessage, Language } from '../types';
import { createChatSession } from '../services/geminiService';
import { BackArrowIcon, MicrophoneIcon, SendIcon, SpinnerIcon } from './icons';

interface ChatScreenProps {
  initialMusician: Musician | null;
  onGoBack: () => void;
}

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isBot = message.sender === 'bot';
  return (
    <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow-md ${
          isBot
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
            : 'bg-indigo-600 text-white rounded-br-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 justify-start">
        <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none">
            <div className="flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-0"></span>
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-200"></span>
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-400"></span>
            </div>
        </div>
    </div>
);


const ChatScreen: React.FC<ChatScreenProps> = ({ initialMusician, onGoBack }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const session = createChatSession(initialMusician, language);
    setChatSession(session);

    let initialMessageText = language === 'en'
      ? `Hello! I'm Sangeetha Mitra. Ask me anything about the legendary musicians of Karnataka.`
      : `ನಮಸ್ಕಾರ! ನಾನು ಸಂಗೀತ ಮಿತ್ರ. ಕರ್ನಾಟಕದ ದಿಗ್ಗಜ ಸಂಗೀತಗಾರರ ಬಗ್ಗೆ ನೀವು ಏನು ಬೇಕಾದರೂ ಕೇಳಬಹುದು.`;
    
    if (initialMusician) {
      initialMessageText = language === 'en'
        ? `You've selected ${initialMusician.name}. ${initialMusician.bio.en} Feel free to ask me more!`
        : `ನೀವು ${initialMusician.name} ಅವರನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ. ${initialMusician.bio.kn} ಅವರ ಬಗ್ಗೆ ಮತ್ತಷ್ಟು ಕೇಳಿ!`;
    }
    
    setMessages([{ id: Date.now(), text: initialMessageText, sender: 'bot' }]);
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMusician, language]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() || isLoading || !chatSession) return;

    const userMessage: ChatMessage = { id: Date.now(), text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userInput });
      const botMessage: ChatMessage = { id: Date.now() + 1, text: response.text, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, chatSession]);
  
  const handleLanguageToggle = (lang: Language) => {
    if(lang !== language) {
        setLanguage(lang);
        setMessages([]); // Reset messages on language change to re-initialize
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <button onClick={onGoBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <BackArrowIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{initialMusician?.name || 'Karnataka Musicians'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chat with Sangeetha Mitra</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full bg-gray-200 dark:bg-gray-700">
            <button onClick={() => handleLanguageToggle('en')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}>
                EN
            </button>
            <button onClick={() => handleLanguageToggle('kn')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'kn' ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}>
                ಕ
            </button>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
      </main>

      <footer className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <MicrophoneIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={language === 'en' ? 'Type or speak...' : 'ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...'}
            className="flex-1 w-full rounded-full bg-gray-200 dark:bg-gray-700 px-4 py-2.5 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="p-2.5 rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatScreen;
