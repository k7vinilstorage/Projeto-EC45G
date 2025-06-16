from app import app
from flask import render_template

@app.route("/")
def index():
    navn = "Word vini"
    return render_template("index.html", navn=navn)

@app.route("/outr.html")
def outr():
    return render_template("outr.html")
