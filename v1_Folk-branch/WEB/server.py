# LIBS
#from decouple import config
from flask import Flask, render_template, request, jsonify
from zipfile import ZipFile
import os, io

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
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    file_size = os.fstat(file.stream.fileno()).st_size
    if file_size > MAX_FILE_SIZE_BYTES:
        #err_msg = ('File size (' + str(file_size / (1024 * 1024)) + ') exceeds the maximum allowed limit (' + str(MAX_FILE_SIZE_BYTES / (1024 * 1024)) + ' MB)')
        return jsonify({'error': 'File size exceeds the maximum allowed limit. (50 MB)'})
    
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
    
if __name__ == '__main__':
    if not DEMO_MODE:
        app.run(host='127.0.0.1', port=80)
    else:
        app.run(debug=True)