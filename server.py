from flask import Flask, render_template, request
from flask_wtf.csrf import CSRFProtect


app = Flask(__name__)


@app.route("/")
def home():
	response = request.args.get('response')
	return render_template('index.html')


if __name__ == '__main__':
	app.run(debug=True, host='localhost', port=8000)
