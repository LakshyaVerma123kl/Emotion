# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Create a user and switch to it
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Expose dynamic port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/v1/emotion/health || exit 1

# Run the app
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]