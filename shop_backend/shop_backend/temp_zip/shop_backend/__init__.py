import pymysql

# Cài đặt pymysql thay thế cho MySQLdb
pymysql.install_as_MySQLdb()

# --- ĐOẠN NÀY ĐỂ FIX LỖI VERSION ---
import MySQLdb

# Fake version thành 2.2.2 để lừa Django
if hasattr(MySQLdb, 'version_info'):
    MySQLdb.version_info = (2, 2, 2, 'final', 0)
    MySQLdb.mysql_version = (2, 2, 2, 'final', 0)