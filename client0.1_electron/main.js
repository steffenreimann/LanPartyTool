'use strict';
var events = require('events');
const electron = require('electron');
const path = require('path');
const url = require('url');
const configHelper = require('./config/configHelper');
const configPath = require('./config/configPaths');
const util = require('./utils/swissKnife');
const encryptAes = require('./utils/aesEncrypt');
var fs = require('fs')
const uuidv4 = require('uuid/v4');
var ping = require('ping');
var splitFile = require('./split-file.js'); 
var Files = require('./utils/files.js'); 
const {app, BrowserWindow, Menu, ipcMain, globalShortcut} = electron;
var localip = []
var alive = [];
var serverFiles = []
let mainWindow;
let pwWindow;
var user = {uuid: "", name: "",ip: ""};

// SET ENV
process.env.NODE_ENV = 'development';

var ignoreFiles = [".DS_Store", ".gitkeep", ".gitignore"];

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
		  label:'Einfügen',
		  accelerator:process.platform == 'darwin' ? 'Command+M' : 'Ctrl+V',
		  role: 'paste'
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
	//mainMenuTemplate.unshift({});
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
			 loadHTML('public/appmainWindow.html');
		   }
		 }, 
		 {
		   label: 'Config',
		   accelerator:process.platform == 'darwin' ? 'Command+K' : 'Ctrl+K',
		   click(){
			 loadHTML('public/appconfigWindow.html');
		   }
		 },
		 {
		   label: 'Logout',
		   accelerator:process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L',
		   click(){
			applogout();
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


// Check Configuration directory
if (!configHelper.Init()) {
	configHelper.InitDirs();
	console.log('Created directory' + configPath.GetBaseDir());
}



'use strict';

var os = require('os');




// Fast-TCP Testung -----------------------------------------------------------------------------------------------------------------------------------------------------------

// Broadcast event to everyone, exclude sender
//socket.emit('LT-Broadcast', 'Hello, World!', { broadcast: true });
//socket.emit('login', 'alejandro');

var tcp = require('./utils/tcpstream.js');


//tcp.runClient('localhost',8090);
//tcp.runClient('localhost',8090);
//tcp.runClient('localhost',8090);
//tcp.upload('./games/GOPR0292.zip', 0);


// Fast-TCP Testung END----------------------------------------------------------------------------------------------------------------------------------------------------------




// Listen for app to be ready
app.on('ready', function(){
  	//Create new window
	  //const readUserConfig = configHelper.LoadUserConfig("");
	
	//console.log(tcp.upload('./games/test.zip', 0));;
	//console.log(tcp.upload('./games/test.zip', 1));;
	//console.log(tcp.upload('./games/test.zip', 2));;
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		}
	});
	loadHTML('public/mainWindow.html');
  	// Quit app when closed
	mainWindow.on('closed', function(){
		globalShortcut.unregisterAll()
		app.quit();

	});
  	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert Builded menu
	Menu.setApplicationMenu(mainMenu);
	KeyReg('CommandOrControl+p', true, ipscan)
});


app.on('will-quit', () => {
	
  
	// Unregister all shortcuts.
	globalShortcut.unregisterAll()
  })

ipcMain.on('openFile', (event, path) => { 
    openSplitFile(path)
}) 
ipcMain.on('openfile-merge', (event, data) => { 
   	openMergeFile(data)
}) 
ipcMain.on('splitfile', (event, path) => { 
   	console.log('File Split');
})  
ipcMain.on('saveConfig', (event, data) => { 
	const readUserConfig = configHelper.LoadUserConfig(data.config_pw);
	const cleanObject = {'config_user': data.config_user, 'config_uuid': null, tmp_path: null, 'files': [], 'config_updir': data.config_updir }
	if(readUserConfig.fileExists && readUserConfig.parseError){
		return;
	}
	if(!readUserConfig.fileExists){
		cleanObject.config_uuid = uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'
	}else{
		cleanObject.config_uuid = readUserConfig.userCfg.config_uuid;
	}
	user.uuid = true;
	configHelper.WriteUserConfig(data.config_pw, cleanObject);

	//{'config_pw': config_pw, 'config_user': config_user, 'config_uuid': config_uuid }
	mainWindow.webContents.send('saveConfig', cleanObject );
	applogindata = cleanObject
}) 

ipcMain.on('loadConfig', (event, data) => { 
	console.log(data);
	//{'config_pw': config_pw}
	const readUserConfig = configHelper.LoadUserConfig(data.config_pw);
	console.log('Loaded config:');
	console.log(readUserConfig);

	mainWindow.webContents.send('loadConfig', readUserConfig.userCfg );
}) 
var applogindata
ipcMain.on('applogin', (event, data) => { 
	console.log(data);
	const con = configHelper.LoadUserConfig(data.config_pw);
	user.uuid = true;
	console.log(con.userCfg.config_updir);
	if(con.config_updir == '' || con.userCfg.config_updir == undefined ){
		con.userCfg.config_updir = configPath.GetBaseDir()
	}
	//intiGameDir("lul", data.config_pw)
	console.log('con.userCfg.config_updir');
	console.log(con.userCfg.config_updir);

	//tcp.runServer(8090, con.userCfg.config_updir);
	loadHTML('public/appmainWindow.html');
	applogindata = con.userCfg
	console.log('applogindata ');
	console.log(applogindata);
	mainWindow.webContents.send('applogin', con.userCfg );
	if(pwWindow != undefined){
		pwWindow.hide();
		pwWindow = null;
	}
}) 
ipcMain.on('applogout', (event, data) => { 
	applogout();
}) 

ipcMain.on('saveSplitFile', (event, data) => {
    //console.log("Joo path" + data.path);
    savefile(data)
})
ipcMain.on('DOM', (event, data) => {
	console.log("DOM Data : " + data);      
	KeyReg('x', true);
})
ipcMain.on('regkey', (event, data) => {
	console.log("regkey : ");      
	console.log(data);      
	KeyReg(data.key, data.reg, ipscan);
})
ipcMain.on('ipscan', (event, data) => {
    console.log("DOM Data : " + data);    
})
ipcMain.on('tcpconnect', (event, data) => {
	console.log("tcpconnect Data : " + data);
	console.log("user data to login : " + user);
	tcp.runClient(data,8090)
	var applogin = {data: applogindata, ip: localip }
	tcp.login(applogin)
	//connectToServer(data);
})
ipcMain.on('tcpdisconnect', (event, data) => {
	console.log("tcp disconnect : " + data);
	tcp.stopClient(data);
	
	//connectToServer(data);
})

ipcMain.on('tcpstartServer', (event, data) => {
	console.log("tcp start server Data : " + data);
	tcp.runServer(8090, applogindata.config_updir, applogindata.config_user);
	ipscan("192.168.178.")
	mainWindow.webContents.send('ip', {name: "localhost", "val": NetworkInterfaces()} );
	
	

	//connectToServer(data);
})
ipcMain.on('list', (event, data) => {
	//console.log("tcp list server Data : " + JSON.stringify(tcp.list(0)));
	serverFiles = tcp.list(0)
	mainWindow.webContents.send('list', serverFiles );
	//connectToServer(data);
})

ipcMain.on('uploadfile', (event, data) => {
	console.log("tcpconnect Data : " + data);
	console.log(tcp.upload(data, 0));;
	tcp.setlog(true);
	//connectToServer(data);
})
ipcMain.on('downloadfile', (event, data) => {
	console.log(applogindata.config_updir);
	tcp.download(applogindata.config_updir, data.file, data.server)
	
})
ipcMain.on('loadPath', (event, data) => {
	console.log("loadPath: " + data);
	openPath();
})

ipcMain.on('loadClients', (event, dataa) => {
	var data = tcp.loadClients()
	console.log("loadClients: " + data);
	mainWindow.webContents.send('loadClients', data );
	
})

ipcMain.on('reloadVAR', (event, data) => {
	mainWindow.webContents.send('reloadVAR', {localip: localip, alive: alive, user: user, serverFiles: serverFiles} );
})

// register event listener
tcp.traffic.on("downloading", function(data) {
	// process data when someEvent occurs
	
	mainWindow.webContents.send('DOM', {"id": "#size", "val": data} );
});

tcp.traffic.on("uploading", function(data) {
	// process data when someEvent occurs
	
	mainWindow.webContents.send('DOM', {"id": "#size", "val": data} );
});



function NetworkInterfaces() {
	var ifaces = os.networkInterfaces();
	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach(function (iface) {
			//'IPv4' !== iface.family || 
			if (iface.internal !== false) {
			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
			return null;
			}
			console.log(ifname, iface.address);
			localip.push({name: ifname, ip: iface.address}) 
		});
	});
	return localip
}


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
			var isFile = stats.isFile()	
			var path = data.path
			path = path.split('\\');
			var name = path.pop()
			path = path.join('\\');
			if(isFile)	{
				console.log(`!!!!!Is File: ${name}`);
				console.log(`!!!!!path: ${path}`);

				//addGame(path,name, "true")
				var addGameData = {path: data.path, size: 400, split: true}
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
  	splitFile.mergeFiles(data.names, data.path + '/' + data.name + '.' + data.typ).then(() => {
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
	
	var selectedFiles = dialog.showOpenDialog({properties: ['openFile', 'multiSelections', 'openDirectory' ], filters: [
     {extensions: ['*']}]});
	console.log('selectedFiles = ' + selectedFiles)

    if(selectedFiles != undefined) {
		fs.lstat(selectedFiles  + "/", (err, stats) => {
			if(err) {
				return console.log(err); //Handle error
			}
			
			var isFile = stats.isFile()
			var isDirectory = stats.isDirectory()
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
			var sizeMGB = 0
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
	  	//mainWindow.webContents.send('selectedFiles', selectedFiles);
   	}else{
	   console.log('Bitte etwas auswählen');
	}
}

function openPath(path){
	const {dialog} = require('electron') 
  	const fs = require('fs') 
  	console.log('openfile');
  	var selected = dialog.showOpenDialog({properties: ['openDirectory']});
   	if(selected != undefined) {
	   	console.log(selected)
		//filestats(selectedFiles[0])
		
		fs.lstat(selected[0], (err, stats) => {
			if(err)
			return console.log(err); //Handle error

			console.log(`Is file: ${stats.isFile()}`);
			console.log(`Is directory: ${stats.isDirectory()}`);
			console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
			console.log(`Is FIFO: ${stats.isFIFO()}`);
			console.log(`Is socket: ${stats.isSocket()}`);
			console.log(`Is character device: ${stats.isCharacterDevice()}`);
			console.log(`Is block device: ${stats.isBlockDevice()}`);
			if(stats.isDirectory()){
				console.log('Ist Ordner');
				 
				mainWindow.webContents.send('loadPath', selected[0] );
				
			}
		});
	  	//mainWindow.webContents.send('selectedFiles', selectedFiles);
   	}else{
	   console.log('Bitte etwas auswählen');
	}
}
function loadHTML(data){
	const readUserConfig = configHelper.LoadUserConfig("");
	if(!readUserConfig.fileExists){
		console.log("Kein File vorhanden");
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'public/appregisterWindow.html'),
			protocol: 'file:',
			slashes: true
		}));
	}
	if(readUserConfig.fileExists && !user.uuid) { 
		console.log("Nutzer vorhanden!! Please Login");
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'public/nothingWindow.html'),
			protocol: 'file:',
			slashes: true
		}));
		createloginWindow();	
	}
	if(readUserConfig.fileExists && user.uuid){
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, data),
			protocol: 'file:',
			slashes: true
		}));
	}
}
/**JSON  */
function addGame(da) {
	var basename = path.basename(da.path);
	fs.lstat(da.path, (err, stats) => {
		if(err) {
			return console.log(err); //Handle error
		}
		var isFile = stats.isFile()
		var isDirectory = stats.isDirectory() 
		if(isFile && !ignore(basename))	{
			console.log(`-- add game -- Is File: ${basename} --`);
			var tmpFiles = {name: da.path, stats: stats }
			//FilePaths.myFiles.push(tmpFiles);
			if(da.split){
				checkFilestatus(da, LTsplit);
			}
		}
		if(isDirectory == true)	{
			console.log(`Bitte Komprimieren`);
		}  
	});

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

}
/**String File Basename. return true if basename are an Ignored File */
function ignore(fileName){
	for (let i = 0; i < ignoreFiles.length; i++) {
		const element = ignoreFiles[i];
		if(fileName == element){
			console.log('ignore true = ' + element);
			return true;
		}
	}
	console.log('File Ignore false = ' + fileName);
	return false;
 }
let checkFilestatus = function checkFilestatus(da, callback){
	var basename = path.basename(da.path);
	var dirname = path.dirname(da.path);
	var filePath = path.join(dirname,'LT-' + basename, basename);
	var dirPath = path.join(dirname, 'LT-' + basename);
 
	if(!fs.existsSync(dirPath)){
		fs.mkdir(dirPath, { recursive: true }, (err) => {
			if (err) throw err;
			console.log('return false  ');
			return callback(da.path, da.size, filePath);
		});
	}else{
		console.log('Ordner Schon Vorhanden!');
		fs.readdir(dirPath, function(err, files) {
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
				return callback(da.path, da.size, filePath);
			}
		});
	};
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

	   if(isDirectory) {
		   console.log('Muss gepackt sein also eine Datei Kein Ordner!'); 
	   }else if(isFile) {
		   var t_start, t_end;
		   t_start = new Date().getTime();
		   // Code, dessen Ausführungszeit wir messen wollen Start

		   FileSize = FileSize * 1000000;
		   splitFile.splitFileBySize(CompressedDIR, FileSize, fileName).then((names) => {
			   console.log("Names = " + names[0]);
			   console.log("Name = " + stats.name);
			   
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

// Handle pwWindow
function createloginWindow(){
	pwWindow = new BrowserWindow({
	  width: 300,
	  height:200,
	  title:'Login'
	});
	pwWindow.loadURL(url.format({
	  pathname: path.join(__dirname, 'public/apploginWindow.html'),
	  protocol: 'file:',
	  slashes:true
	}));
	// Handle garbage collection
	pwWindow.on('close', function(){
	  pwWindow = null;
	});
  }

function applogout(){
	user.uuid = false;
	//createloginWindow()
	loadHTML('public/nothingWindow.html');
}


var traffic = {"down": 0,"up": 0}

function steamDataSize(BufferLength, upload, ip){
    var a = BufferLength / 1000000;
    if(upload){
            traffic.up = traffic.up + a;    
       }    
    if(!upload){
            traffic.down = traffic.down + a;
            
       }
    var out = {"size": a,  "traffic":{"down": traffic.down,"up": traffic.up}, "upload": upload, "ip": ip };
    //sizeDia.push(out);
    //console.log(sizeDia);
    return out 
}

function speedtest(size, time){
    var nowTime = Date.now()
    var speed = size / time;
    var out = speed.toFixed(2)
    return out;
}


/**
 * Parsed response
 * @typedef {object} PingResponse
 * @param {string} host - The input IP address or HOST
 * @param {string} numeric_host - Target IP address
 * @param {boolean} alive - True for existed host
 * @param {string} output - Raw stdout from system ping
 * @param {number} time - Time (float) in ms for first successful ping response
 * @param {string} min - Minimum time for collection records
 * @param {string} max - Maximum time for collection records
 * @param {string} avg - Average time for collection records
 * @param {string} stddev - Standard deviation time for collected records
 */
function ipscan(data){
	var a = [];
	alive = [];
	let index 
	for (index = 0; index < 245; index++) {
		var ip = data + index
		a.push(ip);
	}
	if(index >= 244){
		
		var rounds = 0
		a.forEach(function(host){
			
			ping.sys.probe(host, function(isAlive){
				if(isAlive == true){
					alive.push(host);	
					console.log("Alive Host on IP = " + host)		  		
				}
				console.log("round = " + rounds)	
				
				rounds++
				if (rounds == a.length) {
					console.log("Finish IP Scan = ")
					mainWindow.webContents.send('ip', {name: "network", "val": alive });
					return alive
				}
			});
		});
	}
		
	
}

// global Key register with callback 
// The callback are Fired on Pressed registrated key

// Der callback wird aufgerufen sobalt eine registrierte Taste gedückt wird.
function KeyReg(key, reg, callback){
	
	if(key != 'all'){
		if(reg){
			console.log('try to register key= ' + key )
			const ret = globalShortcut.register(key, () => {
				console.log(key + ' is pressed')
				console.log(callback + ' is fired')
				return callback(key, reg);
			})
			if (!ret) {
				console.log('registration failed')
			}else{
				console.log('registration')
			}
			const rett = globalShortcut.isRegistered(key)
			console.log(rett);

		}else{
			console.log('try to unregister key = ' + key)
			globalShortcut.unregister(key)
			const ret = globalShortcut.isRegistered(key)
			console.log("ret unregister data= ");
			console.log(ret);
			if (!ret) {
				console.log('unregister key true')
			}else{
				console.log('unregister key fail')
			}
		}
	}else{
		console.log('try to register all keys = ' + key )
		const ret = globalShortcut.registerAll(key ,() => {
			console.log(key + ' is pressed')
		})
		if (!ret) {
			console.log('registration failed')
		}
	}

}

//ipscan();