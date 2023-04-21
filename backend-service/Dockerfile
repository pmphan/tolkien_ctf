FROM python:3.10-slim

WORKDIR /opt

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV USER dockeruser
RUN useradd -m $USER
USER $USER

EXPOSE 5000

CMD ["uvicorn", "app.main:create_app", "--host", "0.0.0.0", "--port", "5000", "--factory"]
