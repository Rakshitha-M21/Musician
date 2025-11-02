
import React, { useState, useCallback } from 'react';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import { Musician, Screen } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedMusician, setSelectedMusician] = useState<Musician | null>(null);

  const handleStartChat = useCallback((musician: Musician | null) => {
    setSelectedMusician(musician);
    setCurrentScreen('chat');
  }, []);

  const handleGoBack = useCallback(() => {
    setCurrentScreen('home');
    setSelectedMusician(null);
  }, []);

  return (
    <div className="w-full min-h-screen font-sans">
      {currentScreen === 'home' ? (
        <HomeScreen onStartChat={handleStartChat} />
      ) : (
        <ChatScreen initialMusician={selectedMusician} onGoBack={handleGoBack} />
      )}
    </div>
  );
};

export default App;
