const electron = require('electron');
const path = require('path');
const url = require('url');
const editJsonFile = require("edit-json-file");
const configHelper = require('./config/configHelper');
var fs = require('fs')

// Check Configuration directory
if (!configHelper.Init()) {
	configHelper.InitDirs();
	console.log('Created directory' + configHelper.GetBaseDir());
}

// If the file doesn't exist, the content will be an empty object by default.
let MyConfig = editJsonFile(`${__dirname}/config.json`);
let MyConfigTamplate = editJsonFile(`${__dirname}/MyConfig.json`);
let MyConfigTmp = editJsonFile(`${__dirname}/MyConfigTmp.json`);
var FilePaths = {myFiles: [], network: {}};
var ignoreFiles = [".DS_Store", ".gitkeep", ".gitignore"];
try {

'use strict';
var ping = require('ping');
var os = require('os');
var ifaces = os.networkInterfaces();
var splitFile = require('./split-file.js'); 
var clients = new Array(); // or the shortcut: = []
var counter = 0;
var chat = [];
var names = [];
var port = "8081"

} catch (ex) {
    console.log(ex);
   // console.log(ex.code)
    if(ex.code == 'MODULE_NOT_FOUND'){
	    console.log('MODULE_NOT_FOUND')
	    //exec("npm install ", puts);
	    
    }
    
}


var Server = require('fast-tcp').Server;
var Socket = require('fast-tcp').Socket;
 
var server = new Server();

server.on('connection', function (socket) {
  socket.on('login', function (username) {
    console.log('Trying to login: ' + username);
  });
  socket.on('files', function (username) {
    console.log('Files');
  });

});

//server.listen(5000);
 
//test

//socket.emit('login', 'alejandro');

// SET ENV
process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({});
  
  
  //Lese Aus der JSON Datei wlchen wert firststart hat 
console.log(MyConfig.get("UserConfigFile"));

if(MyConfig.get("UserConfigFile") == true) {
	console.log("Erster Start wird ausgeführt");
	// Load html in window
	  mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, 'public/configWindow.html'),
	    protocol: 'file:',
	    slashes:true
	  }));
	
	
	
}else{
	console.log("Erster Start wurde bereits ausgeführt");
	// Load html in window
	  mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, 'public/mainWindow.html'),
	    protocol: 'file:',
	    slashes:true
	  }));
}

  
  
  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle add item window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height:200,
    title:'LanPartyTool'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}


let win  


// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
               
      {
        label:'Split File',
        accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
        click(){
          openSplitFile()
        }
      },
      {
        label:'Merge Files',
        accelerator:process.platform == 'darwin' ? 'Command+M' : 'Ctrl+M',
        click(){
          openMergeFile();
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				role: 'quit'
      }
    ]
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
        {
        label:'Home',
        accelerator:process.platform == 'darwin' ? 'Command+H' : 'Ctrl+H',
        click(){
          loadHTML('public/mainWindow.html');
        }
      }, 
	  {
        label: 'Config',
        accelerator:process.platform == 'darwin' ? 'Command+K' : 'Ctrl+K',
        click(){
          loadHTML('public/configWindow.html');
        }
      },
      {
				label: 'Reload',
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}

var config = MyConfig.toObject()



try {
checkConfigFiles()
var filename = path.basename('/Users/Refsnes/demo_path.js');
console.log(filename);

	var gamedir = __dirname + "/games";
	
	fs.readdir(gamedir, (err, files) => {
		files.forEach(file => {
			var x = path.join(gamedir, file);
			fs.lstat(gamedir , (err, stats) => {
			    if(err) {
				    return console.log(err); //Handle error
			    }
			    isDirectory = stats.isDirectory()
			    
				if(isDirectory)	{
					console.log(`!!!!!Is Dir: ${x}`);
					var addGameData = {path: x, size: 400, split: true}
					addGame(addGameData)
				}
				    
			});
			console.log(file); 
	    });
  
	})
	
}catch(ex) {
	console.log(ex);
}


ipcMain.on('openFile', (event, path) => { 
    openSplitFile(path)
}) 
ipcMain.on('openfile-merge', (event, data) => { 
   openMergeFile(data)
}) 
ipcMain.on('splitfile', (event, path) => { 
   console.log('File Split');
})  







function openSplitFile(path){
     const {dialog} = require('electron') 
   const fs = require('fs') 
   console.log('openfile');
   var selectedFiles = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});
    if(selectedFiles != undefined) {
        console.log(selectedFiles)
        //filestats(selectedFiles[0])
        
        fs.lstat(selectedFiles[0], (err, stats) => {
        if(err)
        return console.log(err); //Handle error

	    console.log(`Is file: ${stats.isFile()}`);
	    console.log(`Is directory: ${stats.isDirectory()}`);
	    console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
	    console.log(`Is FIFO: ${stats.isFIFO()}`);
	    console.log(`Is socket: ${stats.isSocket()}`);
	    console.log(`Is character device: ${stats.isCharacterDevice()}`);
	    console.log(`Is block device: ${stats.isBlockDevice()}`);
	    //mainWindow.webContents.send('selectedFiles', file = {"path": selectedFiles[0], "stats": stats} );
	   var FileSize = stats.size / 1000000;
        console.log(FileSize);
        FileSize = Math.round(FileSize)
        if(FileSize >= 1000){
            
                sizeMGB = FileSize / 1000
                sizeMGB = sizeMGB + " GB"
           }else{
                sizeMGB = FileSize + " MB"
           }
        mainWindow.webContents.send('DOM', {"id": "#size", "val": sizeMGB} );
        mainWindow.webContents.send('DOM', {"id": "#out", "val": selectedFiles[0]} );
        mainWindow.webContents.send('DOM', {"id": "#time", "val": ""} );
	});
       // mainWindow.webContents.send('selectedFiles', selectedFiles);
    }else{
        console.log('Bitte etwas auswählen');
    }
}

function loadHTML(data){
	mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, data),
	    protocol: 'file:',
	    slashes:true
	}));
	
}

function setJSON(data) {
	MyConfig.set(data.name, data.val);
}

function checkConfigFiles(){
	let MyConfig = editJsonFile(`${__dirname}/config.json`);
	let MyConfigTemplate = editJsonFile(`${__dirname}/MyConfig.json`);
	let MyConfigTmp = editJsonFile(`${__dirname}/MyConfigTmp.json`);
	var Template = MyConfigTemplate.toObject()
	var MyConfigTmpObj = MyConfigTemplate.toObject()
	var conf = MyConfig.toObject()
	


	if(conf.UserConfigFile == false){
		console.log('First Start');
	}

//MyConfigTemplate.set("allow.print_to_ext", i.allow.print_to_ext);
	console.log(Template);
}

/**JSON  */
function addGame(da) {
	var basename = path.basename(da.path);
	var dirname = path.dirname(da.path);

	fs.lstat(da.path, (err, stats) => {
		if(err) {
			return console.log(err); //Handle error
		}
		
		isFile = stats.isFile()
		isDirectory = stats.isDirectory() 
			    
		if(isFile && !ignore(basename))	{
			console.log(`-- add game -- Is File: ${basename} --`);
			var tmpFiles = {name: da.path, stats: stats }
			FilePaths.myFiles.push(tmpFiles);
			//console.log(FilePaths.myFiles);
			//FilePaths = {myFiles: {}, network: {}};
			//console.log(da.path);
			//console.log(basename);
			//console.log(dirname);
			if(da.split){
				checkFilestatus(da, LTsplit);
			}
		}

		if(isDirectory == true)	{
			console.log(`Bitte Komprimieren`);
		}  
	});


/**String File Basename. return true if basename are an Ignored File */
function ignore(da){
	for (let i = 0; i < ignoreFiles.length; i++) {
		const element = ignoreFiles[i];
		if(da == element){
			console.log('ignore true = ' + element);
			return true;
		}
	}
	console.log('ignore false = ' + da);
	return false;
}


function pather(data){
	var g = data.split('.');
	var path = data 
	console.log(path);
	var typ = g.pop();
	console.log(typ);
	
	var name = g.join('.')
	console.log(name);
	var d = {path: path, typ: typ, name: name}
	return d
}

let checkFilestatus = function checkFilestatus(da, callback){
	var basename = path.basename(da.path);
	var dirname = path.dirname(da.path);
	var v = path.join(dirname,'LT-' + basename, basename);
	var f = path.join(dirname, 'LT-' + basename);
	
	fs.readdir(f, function(err, files) {

	});


	if(!fs.existsSync(f)){
		fs.mkdir(f, { recursive: true }, (err) => {
			if (err) throw err;
			console.log('return false  ');
			return callback(da.path, da.size, v);
			});
	}else{
		console.log('Ordner Schon Vorhanden!');
		fs.readdir(f, function(err, files) {
			console.log(files);
			if(files != undefined && files != "" ){

				files.forEach(file => {
					console.log('forEachfile = ' + file);

					if(file == "LT-Config.json"){
						console.log("LT-Config.json");
					}
	
				});

				console.log('return true  ');
				
			}else{
				console.log('return false  ');
				return callback(da.path, da.size, v);
			}
		});
	};

	fs.lstat(da.path, (err, stats) => {
		console.log(stats.size);

	});


	
}
	
	/*
		// Create 
	function mkdirpath(dirPath){
	    if(!fs.existsSync(dirPath)){
	        try
	        {
	            fs.mkdirSync(dirPath);
	        }
	        catch(e)
	        {
	            mkdirpath(path.dirname(dirPath));
	            mkdirpath(dirPath);
	        }
	    }
	}
	*/

	// Create folder path
	//mkdirpath('my/new/folder/create');
	//	const fs = require('fs')
	//const path = require('path')
	var dirPath = 'mynewfolder';
	const mkdirSync = function (dirPath) {
	  try {
	    fs.mkdirSync(dirPath)
	    console.log('mkdir')
	  } catch (err) {
		  console.log(err)
	    if (err.code !== 'EEXIST') throw err
	  }
	}
	
	
	
	/*
fs.readdir(path, (err, files) => {
		files.forEach(file => {
			fs.lstat(path + "/" + file , (err, stats) => {
			    if(err) {
				    return console.log(err); //Handle error
			    }
			    isFile = stats.isFile()
			    
				if(isFile == true && file != '.DS_Store')	{
					console.log(`-- Is File: ${file} --`);
					
				}
		    
			});
			console.log('jo' + file); 
			//fileres = file.split('-');
			//console.log(fileres[0]);
			if(pathres[0] == fileres[0]) {
		    	console.log('Push ',file,' in names')
		    	names.push(file)
	    	}
	  });
	  
	})
*/

}


let LTsplit = function LTsplit(CompressedDIR, FileSize, fileName) {
	var isFile
	var isDirectory
	fs.lstat(CompressedDIR, (err, stats) => {
    	if(err)
        return console.log(err); //Handle error
        mainWindow.webContents.send('DOM', {"id": "#split-file", "show": false} );
        
		isFile = stats.isFile()
		isDirectory = stats.isDirectory()
	    //console.log('Is file: ' + isFile);
	    //console.log('Is directory: ' + isDirectory );
	    //console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
	    //console.log(`Is FIFO: ${stats.isFIFO()}`);
	    //console.log(`Is socket: ${stats.isSocket()}`);
	    //console.log(`Is character device: ${stats.isCharacterDevice()}`);
	    //console.log(`Is block device: ${stats.isBlockDevice()}`);
	    
	    if(isDirectory) {
			console.log('Muss gepackt sein also eine Datei Kein Ordner!');
			
		}else if(isFile) {
            
			var t_start, t_end;
			t_start = new Date().getTime();
            // Code, dessen Ausführungszeit wir messen wollen Start
            
			FileSize = FileSize * 1000000;
			splitFile.splitFileBySize(CompressedDIR, FileSize, fileName)
			.then((names) => {
		    	console.log("Names = " + names[0]);
		    	console.log("Name = " + stats.name);
                
				//MyConfig.set(stats.name, names);
                
				// Code, dessen Ausführungszeit wir messen wollen End
                t_end = new Date().getTime()
                t_end = t_end - t_start;
                t_end = t_end / 1000;
                t_end = parseFloat(Math.round(t_end * 100) / 100).toFixed(2);

                if(t_end >= 60){
                    t_end = t_end / 60;
                    t_end = parseFloat(Math.round(t_end * 100) / 100).toFixed(2);
                    t_end += " Minuten"
                }else{
                    t_end += " Sekunden"
                }

                mainWindow.webContents.send('DOM', {"id": "#time", "val": "wurden in " + t_end + " geteilt"} );
                mainWindow.webContents.send('DOM', {"id": "#split-file", "show": true} );

            }).catch((err) => {
                console.log('Error: ', err);
            });
		}
	});

}


function filestats(path) {
	
	fs.lstat(path, (err, stats) => {
    if(err)
        return console.log(err); //Handle error

	    console.log(`Is file: ${stats.isFile()}`);
	    console.log(`Is directory: ${stats.isDirectory()}`);
	    console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
	    console.log(`Is FIFO: ${stats.isFIFO()}`);
	    console.log(`Is socket: ${stats.isSocket()}`);
	    console.log(`Is character device: ${stats.isCharacterDevice()}`);
	    console.log(`Is block device: ${stats.isBlockDevice()}`);
	    
	});

}

//Input Data is array
function ipscan(data){
    var alive = [];
	  	var i = data.length;
	  	data.forEach(function(host){
	  		ping.sys.probe(host, function(isAlive){
		  		if(isAlive == true){
			  		alive.push(host);
			  		io.sockets.emit('msg', {"ip": host,"from":"multi-ping", "out": isAlive});			  		
		  		}
	  			i--
	  			if(i==0){
	  				ports(alive);
	  				console.log(alive)
	  				
				}
    		});
		});
}

ipcMain.on('saveSplitFile', (event, data) => {
           //console.log("Joo path" + data.path);
        
           savefile(data)
})

ipcMain.on('DOM', (event, data) => {
           console.log("DOM Data : " + data);
           
})

ipcMain.on('ipscan', (event, data) => {
           console.log("DOM Data : " + data);
           
})

ipcMain.on('tcpconnect', (event, data) => {
	console.log("tcpconnect Data : " + data);
	connectToServer(data);
})

function savefile(data) {
    const {dialog} = require('electron') 
    const fs = require('fs') 
    console.log(data.name)
    console.log(data.path)
    console.log(data.packSize)
    
    
    
    dialog.showSaveDialog({ filters: [

     { defaultPath: data.path, extensions: ['*'] }

    ]}, function (fileName) {

    if (fileName === undefined) return;
        console.log(data)
		//split(data.path, data.packSize, fileName);
	
			fs.lstat(data.path , (err, stats) => {
			    if(err) {
				    return console.log(err); //Handle error
			    }
			    isFile = stats.isFile()
				
				var path = data.path
				path = path.split('\\');
				var name = path.pop()
				path = path.join('\\');
				//console.log(path);
				
				if(isFile)	{
					console.log(`!!!!!Is File: ${name}`);
					console.log(`!!!!!path: ${path}`);

					//addGame(path,name, "true")
					var addGameData = {path: x, size: 400, split: true}
					addGame(addGameData)
				}    
			});
	
   // fs.writeFile(fileName, data, function (err) { });

  }); 
  
}

 function merge(data) {
	var t_start, t_end;
	t_start = new Date().getTime();
	console.log('Merge with ' + data.names);
	console.log('Merge path ' + data.path );
  	splitFile.mergeFiles(data.names, data.path + '/' + data.name + '.' + data.typ)
  		.then(() => {
  		console.log('Done!');
  		t_end = new Date().getTime();
  	console.log(t_end - t_start + 'ms');
  	})
  	.catch((err) => {
   		console.log('Error: ', err);
  	});
  	
  }


function openMergeFile(){
    const {dialog} = require('electron') 
   const fs = require('fs') 
   console.log('openfile');
   
   var selectedFiles = dialog.showOpenDialog({properties: ['openFile', 'multiSelections', 'openDirectory' ]});
   console.log('selectedFiles = ' + selectedFiles)

    if(selectedFiles != undefined) {
		fs.lstat(selectedFiles  + "/", (err, stats) => {
			if(err) {
				return console.log(err); //Handle error
			}
			
			isFile = stats.isFile()
			isDirectory = stats.isDirectory()
			console.log(isFile)
			if(isDirectory){
				fs.readdir(selectedFiles  + "/", (err, files) => {
					var g = files[0].split('.');
					var p = selectedFiles[0].split('.');
					var tmpFileArray = [];
					p = p.join('.')
					console.log('selectedFiles g = ' + g);
					console.log('selectedFiles p = ' + p);
					g.pop();
					var path = g.join('.') 
					var typ = g.pop();
					console.log('selectedFiles path = ' + path);
					console.log('selectedFiles typ = ' + typ);
					var name = g.join('.')
					console.log('selectedFiles name = ' + name);
					files.forEach(file => {
					  console.log('forEachfile = ' + file);
					  tmpFileArray.push(p + '/' + file);
					});
					console.log('tmpFileArray = ' + tmpFileArray);
					merge({path: p + '/', name: name, names: tmpFileArray, typ: typ});
				})
			}
		});
	}else{
        console.log('Bitte etwas auswählen');
    }
}  

function connectToServer(ip){
	var socket = new Socket({
		host: ip,
		port: 8090
	  });
	socket.emit('login', 'alejandro');
}


function FileDownload(path){
	 
}


// Set a couple of fields
//MyConfig.set("planet", "Earthhhhsdcvdv");

 
// Output the content
console.log(MyConfig.get());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false }
 
// Save the data to the disk
//MyConfig.save();
// 
// Reload it from the disk
MyConfig = editJsonFile(`${__dirname}/config.json`, {
    autosave: true
});

setJSON({name: "username", val: "Steffen"})
 
// Output the whole thing
//console.log(MyConfig.toObject());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false,
//   a: { new: { field: [Object] } } }

