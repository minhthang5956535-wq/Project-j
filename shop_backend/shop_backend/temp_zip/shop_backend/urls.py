from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Đường dẫn API sẽ là: /api/products/
    path('api/', include('products.urls')),
]