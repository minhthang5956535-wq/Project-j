import os
import django

# Thiết lập môi trường Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop_backend.settings')
django.setup()

from products.models import Product, Category

def seed_data():
    print("Sẵn sàng nạp dữ liệu...")
    
    # 1. Tạo danh mục
    p1_cat, _ = Category.objects.get_or_create(name='Controller')
    p2_cat, _ = Category.objects.get_or_create(name='Motor')
    p3_cat, _ = Category.objects.get_or_create(name='Frame')
    
    # 2. Tạo sản phẩm mẫu
    data = [
        {
            'name': 'FC SkyStars F405 HD2',
            'category': p1_cat,
            'price': 950000,
            'description': 'FC chất lượng cao cho drone FPV',
            'image_url': 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lkp6p6p6p6p6p6'
        },
        {
            'name': 'Motor EMAX ECO II',
            'category': p2_cat,
            'price': 350000,
            'description': 'Động cơ siêu bền bỉ',
            'image_url': 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lkp6p6p6p6p6p6'
        },
        {
            'name': 'Khung Mark4 5 inch',
            'category': p3_cat,
            'price': 450000,
            'description': 'Khung carbon siêu nhẹ',
            'image_url': 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lkp6p6p6p6p6p6'
        }
    ]

    for item in data:
        p, created = Product.objects.get_or_create(name=item['name'], defaults=item)
        if created:
            print(f" - Đã tạo sản phẩm: {p.name}")
        else:
            print(f" - Sản phẩm đã tồn tại: {p.name}")

    print("--- HOÀN THÀNH NẠP DỮ LIỆU ---")

if __name__ == "__main__":
    seed_data()
