import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// URL untuk model AI lokal - bisa diatur untuk deployment terpisah
// Development: http://localhost:5000
// Production: https://your-flask-api-domain.com atau IP server Flask
const LOCAL_AI_URL = process.env.LOCAL_AI_URL || "http://localhost:5000";

// Timeout untuk request ke model AI lokal (dalam ms)
const LOCAL_AI_TIMEOUT = parseInt(process.env.LOCAL_AI_TIMEOUT || "10000");

// Fungsi untuk berkomunikasi dengan model AI lokal
const getLocalAIResponse = async (message: string, history: string[] = []) => {
  try {
    // Buat AbortController untuk timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LOCAL_AI_TIMEOUT);

    const response = await fetch(`${LOCAL_AI_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
        history: history,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Local AI API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    // Validasi response dari Flask API
    if (!data || typeof data.response !== "string") {
      throw new Error("Invalid response format from local AI");
    }

    return {
      response: data.response,
      intent: data.intent || "unknown",
      slots: data.slots || {},
      source: "local_ai",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Local AI request timeout");
    } else {
      console.error("Error calling local AI:", error);
    }
    return null;
  }
};

// Fungsi untuk mendapatkan respons dari Groq
const getGroqResponse = async (message: string) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Anda adalah asisten virtual untuk SMP Negeri 1 Tulung Selapan. Anda membantu menjawab pertanyaan tentang sekolah ini. Informasi sekolah:
          
          - Nama: SMP Negeri 1 Tulung Selapan
          - Alamat: Jl. Merdeka Tulung Selapan, Kec., Tulung Selapan, Kab. Ogan Komering Ilir, Prov., Sumatera Selatan
          - Luas tanah: 17.640 m²
          - Email: smpn1tulungselapan@yahoo.com
          - Telepon: 083175234544
          
          Visi: Membentuk pembelajar yang akhlakul kariman, berilmu, beretika, berwawasan lingkungan untuk menuju pentas dunia.
          
          Misi:
          - Mewujudkan pendidikan dengan keteladanan
          - Mengembangkan budaya belajar dengan didasari pada kecintaan terhadap ilmu pengetahuan
          - Meningkatkan fasilitas sekolah menuju sekolah bersih, sehat dan berwawasan lingkungan
          
          Tujuan 2025:
          1. 100% Seluruh Guru/Staf memberikan pelayanan, keteladanan kepada para pengguna jasa dengan pendekatan agama, etika, dan budaya
          2. 100% Siswa melakukan syariat agama, etika dan budaya baik di Sekolah maupun diluar
          3. 90% Fasilitas sekolah mendekati Standar Nasional Pendidikan (SNP)
          4. 80% Siswa berprestasi baik ditingkat regional, nasional maupun Global
          
          Jawab dengan ramah dan informatif dalam bahasa Indonesia.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return {
      response:
        chatCompletion.choices[0]?.message?.content ||
        "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.",
      source: "groq",
    };
  } catch (error) {
    console.error("Error getting Groq response:", error);
    return {
      response: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
      source: "groq_error",
    };
  }
};

// Fungsi utama yang mengintegrasikan model AI lokal dengan Groq
export const getChatResponse = async (
  message: string,
  history: string[] = []
) => {
  try {
    // Coba gunakan model AI lokal terlebih dahulu
    const localResponse = await getLocalAIResponse(message, history);

    if (localResponse && localResponse.response) {
      // Jika model lokal berhasil dan tidak menggunakan fallback
      if (!localResponse.response.startsWith("[LLM]")) {
        return localResponse.response;
      }

      // Jika model lokal menggunakan fallback, gunakan Groq
      const groqResponse = await getGroqResponse(message);
      return groqResponse.response;
    }

    // Jika model lokal tidak tersedia, gunakan Groq
    const groqResponse = await getGroqResponse(message);
    return groqResponse.response;
  } catch (error) {
    console.error("Error in getChatResponse:", error);

    // Fallback terakhir ke Groq jika terjadi error
    try {
      const groqResponse = await getGroqResponse(message);
      return groqResponse.response;
    } catch (groqError) {
      console.error("Error with Groq fallback:", groqError);
      return "Maaf, terjadi kesalahan pada sistem. Silakan coba lagi nanti.";
    }
  }
};
