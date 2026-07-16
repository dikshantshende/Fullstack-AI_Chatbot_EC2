FROM python:3.10

WORKDIR /app
COPY . .

# Install backend
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# Init DB
RUN python scripts/init_db.py

# Expose port for Hugging Face Spaces
EXPOSE 7860

# Start Server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
