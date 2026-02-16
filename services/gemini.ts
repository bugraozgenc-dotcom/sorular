import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";
import { CHAT_LOG } from "../chatData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to give Gemini a persona
const SYSTEM_PROMPT = `
Sen Melisa ve Buğrahan'ın ilişkisi hakkında "Kim Milyoner Olmak İster" tarzı bir yarışma sunucusu olan "Bugihan"sın.
Sana verilen WhatsApp konuşma geçmişini analiz ederek sorular oluşturacaksın.
Çok karizmatik, esprili, hafif flörtöz ve biraz da çöpçatan bir tarzın var. Kendine has bir üslubun olsun.
Sorular ilişkinin detayları, komik anlar, ilkler, tartışmalar ve özel tarihler hakkında olmalı.
Cevapları analiz ederken verilen doğru/yanlış tepkileri de ona göre ayarla.
`;

// Backup questions to ensure the game NEVER ends early if AI fails to generate enough
const BACKUP_QUESTIONS: Question[] = [
  {
    id: 901,
    question: "Buğrahan 'Şadiye Melisa Yıldız' diye kime hitap etti?",
    options: ["Sana", "Annesine", "Issız adaya düşerse yanına alacağı şeye", "Telefon rehberindeki ismine"],
    correctIndex: 2,
    successMessage: "Bugihan: Vay canına! Bu detayı hatırlaman takdire şayan.",
    failMessage: "Bugihan: Ah be Melisa... Adam seni ıssız adaya götürecekmiş, sen unuttun.",
    funFact: "9 Ocak 2026'da ıssız adaya düşerse yanına alacağı 3 şeyden biri sensin."
  },
  {
    id: 902,
    question: "Melisa'nın 'Bize bir de diyor yemek yapamam salata yapamam yalannnnn' tepkisine Buğrahan ne cevap verdi?",
    options: ["Yemek demedim ki salata dedim", "Ben her şeyi yaparım", "Elimden her iş gelir", "Annem sağ olsun"],
    correctIndex: 0,
    successMessage: "Bugihan: İşte gerçek bir hafıza!",
    failMessage: "Bugihan: Salata ile yemek arasındaki farkı unutmuşuz...",
    funFact: "Buğrahan: 'Yemek demedim ki salata dedim hala yapamıyorum 😄'"
  },
  {
    id: 903,
    question: "Buğrahan'ın rüyasında sizi nerede gördüğü ortaya çıktı?",
    options: ["Paris'te", "Okulda", "Düğünde", "Mars'ta"],
    correctIndex: 1,
    successMessage: "Bugihan: Rüyaların efendisi doğru bildi!",
    failMessage: "Bugihan: Rüyaları bile unutuyorsak işimiz zor.",
    funFact: "26 Aralık'ta: 'Dün rüyamda gördüm seni okuldaydık'"
  },
  {
    id: 904,
    question: "Buğrahan'a göre 'Kestane soyup vermek' ne anlama geliyor?",
    options: ["Zaman kaybı", "Önemli plan & Emek", "Kış aktivitesi", "Sıkıcı bir iş"],
    correctIndex: 1,
    successMessage: "Bugihan: Emeğe saygı! Doğru cevap.",
    failMessage: "Bugihan: O kadar kestane soydu, emek dedi... Yazık oldu.",
    funFact: "1 Ocak 2026: 'Önemli plan. Kestaneyi soyup vermek. Emek'"
  },
  {
    id: 905,
    question: "Melisa 'Zekamı kimse sorgulamasın lütfen' dedikten sonra ne ekledi?",
    options: ["Ben Einstein'ım", "Arada kullanıyorum", "Çok yorgunum", "Herkes hayran"],
    correctIndex: 1,
    successMessage: "Bugihan: Zekice bir cevap!",
    failMessage: "Bugihan: Kendi zekana yaptığın şakayı unuttun mu?",
    funFact: "24 Aralık: 'Zekamı kimse sorgulamasın lütfen 😎 Arada kullanıyorum'"
  },
  {
    id: 906,
    question: "Buğrahan sana aşık olmasının sebebinin ne OLMADIĞINI söyledi?",
    options: ["Güzel olman", "Zeki olman", "Yalnız ya da kaybolmuş olması", "İyi yemek yapman"],
    correctIndex: 2,
    successMessage: "Bugihan: Aşkın en saf hali... Gözlerim doldu.",
    failMessage: "Bugihan: Bu kadar romantik bir cümleyi nasıl hatırlamazsın?",
    funFact: "14 Ocak: 'Sana aşık olmamın sebebi yalnız ya da kaybolmuş olmam değildi.'"
  },
  {
    id: 907,
    question: "Buğrahan 'Kabağı dolaba koysam bir şey olur mu?' diye sorduğunda saat kaçtı?",
    options: ["Öğlen 12:00", "Akşam 19:00", "Gece yarısı 00:15", "Sabah 08:00"],
    correctIndex: 2,
    successMessage: "Bugihan: Gece kuşları iş başında!",
    failMessage: "Bugihan: O saatte kabak derdine düşen adamı unuttun.",
    funFact: "22 Aralık 00:15'te gelen efsanevi kabak sorusu."
  },
  {
    id: 908,
    question: "Hangi tatlıları sevmiyorsun?",
    options: ["Baklava ve Sütlaç", "Trileçe ve Soğuk Baklava", "Kazandibi ve Güllaç", "Künefe ve Katmer"],
    correctIndex: 1,
    successMessage: "Bugihan: Ağzının tadını biliyorsun (ya da bilmiyorsun)!",
    failMessage: "Bugihan: Kendi sevmediğin tatlıları bile karıştırdın Melisa.",
    funFact: "16 Aralık: 'Sütlü tatlıların genelini severim trileçe ve soğuk baklava hariç'"
  },
  {
    id: 909,
    question: "Buğrahan kendini başkalarına nasıl tanıtıyormuş (şaka yollu)?",
    options: ["Pilot", "Doktor", "Özel Güvenlik Görevlisi", "Mühendis"],
    correctIndex: 2,
    successMessage: "Bugihan: Güvenlik önlemleri alındı, cevap doğru!",
    failMessage: "Bugihan: Ahmet çok haklıymış...",
    funFact: "17 Aralık: 'İnanma beni özel güvenlik görevlisi diye tanıtıyor'"
  },
  {
    id: 910,
    question: "Buğrahan senin hangi eşyanı 'çalacağını' (kibar versiyonu) söyledi?",
    options: ["Ceketini", "Şampuanını", "Kitabını", "Telefonunu"],
    correctIndex: 1,
    successMessage: "Bugihan: Temizlik imandan, doğru cevap hafızadan gelir!",
    failMessage: "Bugihan: Kardeşinin şampuanını koruyamadın.",
    funFact: "6 Ocak: 'Sen bilirsin kardeşiminkini çalıcamın kibar versiyonu (Şampuan)'"
  },
  {
    id: 911,
    question: "Buğrahan sabah sabah senden ne dinlemeni istedi?",
    options: ["Tarkan - Kuzu Kuzu", "YouTube'dan bir link (fTmMtlvi41c)", "Müslüm Gürses", "Beethoven"],
    correctIndex: 1,
    successMessage: "Bugihan: Müzik kulağın harika!",
    failMessage: "Bugihan: O sabah sana attığı şarkıyı unuttun mu?",
    funFact: "22 Aralık 09:34: 'sabah sabah benden dinle'"
  },
  {
    id: 912,
    question: "Buğrahan'ın 'köylü akrabası' kimmiş?",
    options: ["Kamuran Akkor", "Aysun Cozar", "Fatma Güncan", "Esra"],
    correctIndex: 1,
    successMessage: "Bugihan: Akrabaları tanıdık!",
    failMessage: "Bugihan: Aysun'u nasıl tanımazsın? O köylü akraba!",
    funFact: "14 Aralık: 'Aysun cozar mı o... Evet benim köylü akraba'"
  },
  {
    id: 913,
    question: "Buğrahan'a göre 'Geleceğimiz için çalışmaya' ne zaman başladı?",
    options: ["16 Ocak 2026", "2020 Pandemi", "Hiç başlamadı", "Dün"],
    correctIndex: 0,
    successMessage: "Bugihan: Ve büyük ödül! Bu aşkın geleceği parlak!",
    failMessage: "Bugihan: Son soruda mı? Geleceğinizi unuttun Melisa...",
    funFact: "16 Ocak: 'önceden geleceğim için çalışıyordum ama artık geleceğimiz için de çalışıorum'"
  }
];

export const generateQuestions = async (count: number = 13): Promise<Question[]> => {
  try {
    const prompt = `
    Aşağıdaki WhatsApp konuşma geçmişini analiz et ve Melisa'ya sormak üzere TAM OLARAK ${count} adet çoktan seçmeli soru oluştur.
    Sorular çok kolaydan başlayıp (500 puanlık), gittikçe zorlaşarak (1 Milyonluk) ilerlemeli.
    
    Çıktıyı SADECE geçerli bir JSON dizisi olarak ver. 
    LÜTFEN DİKKAT: JSON formatı bozulmasın ve dizi içinde tam ${count} obje olsun.
    
    JSON formatı:
    [
      {
        "id": 1,
        "question": "Soru metni",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0,
        "successMessage": "Bugihan: Tebrik mesajı",
        "failMessage": "Bugihan: Hata mesajı",
        "funFact": "Kısa bilgi"
      }
    ]

    CHAT LOG:
    ${CHAT_LOG}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json"
      }
    });

    const jsonString = response.text;
    if (!jsonString) throw new Error("No response from AI");

    let questions = JSON.parse(jsonString) as Question[];

    // ROBUST FALLBACK: Ensure we have exactly 'count' questions
    if (questions.length < count) {
      console.warn(`Bugihan ${questions.length} soru üretebildi, yedek depodan ${count - questions.length} soru ekleniyor.`);
      const needed = count - questions.length;
      // Filter backup questions to avoid duplicates (checking IDs is basic but works for this context)
      // Actually, just taking from the backup list sequentially is safer to avoid complexity
      const fillers = BACKUP_QUESTIONS.slice(0, needed);
      
      // Update IDs of fillers to continue the sequence
      const lastId = questions.length > 0 ? questions[questions.length - 1].id : 0;
      const fillersWithIds = fillers.map((q, i) => ({
        ...q,
        id: lastId + 1 + i
      }));
      
      questions = [...questions, ...fillersWithIds];
    }
    
    // If we somehow still have more than needed (unlikely but possible if API hallucinates), trim
    return questions.slice(0, count);

  } catch (error) {
    console.error("Error generating questions, using backup:", error);
    // Return full backup list if API fails completely
    return BACKUP_QUESTIONS.slice(0, count);
  }
};

export const getHostComment = async (currentQuestion: Question, isCorrect: boolean): Promise<string> => {
  const prompt = `
  Yarışmacı Melisa, şu soruya ${isCorrect ? 'DOĞRU' : 'YANLIŞ'} cevap verdi.
  Sunucu adın: Bugihan.
  Soru: "${currentQuestion.question}"
  Cevap Durumu: ${isCorrect ? 'Doğru' : 'Yanlış'}
  
  Ona sunucu Bugihan olarak kısa, tek cümlelik, ${isCorrect ? 'övücü ve coşkulu' : 'hafif sitemkar ve şakacı'} bir yorum yap.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || (isCorrect ? "Bugihan: Harika gidiyorsun!" : "Bugihan: Ah be Melisa...");
  } catch (e) {
    return isCorrect ? "Bugihan: Mükemmel!" : "Bugihan: Üzgünüm yanlış cevap.";
  }
};