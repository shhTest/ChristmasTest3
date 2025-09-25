import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

SECRET_KEY = "dev-secret-key"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "urls"
WSGI_APPLICATION = "wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}

# ---- 靜態檔案設定 ----
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]  # React build 的 js/css
STATIC_ROOT = BASE_DIR / "staticfiles"

# ---- 模板 ----
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # React 的 index.html
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
            ],
        },
    },
]
