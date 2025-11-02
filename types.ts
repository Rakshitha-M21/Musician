
export interface Musician {
  id: number;
  name: string;
  imageUrl: string;
  bio: {
    en: string;
    kn: string;
  };
  lifespan: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export type Language = 'en' | 'kn';

export type Screen = 'home' | 'chat';
