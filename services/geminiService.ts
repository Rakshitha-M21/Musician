
import { GoogleGenAI, Chat, StartChatParams } from "@google/genai";
import { Language, Musician } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export function createChatSession(musician: Musician | null, language: Language): Chat {
  const model = ai.chats.create({
    model: 'gemini-2.5-flash'
  });

  const history = [
    {
      role: "user",
      parts: [{
        text: `You are a helpful and knowledgeable chatbot expert on legendary musicians from Karnataka, India. Your name is Sangeetha Mitra. When asked, respond in a friendly and respectful tone. Answer all questions in ${language === 'en' ? 'English' : 'Kannada'}. ${musician ? `The user is specifically interested in ${musician.name}.` : ''}`
      }]
    },
    {
      role: "model",
      parts: [{ text: "ನಮಸ್ಕಾರ! Hello! I am Sangeetha Mitra, your guide to the amazing world of music from Karnataka. How can I help you today?" }]
    }
  ];

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
  });

  return chat;
}
