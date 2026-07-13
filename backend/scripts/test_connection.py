from app.services.mysql_connection import engine

conn = engine.connect()

print("✅ Connected to MySQL!")

conn.close()