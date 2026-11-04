FROM python:3.14-slim AS builder

RUN mkdir /backend
WORKDIR /backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 
 
RUN pip install --upgrade pip 
COPY requirements.txt /backend/
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.14-slim
 
RUN useradd -m -r backend && \
   mkdir /backend && \
   chown -R backend /backend

COPY --from=builder /usr/local/lib/python3.14/site-packages/ /usr/local/lib/python3.14/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
 
WORKDIR /backend
 
COPY --chown=backend:backend . .

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

USER backend
 
EXPOSE 8000 

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "core.wsgi:application"]