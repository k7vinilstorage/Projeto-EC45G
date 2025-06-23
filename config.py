import psycopg2


db_session = psycopg2.connect(
    database="certificadora",
    user="nome_usuario",
    host="localhost",
    password="senha123",
    port=5432
)

print("Database connection established successfully.")
