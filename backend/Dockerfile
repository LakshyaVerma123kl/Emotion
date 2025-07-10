# Dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Create a user and switch to it
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Health check (optional but good)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/emotion/health || exit 1

# Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
