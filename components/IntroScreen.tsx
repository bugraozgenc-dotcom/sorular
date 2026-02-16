import React from 'react';

interface Props {
  onStart: () => void;
  loading: boolean;
}

const IntroScreen: React.FC<Props> = ({ onStart, loading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fadeIn">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-purple-600 blur-3xl opacity-30 rounded-full"></div>
        <h1 className="relative text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4 drop-shadow-lg">
          Aşkın Milyoneri
        </h1>
        <h2 className="text-xl md:text-2xl text-purple-200 font-light tracking-widest">
          MELİSA & BUĞRAHAN
        </h2>
      </div>

      <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-purple-500/30 max-w-2xl shadow-2xl">
        <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
          Hoş geldin Melisa! Ben yapay zeka sunucun <strong>Bugihan</strong>. 
          Buğrahan ile olan WhatsApp geçmişinizi didik didik ettim ve ikiniz hakkında 
          ne kadar çok şey bildiğini test etmek için buradayım.
        </p>
        
        <p className="text-gray-400 mb-8 italic">
          "Unutma, her doğru cevap kalbini, her yanlış cevap... benim dilimi açar!" 😉
        </p>

        <button
          onClick={onStart}
          disabled={loading}
          className={`
            group relative px-10 py-4 rounded-full font-bold text-xl transition-all duration-300
            ${loading 
              ? 'bg-gray-600 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <i className="fas fa-spinner fa-spin"></i> Hazırlanıyor...
            </span>
          ) : (
            <span className="flex items-center gap-3">
              Yarışmaya Başla <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;