import os

# Đường dẫn chính xác tới file gây lỗi trên máy Nhật
file_path = r"C:\Users\nhatdaika\AppData\Local\Programs\Python\Python314\Lib\site-packages\django\db\backends\mysql\features.py"

print(f"Dang kiem tra file: {file_path}")

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Code thuốc đặc trị để tắt tính năng gây lỗi
    fix_code = """
    @cached_property
    def can_return_columns_from_insert(self):
        return False

    @cached_property
    def can_return_rows_from_bulk_insert(self):
        return False
"""

    # Kiểm tra xem file đã có thuốc chưa
    if "def can_return_columns_from_insert" not in content:
        print("-> Chua co thuoc, dang tiem thuoc vao...")
        
        # Tìm chỗ khai báo Class và chèn code thuốc vào ngay bên dưới
        new_content = content.replace(
            "class DatabaseFeatures(BaseDatabaseFeatures):", 
            "class DatabaseFeatures(BaseDatabaseFeatures):\n" + fix_code
        )
        
        # Ghi lại file đã sửa
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print("✅ DA SUA LOI XONG! (Gio Nhat co the chay migrate ngon lanh)")
    else:
        print("⚠️ File nay da duoc sua tu truoc roi, khong can sua lai nua.")

except Exception as e:
    print(f"❌ Co loi khi sua file: {e}")