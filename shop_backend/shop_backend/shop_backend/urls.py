from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings

from django.views.static import serve
import os

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    
    # Auth API
    path('api/', include('api.urls')),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Để Django serve được các file JS, CSS từ folder assets
    re_path(r'^assets/(?P<path>.*)$', serve, {
        'document_root': os.path.join(settings.FRONTEND_DIST_DIR, 'assets'),
    }),

    # Để phục vụ các file ở root của dist (ví dụ: favicon.svg)
    re_path(r'^(?P<path>.*\.(svg|png|jpg|ico|webmanifest))$', serve, {
        'document_root': settings.FRONTEND_DIST_DIR,
    }),

    # Catch-all để trả về index.html cho React Router (hoặc trang chính)
    re_path(
        r'^(?!api|admin|media|assets).*$', 
        TemplateView.as_view(template_name='index.html') 
        if settings.FRONTEND_DIST_DIR.exists() 
        else lambda request: __import__('django.http').http.HttpResponse("Chưa build Frontend! Vui lòng vào cổng của Vite (thường là 5173).")
    ),
]