import psycopg2
# Database connection configuration

db_session = psycopg2.connect(
    database="certificadora",
    user="postgres",
    host="localhost",
    password="root",
    port=5432
)

print("Database connection established successfully.")