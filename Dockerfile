# =========================
# ---------- Frontend ----------
# =========================
FROM node:18-bullseye AS frontend-builder

WORKDIR /app/frontend

# 複製 package.json 並安裝依賴
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps \
    && npm install ajv@^6 ajv-keywords@^3 --legacy-peer-deps

# 複製前端原始碼並建置 React
COPY frontend/ ./
RUN npm run build

# =========================
# Runtime (Node + Python)
# =========================
FROM node:18-bullseye

WORKDIR /app

# 安裝 Python 與系統依賴
RUN apt-get update && apt-get install -y \
    python3 python3-pip libpq-dev curl build-essential \
    && python3 -m pip install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

# 複製後端需求並安裝 Python 套件
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# 複製後端程式碼
COPY backend/ ./backend

# 複製前端建置結果到 Django 可讀取目錄
RUN mkdir -p backend/static backend/templates
COPY --from=frontend-builder /app/frontend/build/static ./backend/static
COPY --from=frontend-builder /app/frontend/build/index.html ./backend/templates/index.html

# 開放 Django port
EXPOSE 8000

# 啟動 Django (開發用)
CMD ["python3", "backend/manage.py", "runserver", "0.0.0.0:8000"]
