#iscripit para gerar o primeiro usuário admin do site


from config import db_session
from werkzeug.security import generate_password_hash


try:
    cursor = db_session.cursor()
    cursor.execute("INSERT INTO certificadora.user (user_username, user_password, user_name, user_active, user_permision) " \
    "VALUES  (  %s, %s,  %s, %s, %s )",("admin",generate_password_hash('admin'),"admin",True,True))
    db_session.commit()
    cursor.close()
    print("First admin user created successfully.")
except Exception as e:
    print(f"An error occurred: {e}")