function mergee(data) {
    const {dialog} = require('electron') 
    const fs = require('fs') 
	var t_start, t_end;
	t_start = new Date().getTime();
	console.log('Merge with ' + data.names[0]);
	console.log('Name Megre ' + data.name);
	
    dialog.showSaveDialog({ nameFieldLabel: data.name, title: data.name, filters: [

     { defaultPath: data.path, name: data.typ, extensions: [data.typ], buttonLabel: "Merge"  }

    ]}, function (fileName) {

    if (fileName === undefined) return;
        console.log(fileName)
        splitFile.mergeFiles(data.names, fileName)
  		.then(() => {
  		console.log('Done!');
  		t_end = new Date().getTime();
        console.log(t_end - t_start + 'ms');
        })
        .catch((err) => {
            console.log('Error: ', err);
        });

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
//listNames(testFolder, '5gbtest.zip')
     
   
 }



 ipcMain.on('item:add', function(e, item){
	mainWindow.webContents.send('item:add', item);
	addWindow.close(); 
	// Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
	//addWindow = null;
  });



  ipcMain.on('config:safe', function(e, i){
	console.log("hallo ",i);
	
	if(i.username != "" || i.username !=  "0"){
		MyConfig.set("username", i.username);
	}else{
		console.log("Unzulässige Daten = ", i.username);
	}
  console.log("PW Daten = ", i.password);
  MyConfig.set("password", i.password);
  MyConfig.set("id", i.id);
  MyConfig.set("server.ip", i.server.ip);
  MyConfig.set("server.port", i.server.port);
  MyConfig.set("printer.standard", i.printer.standard);
  MyConfig.set("printer.all", i.printer.all);
  MyConfig.set("virtual_printer.ip", i.virtual_printer.ip);
  MyConfig.set("virtual_printer.port", i.virtual_printer.port);
  
  MyConfig.set("allow.print_from_ext", i.allow.print_from_ext);
  MyConfig.set("allow.print_to_ext", i.allow.print_to_ext);
  loadHTML('public/mainWindow.html');
  setJSON({name: "firststart", val: "false"})
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


Client(config.ext_server)

function Client(c) {
//	const io = require("socket.io-client"), ioClient = io.connect("http://" + c.ip + ":" + c.port);
	//console.log("http://",c.ip,":",c.port);
//	ioClient.on("seq-num", (msg) => console.info(msg));
}


var options =  { 
	onKeyPress: function(cep, event, currentField, options){
   console.log('An key was pressed!:', cep, ' event: ', event,'currentField: ', currentField, ' options: ', options);
		if(cep){
		  var ipArray = cep.split(".");
		  var lastValue = ipArray[ipArray.length-1];
		  if(lastValue !== "" && parseInt(lastValue) > 255){
			  ipArray[ipArray.length-1] =  '255';
			  var resultingValue = ipArray.join(".");
			  currentField.attr('value',resultingValue);
		  }
	}             
}};

$('.ip_address').mask("000.000.000.000", options);


try {
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