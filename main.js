const electron = require('electron');
const path = require('path');
const url = require('url');
const editJsonFile = require("edit-json-file");
var fs = require('fs')
// If the file doesn't exist, the content will be an empty object by default.
let config_file = editJsonFile(`${__dirname}/config.json`);


try {

'use strict';

var fs = require('fs')
var os = require('os');
var ifaces = os.networkInterfaces();
var fs  = require('fs');
var splitFile = require('split-file'); 

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
console.log(config_file.get("firststart"));

if(config_file.get("firststart") == true) {
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
    title:'Add Shopping List Item'
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

// Catch item:add
ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close(); 
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

// Catch item:add
ipcMain.on('config:safe', function(e, i){
	console.log("hallo ",i);
	
	if(i.username != "" || i.username !=  "0"){
		config_file.set("username", i.username);
	}else{
		console.log("Unzulässige Daten = ", i.username);
	}
  console.log("PW Daten = ", i.password);
  config_file.set("password", i.password);
  config_file.set("id", i.id);
  config_file.set("server.ip", i.server.ip);
  config_file.set("server.port", i.server.port);
  config_file.set("printer.standard", i.printer.standard);
  config_file.set("printer.all", i.printer.all);
  config_file.set("virtual_printer.ip", i.virtual_printer.ip);
  config_file.set("virtual_printer.port", i.virtual_printer.port);
  
  config_file.set("allow.print_from_ext", i.allow.print_from_ext);
  config_file.set("allow.print_to_ext", i.allow.print_to_ext);
  loadHTML('public/mainWindow.html');
  setJSON({name: "firststart", val: "false"})
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


let win  



ipcMain.on('openFile', (event, path) => { 
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
	    mainWindow.webContents.send('selectedFiles', file = {"path": selectedFiles[0], "stats": stats} );
	});
       // mainWindow.webContents.send('selectedFiles', selectedFiles);
    }else{
        console.log('Bitte etwas auswählen');
    }
   
    /*
  merge(selectedFiles, function(err){
      console.log("Fertig");
  });
    
    fs.readFile(selectedFiles[0], 'utf-8', (err, data) => {
        if(err){
            console.log("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        //console.log("The file content is : " + data);
    });

 */

// Note that the previous example will handle only 1 file, if you want that the dialog accepts multiple files, then change the settings:
// And obviously , loop through the fileNames and read every file manually

}) 
ipcMain.on('openfile-merge', (event, data) => { 
   const {dialog} = require('electron') 
   const fs = require('fs') 
   console.log('openfile');
   
   var selectedFiles = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']});
    if(selectedFiles != undefined) {
        console.log(selectedFiles)
        //filestats(selectedFiles[0])
        merge({'names': selectedFiles});
       // mainWindow.webContents.send('selectedFiles', selectedFiles);
    }else{
        console.log('Bitte etwas auswählen');
    }
   
}) 
ipcMain.on('splitfile', (event, path) => { 
   console.log('File Split');
})  

// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label:'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label:'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
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
        label: 'Config',
        click(){
          loadHTML('public/configWindow.html');
        }
      },
      {
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

var config = config_file.toObject()


try {
	var gamedir = __dirname + "/games";
	
	fs.readdir(gamedir, (err, files) => {
		files.forEach(file => {
			fs.lstat(gamedir , (err, stats) => {
			    if(err) {
				    return console.log(err); //Handle error
			    }
			    isDirectory = stats.isDirectory()
			    
				if(isDirectory == true)	{
					console.log(`!!!!!Is Dir: ${file}`);
					addGame(gamedir,file)
				}
/*
				console.log(`Is file: ${stats.isFile()}`);
				console.log(`Is directory: ${stats.isDirectory()}`);
				console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
				console.log(`Is FIFO: ${stats.isFIFO()}`);
				console.log(`Is socket: ${stats.isSocket()}`);
				console.log(`Is character device: ${stats.isCharacterDevice()}`);
				console.log(`Is block device: ${stats.isBlockDevice()}`);
*/
				    
			});
			
			//console.log(filestat)
			
			console.log(file); 
			//fileres = file.split('-');
			//console.log(fileres[0]);
			//if(pathres[0] == fileres[0]) {
		    //console.log(filestat)
		    //	names.push(file)
	    	//}
	    });
  
	})
	
}catch(ex) {
	console.log(ex);
}




Client(config.ext_server)


function Client(c) {
	const
    io = require("socket.io-client"),
    ioClient = io.connect("http://" + c.ip + ":" + c.port);
console.log("http://",c.ip,":",c.port);
	ioClient.on("seq-num", (msg) => console.info(msg));
	
	
	
}



function loadHTML(data){
	mainWindow.loadURL(url.format({
	    pathname: path.join(__dirname, data),
	    protocol: 'file:',
	    slashes:true
	}));
	
}

function setJSON(data) {
	
	config_file.set(data.name, data.val);
}



function addGame(path, file) {
	fs.lstat(path + "/" + file, (err, stats) => {
		if(err) {
			return console.log(err); //Handle error
		}
		
		isFile = stats.isFile()
		isDirectory = stats.isDirectory()
			    
			    
		if(isFile == true && file != '.DS_Store')	{
			console.log(`-- add game -- Is File: ${file} --`);
			//split(path + "/" + file, 150)		
		}
		
			    
		if(isDirectory == true)	{
			console.log(`Bitte Komprimieren`);
				
		}
		    
	});
	
	/*
		// Create 
	function mkdirpath(dirPath)
	{
	    if(!fs.existsSync(dirPath))
	    {
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


function split(CompressedDIR, FileSize) {
	var isFile
	var isDirectory
	fs.lstat(CompressedDIR, (err, stats) => {
		
    	if(err)
        return console.log(err); //Handle error
        
        
		isFile = stats.isFile()
		isDirectory = stats.isDirectory()
	    //console.log('Is file: ' + isFile);
	    //console.log('Is directory: ' + isDirectory );
	    //console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
	    //console.log(`Is FIFO: ${stats.isFIFO()}`);
	    //console.log(`Is socket: ${stats.isSocket()}`);
	    //console.log(`Is character device: ${stats.isCharacterDevice()}`);
	    //console.log(`Is block device: ${stats.isBlockDevice()}`);
	    
	    if(isDirectory == true) {
			console.log('Muss gepackt sein also eine Datei Kein Ordner!');
			
		}else if(isFile == true) {
			console.log('File');
			var t_start, t_end;
			t_start = new Date().getTime();

			
			FileSize = FileSize * 1000000;
			console.log(FileSize);
			splitFile.splitFileBySize(CompressedDIR, FileSize)
			.then((names) => {
		    	console.log(names);
				//merge(names);  
				// Code, dessen Ausführungszeit wir messen wollen
			t_end = new Date().getTime();
			console.log(t_end - t_start);
		  	})
		  	.catch((err) => {
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




ipcMain.on('saveSplitFile', (event, data) => {
           //console.log("Joo path" + data.path);
        
           savefile(data)
})

function savefile(data) {
    const {dialog} = require('electron') 
    const fs = require('fs') 
    console.log(data.name)
    console.log(data.path)
    console.log(data.packSize)
    dialog.showSaveDialog({ filters: [

     { defaultPath: data.path, title: data.name, name: 'zip', extensions: ['zip'] }

    ]}, function (fileName) {

    if (fileName === undefined) return;

    split(data.path, data.packSize);
   // fs.writeFile(fileName, data, function (err) { });

  }); 
}

function merge(data) {
	var t_start, t_end;
	t_start = new Date().getTime();
	console.log('Merge with ' + data.names[0]);
  	splitFile.mergeFiles(data.names, __dirname + '/Merge-output.zip')
  		.then(() => {
  		console.log('Done!');
  		t_end = new Date().getTime();
  	console.log(t_end - t_start + 'ms');
  	})
  	.catch((err) => {
   		console.log('Error: ', err);
  	});
  	
  }

 var mergee = function(data, callback) {
     
     
     console.log("Merge Data = " + data[0]);
     
     
      const testFolder = './';
const testFile = 'TestOrdner.zip';

var names = [];


function listNames(Dir, path) {
	var pathres = path.split('-');
	console.log(pathres[0]); 
	console.log(pathres[1]); 
	if(pathres[1] == undefined){
		pathres[0] += '.sf';
		//pathres[1] = 'part1';
		console.log(pathres[0]);
	}
	fs.readdir(Dir, (err, files) => {
		files.forEach(file => {
			
			//console.log(file); 
			fileres = file.split('-');
			//console.log(fileres[0]);
			if(pathres[0] == fileres[0]) {
		    	console.log('Push ',file,' in names')
		    	names.push(file)
	    	}
	  });
	  mergee(names);
	})
	
}

/*
var t_start, t_end;
t_start = new Date().getTime();
// Code, dessen Ausführungszeit wir messen wollen
t_end = new Date().getTime();
alert(t_end - t_start);
*/


function mergee(names) {
	var t_start, t_end;
	t_start = new Date().getTime();
	console.log('Merge with ' + names[0]);
  	splitFile.mergeFiles(names, __dirname + '/testfile-output.zip')
  		.then(() => {
  		console.log('Done!');
  		t_end = new Date().getTime();
  	console.log(t_end - t_start + 'ms');
  	})
  	.catch((err) => {
   		console.log('Error: ', err);
  	});
  	
  }
  
//listNames(testFolder, '5gbtest.zip')
     
     callback();
     
     
     
 }



// Set a couple of fields
//config_file.set("planet", "Earthhhhsdcvdv");

 
// Output the content
console.log(config_file.get());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false }
 
// Save the data to the disk
//config_file.save();
// 
// Reload it from the disk
config_file = editJsonFile(`${__dirname}/config.json`, {
    autosave: true
});

setJSON({name: "username", val: "Steffen"})
 
// Output the whole thing
//console.log(config_file.toObject());
// { planet: 'Earth',
//   name: { first: 'Johnny', last: 'B.' },
//   is_student: false,
//   a: { new: { field: [Object] } } }

