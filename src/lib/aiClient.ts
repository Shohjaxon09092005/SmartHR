import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =  "AIzaSyCpTyhVz0GL9x-mOYPUFpHa936fZr2tbeo";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2000,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    if (error.message?.includes("API_KEY_INVALID")) {
      return "XATO: API kaliti noto'g'ri. Google AI Studio dan yangi API kalit oling.";
    } else if (error.message?.includes("quota")) {
      return "XATO: API limiti tugagan. Iltimos, keyinroq urinib ko'ring.";
    } else if (error.message?.includes("404")) {
      return "XATO: Model topilmadi. Iltimos, model nomini tekshiring.";
    }

    return "AI xizmatida texnik xatolik. Iltimos, keyinroq urinib ko'ring.";
  }
}

export async function generateResume(userData: {
  name: string;
  experience: string;
  skills: string;
  education: string;
}): Promise<string> {
  const prompt = `PROFESSIONAL RESUME YARATING. FAQRAT RESUME MATNINI QAYTARING, BOSHQA IZOHLAR QO'SHMANG.

Quyidagi ma'lumotlar asosida professional, tuzilgan va ish beruvchiga jozibador resume yarating:

ISMI: ${userData.name}
TAJRIBA: ${userData.experience}
KO'NIKMALAR: ${userData.skills}
TA'LIM: ${userData.education}

RESUME FORMATI:
• Ism va kontakt ma'lumotlari
• Professional maqsad yoki summary
• Ish tajribasi (vaqt, lavozim, kompaniya, vazifalar)
• Texnik va professional ko'nikmalar
• Ta'lim
• Loyihalar (agar mavjud bo'lsa)
• Sertifikatlar (agar mavjud bo'lsa)
• Qo'shimcha ma'lumotlar (tillar, mukofotlar)

TALABLAR:
1. Faqat resume matnini qaytaring
2. Hech qanday "Soha:", "Vazifa:", "Javob:" kabi sarlavhalar qo'shmang
3. Professional formatda bo'lsin
4. Aniq bandlar va strukturasi bo'lsin
5. Ingliz yoki o'zbek tilida, qisqa va tushunarli
6. Batafsil va amaliy bo'lsin
7. Ish beruvchi e'tiborini tortadigan kalit so'zlar ishlating

Boshlang:`;

  return await callGeminiAPI(prompt);
}


export async function analyzeResume(resumeText: string): Promise<{
  skills: string[];
  experience: string;
  recommendations: string[];
}> {
  const prompt = `CV TAHLLI QILISH. FAQRAT JSON FORMATDA JAVOB BERING.

Quyidagi CV ni tahlil qiling va quyidagi strukturada JSON qaytaring:

{
  "skills": ["ko'nikma1", "ko'nikma2", "ko'nikma3"],
  "experience": "tajriba darajasi va yillari",
  "recommendations": ["tavsiya1", "tavsiya2", "tavsiya3"]
}

CV MATNI:
${resumeText.substring(0, 3000)}

TALABLAR:
1. skills: Asosiy texnik va professional ko'nikmalarni aniqlang
2. experience: Tajriba yillari va darajasini aniqlang (boshlang'ich, o'rta, senior)
3. recommendations: CV ni yaxshilash uchun amaliy tavsiyalar bering
4. Faqat JSON formatida javob bering, boshqa matn qo'shmang

JSON:`;

  const response = await callGeminiAPI(prompt);

  try {
    // JSON ni extract qilish
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Ma'lumotlarni tekshirish va to'ldirish
      return {
        skills: Array.isArray(parsed.skills) ? parsed.skills : ["Ko'nikmalar aniqlanmadi"],
        experience: parsed.experience || "Tajriba aniqlanmadi",
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ["Tavsiyalar aniqlanmadi"]
      };
    }

    // Agar JSON topilmasa, default qaytarish
    throw new Error("JSON format topilmadi");

  } catch (error) {
    console.error("CV tahlil xatosi:", error);
    // Default response
    return {
      skills: ["JavaScript", "React", "TypeScript", "Node.js"],
      experience: "3+ yil dasturlash tajribasi",
      recommendations: [
        "Loyihalaringizni batafsilroq yozing",
        "Ko'nikmalaringizni kategoriyalarga ajrating",
        "Aniq raqamlar va natijalar qo'shing",
        "Professional summary qo'shing"
      ]
    };
  }
}

export async function generateJobDescription(jobTitle: string, requirements: string): Promise<string> {
  const prompt = `Vakansiya: ${jobTitle}

Quyidagi ma'lumotlar asosida professional ish tavsifi yarating:

${requirements}

Iltimos, quyidagi strukturada professional ish tavsifini O'zbek tilida yarating:

Kompaniya haqida:
[kompaniya haqida qisqacha ma'lumot]

Lavozim haqida:
[lavozimning asosiy maqsadi]

Asosiy vazifalar:
- [vazifa 1]
- [vazifa 2]
- [vazifa 3]

Talab qilinadigan ko'nikmalar:
- [ko'nikma 1]
- [ko'nikma 2]
- [ko'nikma 3]

Afzallikli ko'nikmalar:
- [qo'shimcha ko'nikma 1]
- [qo'shimcha ko'nikma 2]

Biz taklif qilamiz:
- [taklif 1]
- [taklif 2]
- [taklif 3]

Ariza topshirish:
[qanday ariza topshirish kerakligi]

Tavsif professional, jozibador va aniq bo'lsin.`;

  return await callGeminiAPI(prompt);
}