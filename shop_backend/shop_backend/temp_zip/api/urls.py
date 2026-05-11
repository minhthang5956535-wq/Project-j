from django.urls import path
from products import views as product_views

urlpatterns = [
    # CÁI NÀY LÀ CỦA LINK SỐ 2 ĐANG LỖI NÈ:
    path('categories/', product_views.CategoryListView.as_view(), name='category-list'),
    
    # CÁC LINK CÒN LẠI:
    path('products/', product_views.ProductListAPIView.as_view(), name='product-list'),
    path('products/search/', product_views.ProductSearchAPIView.as_view(), name='product-search'),
    path('products/<int:id>/', product_views.ProductDetailAPIView.as_view(), name='product-detail'),
]