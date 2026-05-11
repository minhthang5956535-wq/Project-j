from pathlib import Path
from datetime import timedelta # <-- Thêm cái này để cấu hình thời gian sống của Token

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST_DIR = BASE_DIR.parent / 'fpc done VN' / 'fpc-done-VN' / 'dist'

# Security
SECRET_KEY = 'django-insecure-*6(4@vhwz)q*0sw$f98fbfhfh$8-w2i!alcje-d72-1x#(9(^@'
DEBUG = True
ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # --- Thư viện cài thêm ---
    'rest_framework',
    'rest_framework_simplejwt', # <-- BỔ SUNG: Thư viện JWT Token
    'corsheaders',
    'django_filters', 

    # --- App của hệ thống ---
    'api',       # <-- BỔ SUNG: App api của đại ca
    'products',  # App sản phẩm
    'orders',    # <-- BỔ SUNG: App quản lý giỏ hàng, đơn hàng (sắp tạo)
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # CORS để trên cùng cho chắc
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'shop_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [FRONTEND_DIST_DIR] if FRONTEND_DIST_DIR.exists() else [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'shop_backend.wsgi.application'

# --- DATABASE: Cấu hình SQLite ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
# -----------------------------------------------------------

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Ho_Chi_Minh' # <-- Đổi sang giờ VN cho chuẩn lúc chốt đơn
USE_I18N = True
USE_TZ = True

# Static files & Media (Cho phép upload ảnh sản phẩm)
STATIC_URL = 'static/'
STATICFILES_DIRS = [FRONTEND_DIST_DIR] if FRONTEND_DIST_DIR.exists() else []

MEDIA_URL = '/media/'                  # <-- BỔ SUNG: URL để truy cập ảnh
MEDIA_ROOT = BASE_DIR / 'media'        # <-- BỔ SUNG: Nơi lưu ảnh upload

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- Cấu hình CORS ---
CORS_ALLOW_ALL_ORIGINS = True

# --- CẤU HÌNH DJANGO REST FRAMEWORK & JWT ---
REST_FRAMEWORK = {
    # Cấu hình mặc định bắt buộc dùng JWT để xác thực
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Có thể thêm cấu hình phân trang (Pagination) ở đây nếu API trả về nhiều sản phẩm
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),   # Token sống 1 ngày (để test cho dễ)
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Refresh token sống 7 ngày
    'AUTH_HEADER_TYPES': ('Bearer',),             # Header gửi lên: "Authorization: Bearer <token>"
}