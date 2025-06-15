from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    navn = "Word vini"
    return render_template("index.html", navn=navn)

def outr():
    navn = "segunda"
    return render_template("outr.html", navn=navn)

