from rest_framework import serializers
from .models import Category, Product

# Cái này đang thiếu nè đại ca!
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # Hiển thị luôn tên danh mục thay vì chỉ hiện ID
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name', 'description', 'price', 'stock', 'image', 'created_at']