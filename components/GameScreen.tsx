import React, { useState, useEffect } from 'react';
import { Question, MONEY_LADDER } from '../types';
import confetti from 'canvas-confetti';

interface Props {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswer: (isCorrect: boolean) => void;
  onPhoneAFriend: () => void;
  onFiftyFifty: () => void;
  lifelines: { phone: boolean; fifty: boolean };
  playCorrectSound: () => void;
  playWrongSound: () => void;
}

const GameScreen: React.FC<Props> = ({ 
  questions, 
  currentQuestionIndex, 
  onAnswer, 
  onPhoneAFriend,
  onFiftyFifty,
  lifelines,
  playCorrectSound,
  playWrongSound
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const question = questions[currentQuestionIndex];

  // Reset local state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setRevealCorrect(false);
    setHiddenOptions([]);
  }, [currentQuestionIndex]);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null || hiddenOptions.includes(index)) return;
    
    setSelectedOption(index);
    
    // Slight delay for tension
    setTimeout(() => {
      setRevealCorrect(true);
      const isCorrect = index === question.correctIndex;
      
      if (isCorrect) {
        playCorrectSound();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        playWrongSound();
      }

      // Wait before moving on
      setTimeout(() => {
        onAnswer(isCorrect);
      }, 2500);
    }, 1500);
  };

  const handleFiftyFifty = () => {
    if (!lifelines.fifty) return;
    const incorrectIndices = question.options
      .map((_, i) => i)
      .filter(i => i !== question.correctIndex);
    
    // Shuffle and take 2
    const toHide = incorrectIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setHiddenOptions(toHide);
    onFiftyFifty();
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto p-4 gap-6">
      
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        
        {/* Lifelines */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={handleFiftyFifty}
            disabled={!lifelines.fifty || selectedOption !== null}
            className={`w-16 h-12 rounded-full border-2 border-purple-400 flex items-center justify-center transition-all ${!lifelines.fifty ? 'lifeline-used border-gray-600 bg-gray-800' : 'hover:bg-purple-900 bg-black'}`}
            title="50:50"
          >
            <span className="font-bold text-purple-300">50:50</span>
          </button>
          <button 
            onClick={onPhoneAFriend}
            disabled={!lifelines.phone || selectedOption !== null}
            className={`w-16 h-12 rounded-full border-2 border-purple-400 flex items-center justify-center transition-all ${!lifelines.phone ? 'lifeline-used border-gray-600 bg-gray-800' : 'hover:bg-purple-900 bg-black'}`}
            title="Bugihan'a Sor"
          >
            <i className="fas fa-robot text-purple-300"></i>
          </button>
        </div>

        {/* Question Bubble */}
        <div className="bg-black/80 border-2 border-purple-500 rounded-xl p-6 md:p-10 mb-8 text-center shadow-[0_0_30px_rgba(147,51,234,0.3)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <h2 className="text-xl md:text-3xl font-semibold leading-relaxed">
            {question.question}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            let stateClass = "";
            if (hiddenOptions.includes(index)) {
              stateClass = "opacity-0 pointer-events-none";
            } else if (revealCorrect) {
              if (index === question.correctIndex) stateClass = "correct animate-pulse";
              else if (index === selectedOption) stateClass = "wrong";
            } else if (selectedOption === index) {
              stateClass = "selected";
            }

            return (
              <div 
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`option-box rounded-full py-4 px-6 md:px-10 flex items-center transition-all duration-300 relative group ${stateClass}`}
              >
                <span className="font-bold text-yellow-500 mr-4 text-xl">{String.fromCharCode(65 + index)}:</span>
                <span className="text-lg md:text-xl font-medium">{option}</span>
                
                {/* Connector lines visual effect */}
                <div className="absolute left-0 top-1/2 -translate-x-full h-[1px] w-4 bg-gray-600 md:block hidden"></div>
                <div className="absolute right-0 top-1/2 translate-x-full h-[1px] w-4 bg-gray-600 md:block hidden"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Money Ladder Sidebar */}
      <div className="hidden lg:flex flex-col justify-center w-64 bg-black/40 rounded-xl border border-gray-800 p-4">
        <ul className="flex flex-col-reverse gap-1">
          {MONEY_LADDER.map((amount, index) => {
            const isActive = index === currentQuestionIndex;
            const isPast = index < currentQuestionIndex;
            
            return (
              <li 
                key={index}
                className={`
                  flex justify-between items-center px-4 py-2 rounded 
                  ${isActive ? 'bg-yellow-600 text-white font-bold border border-yellow-400' : ''}
                  ${isPast ? 'text-green-400' : 'text-gray-500'}
                  ${index === MONEY_LADDER.length - 1 ? 'text-white' : ''}
                `}
              >
                <span className="text-xs">{index + 1}</span>
                <span>{amount}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default GameScreen;