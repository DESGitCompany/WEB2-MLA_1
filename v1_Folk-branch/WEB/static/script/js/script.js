document.getElementById('FileUpload').addEventListener('change', OC_FileSelect);
document.getElementById('FolderUpload').addEventListener('change', OC_FolderSelect);
document.getElementById('Proceed').addEventListener('click', OC_Proceed_btn);
document.getElementById('TagetCol_dropdown').addEventListener('change', OC_Dropdown);
document.getElementById('Proceed1').addEventListener('click', OC_Proceed1_btn);
document.getElementById('Proceed2').addEventListener('click', OC_Proceed2_btn);
document.getElementById('Proceed3').addEventListener('click', OC_Proceed3_btn);
document.getElementById('Proceed4').addEventListener('click', OC_Proceed4_btn);

var DATA_Upload_G = '';
var Sel_Filename = '';
var Sel_TagetColName = '';
var is_file_SEL = false;
var is_Folders_SEL = false;

//START
(function Start() {
    const FileUpload = document.getElementById('FileUpload');
    const FolderUpload = document.getElementById('FolderUpload');

    FileUpload.setAttribute('multiple', '')

    FolderUpload.setAttribute('webkitdirectory', '');
    FolderUpload.setAttribute('webkitdirectory', '');
    FolderUpload.setAttribute('mozdirectory', '');
    FolderUpload.setAttribute('msdirectory', '');
    FolderUpload.setAttribute('odirectory', '');
    FolderUpload.setAttribute('directory', '');
    FolderUpload.setAttribute('multiple', '')
})();

//SELECT FILE
function OC_FileSelect(){
    is_file_SEL = true;
    is_Folders_SEL = false;
    const FileUpload = document.getElementById('FileUpload');
    DATA_Upload_G =  FileUpload;

    Select_init(FileUpload);
}

//SELECT FOLDER
function OC_FolderSelect(){
    is_Folders_SEL = true;
    is_file_SEL = false;
    const FolderUpload = document.getElementById('FolderUpload');
    DATA_Upload_G = FolderUpload;

    Select_init(FolderUpload);
}

//SELECT INIT (FILE / FOLDER)
function Select_init(RAW_DATA_Upload){
    const FileUpload_btn = document.getElementById('FileUpload_btn');
    const FolderUpload_btn = document.getElementById('FolderUpload_btn');
    const Upload_status = document.getElementById('Upload_status');

    FileUpload_btn.classList.remove('Enable');
    FolderUpload_btn.classList.remove('Enable');

    if(RAW_DATA_Upload.files.length > 0){
        if(is_file_SEL){
            var FileName_multi = '';
            for(var i = 0; i < RAW_DATA_Upload.files.length; i++){
                if((i+1) != RAW_DATA_Upload.files.length)
                {
                    FileName_multi += `${RAW_DATA_Upload.files[i].name}, `;
                }
                else{
                    FileName_multi += `${RAW_DATA_Upload.files[i].name}`;
                }
            }
            Upload_status.textContent = `File: ${FileName_multi}\n(Pls, Wait while file uploading...)`;
        }
        else if(is_Folders_SEL){
            var RelativePath_Folder = RAW_DATA_Upload.files[0].webkitRelativePath.split("/");
            Upload_status.textContent = `Folder: ${RelativePath_Folder[0]}/\n(Pls, Wait while folder uploading...)`;
        }
        Upload_status.classList.add('Enable');
        SendUpdate(RAW_DATA_Upload, FileName_multi, Upload_status);
    }
    else{
        Upload_status.textContent = "No File Chosen!";
    }
}
//SEND UPDATE (FILE / FOLDER)
function SendUpdate(RAW_DATA_Upload, FileName_multi, Upload_status){
    if(is_file_SEL){
        const DATA_Upload = RAW_DATA_Upload.files;

        if(DATA_Upload.length > 0)
        {
            var forData = new FormData();
            for(var i = 0; i < DATA_Upload.length; i++)
            {
                forData.append('files[]', DATA_Upload[i]);
            }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/_UPLOADS/files', true)
            
            xhr.onreadystatechange = function (){
                if(xhr.readyState === 4 && xhr.status === 200){
                    //Successful response
                    //var response = JSON.parse(xhr.responseText);
                    //console.log('Success:', response);
                    Upload_status.textContent = `File Successfully Uploaded!\n(File: ${FileName_multi})`;
                    SendUpdateCompleted_Callback();
                }else if(xhr.readyState === 4 && xhr.status !== 200){
                    //console.error('Error', xhr.status, xhr.statusText);
                    Upload_status.textContent = 'Pls, Error uploading file try later!';
                    alert('Pls, Error uploading file try later!');
                    location.reload();
                }
                else{
                    //Non-200 status code, handle error
                    try {
                        var response = JSON.parse(xhr.responseText);
                        if(response.error){
                            Upload_status.textContent = response.error;
                            alert(response.error);
                            location.reload();
                        }
                    }catch{}
                }
            };
            xhr.send(forData);
        }else{
            Upload_status.textContent = 'Pls, Choose a valid files!';
            alert('Pls, Choose a valid files!');
            location.reload();
        }
    }
    else if(is_Folders_SEL){
        const DATA_Upload = RAW_DATA_Upload.files

        if(DATA_Upload.length > 0){
            const zip = new JSZip();

            async function addFilesToZip(files, parentPath = ''){
                for(const file of files){
                    const path = parentPath + file.webkitRelativePath;

                    if(file.size > 0){
                        // Only add non-empty files to the zip
                        await new Promise((resolve) => {
                            file.arrayBuffer().then((content) => {
                                zip.file(path, content);
                                resolve();
                            });
                        });
                    }
                }
            }

            addFilesToZip(DATA_Upload).then(() => {
                zip.generateAsync({ type: 'blob'}).then(function (content) {
                    const formData = new FormData();
                    const zipBlob = new Blob([content], {type: 'application/zip'});
                    formData.append('zipFile', zipBlob, 'archive.zip');
                    
                    //USE AJAX TO SEND THE ZIP FILE TO THE SERVER...
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', '/_UPLOADS/folders', true);

                    xhr.onreadystatechange = function() {
                        if(xhr.readyState === 4 && xhr.status === 200){
                            //Successful response
                            //var response = JSON.parse(xhr.responseText);
                            //console.log('Success:', response);
                            var RelativePath_Folder = DATA_Upload[0].webkitRelativePath.split("/");
                            Upload_status.textContent = `Folder Successfully Uploaded!\nFolder: ${RelativePath_Folder[0]}`;
                            SendUpdateCompleted_Callback();
                        }else if(xhr.readyState === 4 && xhr.status !== 200){
                            Upload_status.textContent = 'Pls, Error uploading folder try later!';
                            alert('Pls, Error uploading folder try later!');
                            location.reload();
                        }else{
                            //Non-200 status code, handle error
                            try{
                                var response = JSON.parse(xhr.responseText);
                                if(response.error){
                                    Upload_status.textContent = response.error;
                                    alert(response.error);
                                    location.reload();
                                }
                            }catch{}
                        }
                    };
                    xhr.send(formData);
                });
            });
        }else{
            Upload_status.textContent = 'Pls, Choose a valid folder!';
            alert('Pls, Choose a valid folder!'); 
            location.reload(); 
        }
    }
}
//ONCE THE (FILE / FOLDER) UPLOADED -> NEXT PROCEED BTN
function SendUpdateCompleted_Callback(){
    const Proceed = document.getElementById('Proceed');
    Proceed.classList.add('Enable');
}

//GETTING COLUME NAME OF DF FOR DROPDOWN MENU -> NEXT PROCEED BTN
function OC_Proceed_btn(){
    const Proceed = document.getElementById('Proceed');
    const Upload_status = document.getElementById('Upload_status');

    Proceed.classList.remove('Enable');
    Upload_status.textContent = "Pls, Wait loading your uploaded data...";

    //NEXT SCREEN 3
    if(is_file_SEL){
        var is_DataSetValid = false;
        for(var i=0; i < DATA_Upload_G.files.length; i++){
            const FileName = (DATA_Upload_G.files[i].name).split('.');
            const FileExtension = FileName[1];
            if(FileExtension == 'csv' | FileExtension == 'xls' | FileExtension == 'xlsx'){
                is_DataSetValid = true;
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/_UPLOADS/spreadsheet', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = function(){
                    if(xhr.status === 200){
                        //Successful response
                        Sel_Filename = DATA_Upload_G.files[i].name;
                        const response = JSON.parse(xhr.responseText);
                        const df_col = response.df_col;
                        const TagetCol_dropdown = document.getElementById('TagetCol_dropdown');

                        df_col.forEach(colName => {
                            const option = document.createElement('option');
                            option.value = colName;
                            option.textContent = colName;
                            TagetCol_dropdown.appendChild(option);                        
                        });

                        const Spreadsheet_FN = document.getElementById('Spreadsheet_FN');
                        const TagetCol_txt = document.getElementById('TagetCol_txt');

                        Upload_status.classList.remove('Enable');
                        Spreadsheet_FN.textContent = FileName[0];
                        Spreadsheet_FN.classList.add('Enable');
                        TagetCol_txt.classList.add('Enable');
                        TagetCol_dropdown.classList.add('Enable');
                        
                    }else{
                        alert('Pls, Connection Error try later!');
                        location.reload();
                    }
                };
                const requestData = JSON.stringify({ Filename: DATA_Upload_G.files[i].name});
                xhr.send(requestData);
                return;
            }
        }
        if(!is_DataSetValid){
            alert('You need datasheet file to proceed!, But your files are saved!');
            location.reload();
        }
    }else if(is_Folders_SEL){
        alert('Pls, Try again later! Devs are working on this!');
        location.reload();
    }

}
function OC_Dropdown(){
    const TagetCol_dropdown = document.getElementById('TagetCol_dropdown');
    const Proceed1 = document.getElementById('Proceed1');

    if(TagetCol_dropdown.value != 'select'){
        Proceed1.classList.add('Enable');
    }else{
        Proceed1.classList.remove('Enable');
    }
}

//GETTING COLUME OF INDEPENDENT & DEPENDENT FROM DF. DISPLAY IN TABLE -> NEXT PROCEED BTN
function OC_Proceed1_btn(){
    const Spreadsheet_FN = document.getElementById('Spreadsheet_FN');
    const TagetCol_txt = document.getElementById('TagetCol_txt');
    const TagetCol_dropdown = document.getElementById('TagetCol_dropdown');
    const Proceed1 = document.getElementById('Proceed1');
    const Upload_status = document.getElementById('Upload_status');

    Spreadsheet_FN.classList.remove('Enable');
    TagetCol_txt.classList.remove('Enable');
    TagetCol_dropdown.classList.remove('Enable');
    Proceed1.classList.remove('Enable');
    Upload_status.textContent = "Pls, Wait loading your uploaded data...";
    Upload_status.classList.add('Enable');
    
    Sel_TagetColName = TagetCol_dropdown.value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/_UPLOADS/spreadsheet1', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(){
        if(xhr.status === 200){
            //Successful response
            Upload_status.classList.remove('Enable');

            const response = JSON.parse(xhr.responseText);
            const IndCol_list = response.IndCol_list;
            const DepCol_list = response.DepCol_list;

            const IndCol_table = document.getElementById('IndCol_table');
            CreateRow_table(IndCol_list, IndCol_table);
            const DepCol_table = document.getElementById('DepCol_table');
            CreateRow_table(DepCol_list, DepCol_table);

            const TableStyle_wrap = document.getElementById('TableStyle_wrap');
            const Proceed2 = document.getElementById('Proceed2');
            TableStyle_wrap.classList.add('Enable');
            Proceed2.classList.add('Enable');
        }else{
            alert('Pls, Connection Error try later!');
            location.reload();
        }
    };
    const requestData = JSON.stringify({Filename: Sel_Filename, Dropdown_VN: TagetCol_dropdown.value});
    xhr.send(requestData);
}
function CreateRow_table(ColList, ColTable){
    for(var i=0; i<ColList.length; i++){
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.textContent = ColList[i];
        row.appendChild(cell);
        ColTable.appendChild(row);
    }
}

//GETTING USER INPUT VALUE TEST SIZE & SHUFFLE -> NEXT PROCEED BTN
function OC_Proceed2_btn(){
    const TableStyle_wrap = document.getElementById('TableStyle_wrap');
    const Proceed2 = document.getElementById('Proceed2');
    const DataSplit_title = document.getElementById('DataSplit_title');
    const TestSize_input = document.getElementById('TestSize_input');
    const TestSize_float = document.getElementById('TestSize_float');
    const floatError = document.getElementById('floatError');
    const Shuffle_input = document.getElementById('Shuffle_input');
    const Shuffle_int = document.getElementById('Shuffle_int');
    const intError = document.getElementById('intError');
    const Proceed3 = document.getElementById('Proceed3');

    TableStyle_wrap.classList.remove('Enable');
    Proceed2.classList.remove('Enable');
    DataSplit_title.classList.add('Enable');
    TestSize_input.classList.add('Enable');
    TestSize_float.classList.add('Enable');
    floatError.classList.add('Enable');
    Shuffle_input.classList.add('Enable');
    Shuffle_int.classList.add('Enable');
    intError.classList.add('Enable');
    Proceed3.classList.add('Enable');
}
function TestSize_VF(input_TS){
    input_TS.value = input_TS.value.replace(/[^0-9.]/g, '');

    const floatValue = parseFloat(input_TS.value);
    const floatError = document.getElementById('floatError');

    if(isNaN(floatValue) || floatValue <= 0 || floatValue > 1){
        floatError.textContent = 'Please enter a valid float value between 0 and 1.';
    }else{
        floatError.textContent = '';
    }
}
function Shuffle_VI(input_S){
    input_S.value = input_S.value.replace(/[^0-9]/g, '');

    const intValue = parseInt(input_S.value);
    const intError = document.getElementById('intError');

    if(isNaN(intValue) || intValue <= 0 || intValue > 100){
        intError.textContent = 'Please enter a valid integer value between 0 and 100.';
    }else{
        intError.textContent = '';
    }
}

//GETTING SIZE OF TRAIN & TEST OF DF -> NEXT PROCEED BTN
function OC_Proceed3_btn(){
    const DataSplit_title = document.getElementById('DataSplit_title');
    const TestSize_input = document.getElementById('TestSize_input');
    const TestSize_float = document.getElementById('TestSize_float');
    const floatError = document.getElementById('floatError');
    const Shuffle_input = document.getElementById('Shuffle_input');
    const Shuffle_int = document.getElementById('Shuffle_int');
    const intError = document.getElementById('intError');
    const Proceed3 = document.getElementById('Proceed3');
    const Upload_status = document.getElementById('Upload_status');

    //CHECKING FOR CORRECT FORMAT
    const floatValue = parseFloat(TestSize_float.value);
    const intValue = parseInt(Shuffle_int.value);

    if(isNaN(floatValue) || floatValue <= 0 || floatValue > 1){
        return;
    }
    if(isNaN(intValue) || intValue <= 0 || intValue > 100){
        return;
    }

    DataSplit_title.classList.remove('Enable');
    TestSize_input.classList.remove('Enable');
    TestSize_float.classList.remove('Enable');
    floatError.classList.remove('Enable');
    Shuffle_input.classList.remove('Enable');
    Shuffle_int.classList.remove('Enable');
    intError.classList.remove('Enable');
    Proceed3.classList.remove('Enable');
    Upload_status.textContent = "Pls, Wait loading your uploaded data...";
    Upload_status.classList.add('Enable');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/_UPLOADS/spreadsheet2', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(){
        if(xhr.status === 200){
            //Successful response
            Upload_status.classList.remove('Enable');
            const response = JSON.parse(xhr.responseText);
            
            //WORKING LAST :
            console.log(response);
            

            const DataSplit_title = document.getElementById('DataSplit_title');
            const Train_status = document.getElementById('Train_status');
            const Test_status = document.getElementById('Test_status');
            const Proceed4 = document.getElementById('Proceed4');

            DataSplit_title.classList.add('Enable');
            Train_status.textContent = 'Train = (500, 6)';
            Train_status.classList.add('Enable');
            Test_status.textContent = '(600, 1)';
            Test_status.classList.add('Enable');
            Proceed4.classList.add('Enable');
        }else{
            alert('Pls, Connection Error try later!');
            location.reload();
        }
    };
    console.log(floatValue + " - " + intValue)
    const requestData = JSON.stringify({Filename: Sel_Filename, Dropdown_VN: Sel_TagetColName, TestSize: floatValue, RandomState: intValue});
    xhr.send(requestData);
}

// COMING UP...
function OC_Proceed4_btn(){
    alert('Upload for both file & folder is now working with optimzited UI & scripts, Rest of the work be continuing tm!');
    location.reload();
}

//alert('Upload for both file & folder is now working with optimzited UI & scripts, Rest of the work be continuing tm!');
//location.reload();