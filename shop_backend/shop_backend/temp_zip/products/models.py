from django.db import models

# 1. Bảng Danh Mục (Ví dụ: Điện thoại, Laptop, Quần áo...)
class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Tên danh mục")
    description = models.TextField(blank=True, null=True, verbose_name="Mô tả")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# 2. Bảng Sản Phẩm
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, verbose_name="Danh mục")
    name = models.CharField(max_length=200, verbose_name="Tên sản phẩm")
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="Giá (VNĐ)")
    description = models.TextField(blank=True, null=True, verbose_name="Mô tả chi tiết")
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Ảnh sản phẩm")
    is_active = models.BooleanField(default=True, verbose_name="Còn bán không?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name