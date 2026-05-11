from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name') # Chỉ để lại những gì Model đang có

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'stock') # Khớp hoàn toàn với Model
    list_filter = ('category',)
    search_fields = ('name',)