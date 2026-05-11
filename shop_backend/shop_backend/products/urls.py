from django.urls import path
from . import views

urlpatterns = [
    # ==========================================
    # 1. API KHÁCH (Lấy danh sách, tìm kiếm)
    # ==========================================
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('products/', views.ProductListAPIView.as_view(), name='product-list'),
    path('products/search/', views.ProductSearchAPIView.as_view(), name='product-search'),
    path('products/<int:id>/', views.ProductDetailAPIView.as_view(), name='product-detail'),

    # ==========================================
    # 2. API ADMIN (Thêm, Sửa, Xóa)
    # ==========================================
    path('admin/products/', views.AdminProductCreateAPIView.as_view(), name='admin-product-create'),
    path('admin/products/<int:id>/', views.AdminProductDetailAPIView.as_view(), name='admin-product-detail'),
]