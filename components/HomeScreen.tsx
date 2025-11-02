
import React from 'react';
import { MUSICIANS } from '../constants';
import { Musician } from '../types';

interface HomeScreenProps {
  onStartChat: (musician: Musician | null) => void;
}

const MusicianCard: React.FC<{ musician: Musician; onClick: () => void }> = ({ musician, onClick }) => (
  <div
    className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
    onClick={onClick}
  >
    <img
      src={musician.imageUrl}
      alt={musician.name}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-4 text-white">
      <h3 className="text-lg font-bold">{musician.name}</h3>
      <p className="text-sm opacity-80">{musician.lifespan}</p>
    </div>
  </div>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartChat }) => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center my-8 md:my-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900 tracking-tight">
          Musicians Who Made Karnataka Proud
        </h1>
        <h2 className="mt-2 text-xl md:text-2xl font-semibold text-amber-700">
          ಕರ್ನಾಟಕವನ್ನು ಹೆಮ್ಮೆಪಡಿಸಿದ ಸಂಗೀತಗಾರರು
        </h2>
      </header>

      <main className="flex-grow w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {MUSICIANS.map((musician) => (
            <MusicianCard
              key={musician.id}
              musician={musician}
              onClick={() => onStartChat(musician)}
            />
          ))}
        </div>
      </main>

      <footer className="w-full py-8 mt-8 flex justify-center">
        <button
          onClick={() => onStartChat(null)}
          className="group flex items-center justify-center gap-3 rounded-full bg-amber-800 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:bg-amber-900 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-500"
        >
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🎤</span>
          Start Chatting
        </button>
      </footer>
    </div>
  );
};

export default HomeScreen;
