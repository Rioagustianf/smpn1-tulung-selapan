# Integrasi Model AI Lokal dengan Groq

Dokumentasi ini menjelaskan cara mengintegrasikan model AI lokal (BiLSTM) dengan Groq API untuk chatbot SMP Negeri 1 Tulung Selapan.

## Arsitektur Sistem

Sistem chatbot menggunakan arsitektur hybrid:

1. **Model AI Lokal (Primary)**: Model BiLSTM yang dilatih khusus untuk intent classification dan slot extraction
2. **Groq API (Fallback)**: Digunakan ketika model lokal tidak dapat memberikan jawaban yang tepat

## Alur Kerja

```
User Input → Model AI Lokal → Intent Classification → Knowledge Base Lookup
     ↓
  Jika tidak ada jawaban spesifik
     ↓
  Groq API (LLM Fallback)
```

## Setup dan Instalasi

### 1. Persiapan Model AI Lokal

```bash
# Masuk ke direktori model AI
cd "model ai/model-chatbot"

# Buat virtual environment (jika belum ada)
python -m venv ../venv

# Aktivasi virtual environment
# Windows:
..\venv\Scripts\activate
# Linux/Mac:
source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Konfigurasi Environment Variables

Tambahkan ke file `.env`:

```env
# AI/Chatbot Configuration
GROQ_API_KEY=your_groq_api_key_here
LOCAL_AI_URL=http://localhost:5000
```

### 3. Menjalankan Sistem

#### Opsi 1: Manual

1. **Jalankan Model AI Lokal:**
   ```bash
   # Terminal 1 - Model AI Flask Server
   cd "model ai/model-chatbot"
   python -m app.api
   ```

2. **Jalankan Next.js App:**
   ```bash
   # Terminal 2 - Next.js Development Server
   cd project
   npm run dev
   ```

#### Opsi 2: Menggunakan Script (Windows)

1. **Jalankan Model AI:**
   ```bash
   # Double-click atau jalankan dari command prompt
   project/scripts/start-local-ai.bat
   ```

2. **Jalankan Next.js App:**
   ```bash
   cd project
   npm run dev
   ```

#### Opsi 3: Menggunakan Python Script

```bash
# Jalankan model AI menggunakan Python script
python project/scripts/start-local-ai.py
```

## Fitur Integrasi

### 1. Intent Classification

Model AI lokal dapat mengklasifikasikan intent berikut:
- `tanya_jadwal` - Pertanyaan tentang jadwal pelajaran
- `tanya_guru` - Pertanyaan tentang informasi guru
- `tanya_info_siswa` - Pertanyaan tentang informasi siswa
- `tanya_visi_misi` - Pertanyaan tentang visi misi sekolah
- `tanya_sejarah` - Pertanyaan tentang sejarah sekolah
- `tanya_struktur_organisasi` - Pertanyaan tentang struktur organisasi
- `tanya_prestasi` - Pertanyaan tentang prestasi sekolah
- `tanya_kontak` - Pertanyaan tentang kontak sekolah
- `tanya_ekstrakurikuler` - Pertanyaan tentang ekstrakurikuler
- `tanya_fasilitas` - Pertanyaan tentang fasilitas sekolah
- `tanya_lokasi` - Pertanyaan tentang lokasi sekolah
- Dan lainnya...

### 2. Slot Extraction

Sistem dapat mengekstrak informasi penting dari input user:
- **Nama**: Nama siswa/guru (format: dua kata kapital atau lebih)
- **Kelas**: Format kelas (contoh: 7A, 8B, 9C)
- **Hari**: Hari dalam seminggu
- **Mata Pelajaran**: Nama mata pelajaran
- **Tanggal**: Format tanggal (dd/mm/yyyy atau dd-mm-yyyy)

### 3. Knowledge Base

Model AI menggunakan knowledge base lokal yang berisi:
- Informasi sekolah (lokasi, kontak, visi misi)
- Data guru dan mata pelajaran
- Jadwal pelajaran per kelas
- Informasi siswa
- Struktur organisasi
- Prestasi sekolah
- Fasilitas dan ekstrakurikuler

### 4. Fallback ke Groq

Jika model AI lokal tidak dapat memberikan jawaban spesifik, sistem akan:
1. Mendeteksi respons fallback dari model lokal (dimulai dengan `[LLM]`)
2. Secara otomatis menggunakan Groq API untuk memberikan respons yang lebih natural
3. Tetap mempertahankan konteks percakapan

## API Endpoints

### Model AI Lokal (Flask - Port 5000)

```http
POST /chat
Content-Type: application/json

{
  "text": "Siapa guru matematika kelas 8B?",
  "history": ["Halo", "Terima kasih"]
}
```

**Response:**
```json
{
  "response": "Guru Matematika kelas 8B adalah Ibu Sari, S.Pd., 10 tahun pengalaman.",
  "intent": "tanya_guru",
  "slots": {
    "mapel": "Matematika",
    "kelas": "8B"
  }
}
```

### Next.js API (Port 3000)

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Apa visi misi sekolah?",
  "history": ["Halo", "Terima kasih"]
}
```

**Response:**
```json
{
  "response": "Visi dan misi SMPN 1 Tulung Selapan: Visi: Membentuk pembelajar yang akhlakul kariman...",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Monitoring dan Debugging

### Log Messages

Sistem akan menampilkan log untuk monitoring:

```
# Ketika menggunakan model AI lokal
Local AI response - Intent: tanya_guru, Slots: {"mapel": "Matematika", "kelas": "8B"}

# Ketika fallback ke Groq
Local AI fallback detected, using Groq...

# Ketika model AI tidak tersedia
Local AI not available, using Groq...
```

### Error Handling

1. **Model AI tidak tersedia**: Otomatis fallback ke Groq
2. **Groq API error**: Menampilkan pesan error yang user-friendly
3. **Network timeout**: Retry mechanism dengan fallback

## Keuntungan Integrasi

1. **Akurasi Tinggi**: Model lokal dilatih khusus untuk domain sekolah
2. **Respons Cepat**: Model lokal memberikan respons instan untuk query yang dikenali
3. **Fallback Intelligent**: Groq menangani query kompleks yang tidak dapat dijawab model lokal
4. **Cost Effective**: Mengurangi penggunaan API Groq untuk query sederhana
5. **Offline Capability**: Model lokal dapat bekerja tanpa internet
6. **Contextual Understanding**: Sistem mempertahankan konteks percakapan

## Troubleshooting

### Model AI Tidak Berjalan

1. Pastikan virtual environment sudah dibuat dan diaktivasi
2. Install semua dependencies: `pip install -r requirements.txt`
3. Pastikan model file ada di `saved/chatbot_model.pt`
4. Cek port 5000 tidak digunakan aplikasi lain

### Groq API Error

1. Pastikan `GROQ_API_KEY` sudah diset dengan benar
2. Cek koneksi internet
3. Verifikasi quota API Groq

### Integration Issues

1. Pastikan `LOCAL_AI_URL` mengarah ke Flask server yang benar
2. Cek CORS settings jika ada masalah cross-origin
3. Verifikasi format request/response sesuai dengan API contract

## Pengembangan Lebih Lanjut

1. **Model Training**: Retrain model dengan data baru untuk meningkatkan akurasi
2. **Knowledge Base Update**: Update knowledge base dengan informasi terbaru
3. **Intent Expansion**: Tambah intent baru sesuai kebutuhan
4. **Performance Optimization**: Optimize model loading dan inference time
5. **Monitoring Dashboard**: Buat dashboard untuk monitoring usage dan performance