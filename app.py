from flask import Flask

app = Flask(__name__)
app.secret_key = "your_super_secret_key_here"

from routes import *

if __name__ == "__main__":
    app.run(debug=True)