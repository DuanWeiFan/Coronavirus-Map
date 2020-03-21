from flask import render_template, Flask
from flask_assets import Bundle, Environment
from Web_scrapper_new import Web_scrapper
import pandas as pd
import json
import os

app = Flask(__name__)

js = Bundle('coronavirus-map.js', 'coronavirus-table.js', 'coronavirus.js' , output='gen/main.js')

assets = Environment(app)
assets.register('main_js', js)

scrapper = None

@app.before_first_request
def init():
    global scrapper
    scrapper = Web_scrapper()

@app.route('/')
def root():
    return render_template('us-map.html')

@app.route('/svg')
def svg():
    return render_template('svg.html')

@app.route('/us-map')
def us_map():
    return render_template('us-map.html')

@app.route('/svg-map')
def svg_map():
    return render_template('svg-map.html')

@app.route('/get-data')
def get_data():
    df = pd.read_csv('data/employees.csv')
    print(df.head())
    return df.to_json(orient='records')

@app.route('/get-coronavirus-data')
def get_coronavirus_data():
    global scrapper
    cache_coronavirus = json.dumps(scrapper.get_coronavirus_cases())
    return cache_coronavirus

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, port=port, host='0.0.0.0')
