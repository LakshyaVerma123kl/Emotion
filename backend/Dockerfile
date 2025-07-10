# Use official slim Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app

# Create a non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Expose default port (Render will override it dynamically)
EXPOSE 8000

# Health check for Render (adjust endpoint if needed)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/v1/emotion/health || exit 1

# Start the app using environment-injected port
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
