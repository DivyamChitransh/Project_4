const files = ['document1.txt', 'presentation1.pdf', 'song1.mp3', 'installer1.exe', 'archive1.rar', 
    'report1.docx', 'image1.jpg', 'graphic1.png', 'animation1.gif', 'compressed1.zip', 'document2.txt', 
    'presentation2.pdf', 'song2.mp3', 'installer2.exe', 'archive2.rar', 'report2.docx', 'image2.jpg', 
    'graphic2.png', 'animation2.gif', 'compressed2.zip', null, 'presentation3.pdf', '', 'installer3.exe',
    'archive3.rar', 'report3.docx', 'image3.jpg', 'graphic3.png', 'animation3.gif', 'compressed3.zip', 
    'document4.txt', 'presentation4.pdf', 'song4.mp3', 'installer4.exe', 'archive4.rar', 'report4.docx', 
    'image4.jpg', 'graphic4.png', 'animation4.gif', 'compressed4.zip', 'document5.txt', 'presentation5.pdf', 
    'song5.mp3', 'installer5.exe', 'archive5.rar', 'report5.docx', 'image5.jpg', 'graphic5.png', 'animation5.gif', 
    'compressed5.zip', 'document6.txt', 'presentation6.pdf', 'song6.mp3', 'installer6.exe', 'archive6.rar', 
    'report6.docx', 'image6.jpg', null, 'animation6.gif', 'compressed6.zip', 'document7.txt', 'presentation7.pdf', 
    'song7.mp3', 'installer7.exe', 'archive7.rar', 'report7.docx', 'image7.jpg', 'graphic7.png', 'animation7.gif', 
    'compressed7.zip', 'document8.txt', 'presentation8.pdf', 'song8.mp3', 'installer8.exe', 'archive8.rar', 'report8.docx', 
    'image8.jpg', '', 'animation8.gif', 'compressed8.zip', 'document9.txt', 'presentation9.pdf', 'song9.mp3', 'installer9.exe', 
    'archive9.rar', 'report9.docx', 'image9.jpg', '', 'animation9.gif', 'compressed9.zip', 'document10.txt', 'presentation10.pdf',
    'song10.mp3', 'installer10.exe', 'archive10.rar', 'report10.docx', 'image10.jpg', 'graphic10.png', 'animation10.gif', 
    'compressed10.zip', ];

const fileIcons = { '.txt': 'https://via.placeholder.com/200?text=TXT',
        '.pdf': 'https://via.placeholder.com/200?text=PDF',
        '.mp3': 'https://via.placeholder.com/200?text=MP3',
        '.exe': 'https://via.placeholder.com/200?text=EXE',
        '.rar': 'https://via.placeholder.com/200?text=RAR',
        '.docx': 'https://via.placeholder.com/200?text=DOCX',
        '.jpg': 'https://via.placeholder.com/200?text=JPG',
        '.png': 'https://via.placeholder.com/200?text=PNG',
        '.gif': 'https://via.placeholder.com/200?text=GIF',
        '.zip': 'https://via.placeholder.com/200?text=ZIP',
    };
let fileHistory = JSON.parse(localStorage.getItem('fileHistory')) || {};
const categorizeFiles = (files) => {
    const categorized = {};
    files.forEach(file => {
        if(file){
        const extension = file.split('.').pop();
        if(!categorized[extension]){
            categorized[extension] = [];
        }
        categorized[extension].push(file);
    }
    });
    return categorized;
}
const displayFolders = () => {
    const folderlist = document.getElementById('folderslist');
    const categorizedFiles = categorizeFiles(files);
    Object.keys(categorizedFiles).forEach(fileType => {
        const folder = document.createElement('li');
        folder.textContent = fileType.toUpperCase();
        folder.addEventListener('click', () => 
            displayFiles(categorizedFiles[fileType],fileType));
        folderlist.appendChild(folder);
    });
};
const displayFiles = (fileArray) => {
const fileList = document.getElementById('fileslist');
fileList.innerHTML = '';
fileArray.forEach((file) => {
    const listitem = document.createElement('li');
    const fileextension = file.split('.').pop();
    const iconurl = fileIcons['.' + fileextension] || '';
    const filename = file.split('.')[0];
    const img = document.createElement('img');
    img.src = iconurl;
    img.alt = filename;
    const span = document.createElement('span');
    span.textContent = filename;
    const editbtn = document.createElement('button');
    editbtn.className = 'editbutton';
    editbtn.textContent = 'Edit';
    editbtn.addEventListener('click', () => editFile(file));
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deletebutton';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => moveToBin(file));
    listitem.appendChild(img);
    listitem.appendChild(span);
    listitem.appendChild(editbtn);
    listitem.appendChild(deleteBtn);
    fileList.appendChild(listitem);
 });
};
const editFile = (file) => {
    const newFile = prompt(file);
    if(newFile && newFile !== file){
        const oldfile = file;
        if(!fileHistory[oldfile]){
            fileHistory[oldfile] = [];
        }
        fileHistory[oldfile].push({
            action: 'edit',
            timestamp: new Date().toISOString(),
            newFile: newFile
        });
        const fileList = document.getElementById('fileslist');
        const files = fileList.getElementsByTagName('li');
        Array.from(files).forEach((item) => {
            if(item.querySelector('span').textContent === oldfile.split('.')[0]){
                item.querySelector('span').textContent = newFile.split('.')[0];
            }
        });
        localStorage.setItem('fileHistory',JSON.stringify(fileHistory));
        alert(`File name change from ${oldfile} to ${newFile}`);
    }
};

const moveToBin = (file) => {
    showmodal(`Are You Sure you want to delete "${file}"?`);
    document.getElementById('confirmmodal').onclick = () => deletefile(file);
};

const showmodal = (message) => {
    const modal = document.getElementById('modal');
    document.getElementById('modalmessage').textContent = message;
    modal.style.display = 'flex';
    document.getElementById('cancelmodal').onclick = () => {
    };
};

const deletefile = (file) => {
    const binList = document.getElementById('binlist');
    const listItem = document.createElement('li');
    listItem.textContent = file;
    binList.appendChild(listItem);
    if(!fileHistory[file]){
        fileHistory[file] = [];
    }
    fileHistory[file].push({
        action: 'delete',
        timestamp: new Date().toISOString()
    });
localStorage.setItem('fileHistory',JSON.stringify(fileHistory));
clearAll(file);
document.getElementById('modal').style.display ='none';
alert(`File ${file} has deleted`)
};

const clearAll = (file) => {
    const fileList = document.getElementById('fileslist');
    const files = fileList.getElementsByTagName('li');
    Array.from(files).forEach((item) => {
        if(item.querySelector('span').textContent === file.split('.')[0]){
            fileList.removeChild(item);
        }
    });
};
const searchfiles = () => {
    const searchterm = document.getElementById('search').value.toLowerCase();
    const displayFiles = document.querySelectorAll('#fileslist li');
    displayFiles.forEach(file => {
        const fileName = file.querySelector('span').textContent.toLowerCase();
        if(fileName.includes(searchterm)){
            file.style.display = 'block';
        }else{
            file.style.display = 'none';
        }
    });
};


const clearBin = () => {
    const binList = document.getElementById('binlist');
    binList.innerHTML = '';
};
document.getElementById('searchbtn').addEventListener('click',searchfiles);
document.getElementById('clearbin').addEventListener('click',clearBin);

displayFolders();

