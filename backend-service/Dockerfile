FROM python:3.10-slim

WORKDIR /opt

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD uvicorn app.main:create_app --factory --host 0.0.0.0 --port 5000 --reload
