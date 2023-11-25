from flask import Flask, render_template, request, jsonify

# INIT
app = Flask(__name__, static_url_path='/static', static_folder='static')

# SHIPPING MODE
DEMO_MODE = False
app.config['ENV'] = 'production'
app.config['DEBUG'] = False

# RUNNING HTML CODE (index.html)
@app.route('/')
def index():
    return render_template('index.html')


# FUNCTIONS
@app.route('/DataProcess_ADD', methods=['POST'])
def process_data():
    data = request.get_json()
    r_A_GET = data.get('A_GET')
    r_B_GET = data.get('B_GET')
    
    s_Output0_SET = r_A_GET + r_B_GET
    
    return jsonify({'s_Output0_SET': s_Output0_SET})


if __name__ == '__main__':
    if not DEMO_MODE:
        app.run(debug=False, host='127.0.0.1', port=80)
    else:
        app.run(debug=True, host='127.0.0.1', port=80)