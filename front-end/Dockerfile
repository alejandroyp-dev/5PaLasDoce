FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir livereload

COPY . .

EXPOSE 8080

CMD ["python", "server.py"]
