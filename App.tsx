import React, { useState, useEffect } from 'react';
import { GameState, Question } from './types';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import CertificateScreen from './components/CertificateScreen';
import { generateQuestions } from './services/gemini';

// Sound Effects
const SOUNDS = {
  start: "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-opener-222.mp3",
  correct: "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
  wrong: "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3",
  win: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INTRO);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lifelines, setLifelines] = useState({ phone: true, fifty: true });
  const [loadingText, setLoadingText] = useState("");

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed:", e));
  };

  const startGame = async () => {
    playSound(SOUNDS.start);
    setGameState(GameState.LOADING);
    setLoadingText("Bugihan, WhatsApp geçmişinizi tarıyor... 🕵️‍♂️");
    
    // Simulate steps for better UX
    setTimeout(() => setLoadingText("Anılar analiz ediliyor... ❤️"), 2000);
    setTimeout(() => setLoadingText("Buğrahan'ın şifreli mesajları çözülüyor... 🧩"), 4500);
    setTimeout(() => setLoadingText("Sorular hazırlanıyor... 📝"), 7000);

    try {
      // 13 Questions for the full Money Ladder (500 to 1 Million)
      const generatedQuestions = await generateQuestions(13);
      setQuestions(generatedQuestions);
      setGameState(GameState.PLAYING);
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu, lütfen sayfayı yenileyin.");
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Game Over / Victory
      playSound(SOUNDS.win);
      setGameState(GameState.CERTIFICATE);
    }
  };

  const handlePhoneFriend = () => {
    setLifelines(prev => ({ ...prev, phone: false }));
    const q = questions[currentQIndex];
    alert(`Bugihan'ın İpucu:\n\n"${q.funFact || 'Bu sorunun cevabı sanki ' + q.options[q.correctIndex] + ' gibi duruyor ama yine de sana kalmış! Dikkatli ol.'}"`);
  };

  const handleFiftyFifty = () => {
    setLifelines(prev => ({ ...prev, fifty: false }));
    // Logic handled in GameScreen visually
  };

  const resetGame = () => {
    setGameState(GameState.INTRO);
    setQuestions([]);
    setCurrentQIndex(0);
    setScore(0);
    setLifelines({ phone: true, fifty: true });
    setLoadingText("");
  };

  return (
    <div className="w-full h-full">
      {gameState === GameState.INTRO && (
        <IntroScreen onStart={startGame} loading={false} />
      )}

      {gameState === GameState.LOADING && (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-24 h-24 border-t-4 border-purple-500 border-solid rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl font-bold animate-pulse text-purple-200">{loadingText}</h2>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <GameScreen
          questions={questions}
          currentQuestionIndex={currentQIndex}
          onAnswer={handleAnswer}
          onPhoneAFriend={handlePhoneFriend}
          onFiftyFifty={handleFiftyFifty}
          lifelines={lifelines}
          playCorrectSound={() => playSound(SOUNDS.correct)}
          playWrongSound={() => playSound(SOUNDS.wrong)}
        />
      )}

      {gameState === GameState.CERTIFICATE && (
        <CertificateScreen 
          score={score} 
          totalQuestions={questions.length} 
          onRestart={resetGame}
        />
      )}
    </div>
  );
};

export default App;