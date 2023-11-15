# LIBS
#from decouple import config
from flask import Flask, render_template, request, jsonify
from zipfile import ZipFile
import os, io
from static.script.py.MLA_pandas import *

# INIT
app = Flask(__name__, static_url_path='/static', static_folder='static')

# SHIPPING MODE
DEMO_MODE = False
app.config['ENV'] = 'production'
app.config['DEBUG'] = False

# VARIABLES
FILE_LOC = '_UPLOADS/files'
FOLDER_LOC = '_UPLOADS/folders'
MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 # IN (MB) SIZE LIMIT

# RUNNING HTML CODE (index.html)
@app.route('/')
def index():
    return render_template('index.html')

# RECEIVING FILES
@app.route('/_UPLOADS/files', methods=['POST'])
def upload_file():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No file part'})
    
    files = request.files.getlist('files[]')

    files_size = sum(os.fstat(file.stream.fileno()).st_size for file in files)
    if files_size > MAX_FILE_SIZE_BYTES:
        #err_msg = ('File size (' + str(file_size / (1024 * 1024)) + ') exceeds the maximum allowed limit (' + str(MAX_FILE_SIZE_BYTES / (1024 * 1024)) + ' MB)')
        return jsonify({'error': 'File size exceeds the maximum allowed limit. (50 MB)'})
    
    for file in files:
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        
        # DIR LOCATION FOR FILE SAVE
        upload_dir = os.path.join(os.getcwd(), FILE_LOC)
        # upload_dir = os.path.join(os.getcwd(), '_UPLOADS/files')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            
        file.save(os.path.join(upload_dir, file.filename))
    return jsonify({'message': 'File uploaded successfully'})
    
# RECEIVING FOLDERS
@app.route('/_UPLOADS/folders', methods=['POST'])
def upload_folder():
    if 'zipFile' not in request.files:
        return jsonify({'error': 'No zipFile part'})
    
    folder = request.files['zipFile']
    if folder.filename == '':
        return jsonify({'error': 'No selected file'})
    
    folder_size = os.fstat(folder.stream.fileno()).st_size
    if folder_size > MAX_FILE_SIZE_BYTES:
        err_msg = ('Folder size (' + str(folder_size / (1024 * 1024)) + ') exceeds the maximum allowed limit (' + str(MAX_FILE_SIZE_BYTES / (1024 * 1024)) + ' MB)')
        return jsonify({'error': 'Folder size exceeds the maximum allowed limit (50 MB)'})
    
    if folder:
        zip_data = io.BytesIO(folder.read())
        app.config['UPLOAD_FOLDER'] = FOLDER_LOC
        target_directory = os.path.join(app.config['UPLOAD_FOLDER'])
        # target_directory = os.path.join(app.config['UPLOAD_FOLDER'], 'unzipped')
        os.makedirs(target_directory, exist_ok=True)
        
        with ZipFile(zip_data, 'r') as zip_ref:
            zip_ref.extractall(target_directory)
            
        return jsonify({'success': True, 'target_directory': target_directory})
    return jsonify({'error': 'Unknown error'})    

# RECEIVING FILE NAME (READ DATA & SEND COLUMN NAMES...)
@app.route('/_UPLOADS/spreadsheet', methods=['POST'])
def r_DATA():
    data = request.get_json()
    r_Filename = data.get('Filename')
    
    SpreadSheet_path = './_UPLOADS/files/' + r_Filename
    df = read_data(SpreadSheet_path)
    df_col = display_columns_names(df)
    
    return jsonify({'df_col': df_col})

# RECEIVING FILE NAME & COLUMN NAMES (READ DATA & SEND INDEPENDENT & DEPENDENT ROWS...)
@app.route('/_UPLOADS/spreadsheet1', methods=['POST'])
def r_DATA1():
    data = request.get_json()
    r_Filename = data.get('Filename')
    r_Dropdown_VN = data.get('Dropdown_VN')
    
    SpreadSheet_path = './_UPLOADS/files/' + r_Filename
    df = read_data(SpreadSheet_path)
    IndCol_list, DepCol_list = Ind_Dep_title(df, r_Dropdown_VN)
    
    return jsonify({'IndCol_list': IndCol_list, 'DepCol_list': DepCol_list})

# RECEIVING FILE NAME & COLUMN NAMES (TRAINING & TESTING...)
@app.route('/_UPLOADS/spreadsheet2', methods=['POST'])
def r_DATA2():
    data = request.get_json()
    r_Filename = data.get('Filename')
    r_Dropdown_VN = data.get('Dropdown_VN')
    r_TestSize = data.get('TestSize')
    r_RandomState = data.get('RandomState')
    
    SpreadSheet_path = './_UPLOADS/files/' + r_Filename
    df = read_data(SpreadSheet_path)
    x, y = independent_dependent(df, r_Dropdown_VN)
    
    X_train, X_test, y_train, y_test = TrainTest_Split(x, y, r_TestSize, r_RandomState)
    
    Train_MLA = (len(X_train), len(y_train))
    Test_MLA = (len(X_test), len(y_test))
    
    return jsonify({'Train_MLA': Train_MLA, 'Test_MLA': Test_MLA})


if __name__ == '__main__':
    if not DEMO_MODE:
        app.run(debug=False, host='127.0.0.1', port=80)
    else:
        app.run(debug=True, host='127.0.0.1', port=80)