# Panduan Deployment Sistem Chatbot

Sistem chatbot ini terdiri dari 2 komponen yang dapat di-deploy secara terpisah:
1. **Flask API** (Model AI BiLSTM)
2. **Next.js Frontend** (Sistem Informasi + Chatbot UI)

## Arsitektur Deployment

```
┌─────────────────┐    HTTP Request    ┌─────────────────┐
│   Next.js App   │ ──────────────────► │   Flask API     │
│  (Frontend)     │                     │  (AI Model)     │
│ Port: 3000      │ ◄────────────────── │ Port: 5000      │
└─────────────────┘    JSON Response    └─────────────────┘
```

## 1. Deployment Flask API (Model AI)

### Persiapan Environment

```bash
# Masuk ke direktori model AI
cd "model-ai/model-chatbot"

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Menjalankan Flask API

```bash
# Development
python -m app.api

# Production dengan Gunicorn (Linux/Mac)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app.api:app

# Production dengan Waitress (Windows)
pip install waitress
waitress-serve --host=0.0.0.0 --port=5000 app.api:app
```

### Deployment ke Server/Cloud

#### Option 1: VPS/Dedicated Server
1. Upload folder `model-ai` ke server
2. Install Python dan dependencies
3. Jalankan dengan Gunicorn/Waitress
4. Setup reverse proxy dengan Nginx (opsional)

#### Option 2: Heroku
```bash
# Di direktori model-ai/model-chatbot
echo "web: gunicorn app.api:app" > Procfile
echo "python-3.11.0" > runtime.txt
git init
git add .
git commit -m "Initial commit"
heroku create your-flask-api-name
git push heroku main
```

#### Option 3: Railway/Render
1. Connect repository ke platform
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python -m app.api`

## 2. Deployment Next.js Frontend

### Konfigurasi Environment

Update file `.env` dengan URL Flask API yang sudah di-deploy:

```env
# Production Flask API URL
LOCAL_AI_URL=https://your-flask-api-domain.com
# atau
LOCAL_AI_URL=http://YOUR_SERVER_IP:5000

# Timeout (opsional)
LOCAL_AI_TIMEOUT=15000
```

### Build dan Deploy

```bash
# Install dependencies
npm install

# Build untuk production
npm run build

# Test production build locally
npm start
```

### Deployment Options

#### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow the prompts
```

#### Option 2: Netlify
1. Build: `npm run build`
2. Publish directory: `.next`
3. Upload atau connect Git repository

#### Option 3: VPS dengan PM2
```bash
# Install PM2
npm install -g pm2

# Start aplikasi
pm2 start npm --name "chatbot-frontend" -- start

# Setup startup script
pm2 startup
pm2 save
```

## 3. Konfigurasi CORS (Penting!)

Pastikan Flask API mengizinkan request dari domain Next.js:

```python
# Di app/api.py
from flask_cors import CORS

app = Flask(__name__)

# Development
CORS(app)

# Production (lebih aman)
CORS(app, origins=[
    "https://your-nextjs-domain.com",
    "http://localhost:3000"  # untuk development
])
```

## 4. Environment Variables untuk Production

### Flask API (.env)
```env
FLASK_ENV=production
FLASK_DEBUG=False
```

### Next.js (.env.production)
```env
LOCAL_AI_URL=https://your-flask-api-domain.com
LOCAL_AI_TIMEOUT=15000
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

## 5. Monitoring dan Logging

### Flask API Logging
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health')
def health_check():
    return {'status': 'healthy', 'timestamp': datetime.now().isoformat()}
```

### Next.js Monitoring
- Gunakan Vercel Analytics untuk monitoring
- Setup error tracking dengan Sentry (opsional)

## 6. Troubleshooting

### Common Issues

1. **CORS Error**
   - Pastikan Flask API mengizinkan origin Next.js
   - Check browser console untuk error details

2. **Connection Timeout**
   - Increase `LOCAL_AI_TIMEOUT` value
   - Check Flask API server status

3. **Model Loading Error**
   - Pastikan semua file model ada di server
   - Check Python dependencies

4. **Environment Variables**
   - Pastikan semua env vars ter-set dengan benar
   - Restart aplikasi setelah mengubah env vars

## 7. Scaling Considerations

### Flask API
- Gunakan multiple workers dengan Gunicorn
- Implement caching untuk model predictions
- Consider using Redis untuk session storage

### Next.js
- Enable ISR (Incremental Static Regeneration)
- Use CDN untuk static assets
- Implement proper caching headers

## 8. Security Best Practices

1. **API Security**
   - Implement rate limiting
   - Use HTTPS untuk production
   - Validate input data

2. **Environment Security**
   - Jangan commit file .env ke Git
   - Gunakan secrets management untuk production
   - Regular update dependencies

## Contoh Deployment URLs

- **Flask API**: `https://chatbot-ai-api.herokuapp.com`
- **Next.js App**: `https://smp-tulung-selapan.vercel.app`
- **Environment Variable**: `LOCAL_AI_URL=https://chatbot-ai-api.herokuapp.com`

Dengan setup ini, kedua aplikasi dapat di-deploy dan di-scale secara independen, memberikan fleksibilitas maksimal untuk maintenance dan pengembangan.