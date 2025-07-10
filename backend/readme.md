# Emotion Reflection API

This is a FastAPI-based backend service for analyzing emotions from user text input. It provides both a mock logic-based analyzer and a lightweight real-time sentiment analyzer using VADER.

---

## 🛠️ Features

- 🔍 Text-based emotion detection
- 📊 Emotion statistics tracking
- 🧠 Lightweight real sentiment analysis (via VADER)
- 🧪 Optionally mock responses for testing
- 📦 RESTful API built using FastAPI
- 🧱 Docker and local environment support

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/emotion-reflection-api.git
cd emotion-reflection-api
```

### 2. Create and Activate Virtual Environment

```bash
python -m venv venv
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Run the Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

📜 License
MIT License © Lakshya Verma

Let me know if you’d like:

- your GitHub link and name added
- to include `Docker Compose` usage
- frontend integration instructions too

I can customize it further as needed.
