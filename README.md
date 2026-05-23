# ✦ L'AI ZLAYJI

A web platform that uses **Google Gemini Vision AI** to recognize and explain Moroccan cultural heritage objects (zellige, pottery, monuments, traditional garments, etc.).

---

## 🗂 Project Structure

```
gestion de projet/
├── backend/                  # FastAPI server
│   ├── main.py               # API entry point (Gemini Vision integration)
│   ├── dataset_scraper.py    # Utility: scrape heritage sites for reference data
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile
│   ├── .env                  #  API key (not committed to git)
│   └── .env.example          # Template for .env
│
├── frontend/                 # React + Vite UI
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── index.css         # Global styles (Moroccan theme)
│   │   └── main.jsx          # React entry point
│   ├── public/
│   │   └── tajinedahbi.png
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # Run both services together
├── run.bat                   # Quick local dev launcher (Windows)
└── .gitignore
```

---

##  Running the Project

### Option A — Local dev (fastest)

1. **Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Or just double-click **`run.bat`** to launch both in separate windows.

### Option B — Docker

```bash
docker-compose up --build
```

- Frontend → http://localhost:5173  
- Backend API → http://localhost:8000

---

##  Environment Setup

Copy `.env.example` to `.env` inside the `backend/` folder and fill in your key:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Get a free API key at: https://aistudio.google.com/

---

## 🛠 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, Vite, Vanilla CSS       |
| Backend  | FastAPI, Python 3.11              |
| AI       | Google Gemini 2.5 Flash (Vision)  |
| Deploy   | Docker + docker-compose           |


