from django.contrib import admin
from .models import Category, Product

# 1. Quản lý Danh mục
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)

# 2. Quản lý Sản phẩm
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_active', 'image')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')