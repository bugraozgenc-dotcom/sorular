import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const CertificateScreen: React.FC<Props> = ({ score, totalQuestions, onRestart }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Trigger heavy confetti
    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const percentage = (score / totalQuestions) * 100;
  let title = "";
  let message = "";

  if (percentage === 100) {
    title = "MÜKEMMEL SEVGİLİ";
    message = "Buğrahan'ın hayatını ezbere biliyorsun! Bu aşk efsanevi!";
  } else if (percentage >= 70) {
    title = "HARİKA PARTNER";
    message = "Ufak tefek detaylar kaçsa da, kalbinin yeri doğru!";
  } else {
    title = "GELİŞTİRİLEBİLİR";
    message = "Sanırım biraz daha eski mesajları okumanız lazım 😉";
  }

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2] // Match aspect ratio
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save('Melisa-Bugrahan-Sertifika.pdf');
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Sertifika indirilirken bir sorun oluştu.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn">
      {/* Certificate Container to be captured */}
      <div 
        ref={certificateRef}
        className="bg-white text-black p-8 md:p-12 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.5)] max-w-3xl w-full text-center border-[20px] border-double border-yellow-600 relative overflow-hidden"
      >
        
        {/* Certificate Decoration */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-yellow-600 rounded-tl-3xl m-4"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-yellow-600 rounded-tr-3xl m-4"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-yellow-600 rounded-bl-3xl m-4"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-yellow-600 rounded-br-3xl m-4"></div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold text-yellow-700 mb-2">SERTİFİKA</h1>
        <p className="text-xl italic text-gray-600 mb-8">Bizi Ne Kadar Tanıyorsun? Özel Ödülü</p>

        <p className="text-lg text-gray-800 mb-4">Bu sertifika,</p>
        <h2 className="text-3xl md:text-5xl font-bold text-purple-700 mb-6 font-serif">MELİSA YILDIZ</h2>
        <p className="text-lg text-gray-800 mb-6">
          adına düzenlenmiş olup, Buğrahan ile olan ilişkisindeki üstün hafızası ve dikkati için verilmiştir.
        </p>

        <div className="my-8 py-4 border-t border-b border-gray-300">
          <h3 className="text-2xl font-bold text-gray-800 tracking-widest">{title}</h3>
          <p className="text-gray-600 mt-2">{message}</p>
          <p className="text-sm text-gray-400 mt-4">Skor: {score} / {totalQuestions}</p>
        </div>

        <div className="flex justify-between items-end mt-12 px-8">
          <div className="text-center">
            <p className="font-serif italic border-b border-black pb-1 mb-2">12/03/2026</p>
            <p className="text-xs uppercase tracking-widest text-gray-500">Tarih</p>
          </div>
          <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
             <i className="fas fa-heart text-4xl text-white"></i>
          </div>
          <div className="text-center">
            <p className="font-serif italic border-b border-black pb-1 mb-2 font-bold text-lg" style={{fontFamily: 'Cursive'}}>Buğrahan</p>
            <p className="text-xs uppercase tracking-widest text-gray-500">Onaylayan</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-full text-white font-bold transition shadow-lg flex items-center justify-center gap-2"
        >
          {isDownloading ? (
             <><i className="fas fa-spinner fa-spin"></i> İndiriliyor...</>
          ) : (
             <><i className="fas fa-file-pdf"></i> Sertifikayı İndir</>
          )}
        </button>

        <button 
          onClick={onRestart}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-bold transition shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fas fa-redo"></i> Tekrar Oyna
        </button>
      </div>
    </div>
  );
};

export default CertificateScreen;