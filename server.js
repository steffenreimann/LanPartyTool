try {

'use strict';
var os = require('os');
var ifaces = os.networkInterfaces();
var express        	= require('express');  
var app            	= express();  
var httpServer		= require("http").createServer(app);  
var io 				= require('socket.io').listen(httpServer),
    dl  = require('delivery'),
    fs  = require('fs');
    
var parseUrl = require('parseurl')
var send = require('send')
    
var intip
var clients = new Array(); // or the shortcut: = []
var counter = 0;
var chat = [];
    var port = "8081"
var linkdata = { a: '<a type="button" href="http://',
            link: 'http://www.deinedomain.de',
            taget: '" target="_blank" rel="noopener">',
            aend: '</a>'
            }

} catch (ex) {
    //console.log(ex);
    console.log(ex.code)
    if(ex.code == 'MODULE_NOT_FOUND'){
	    console.log(ex)
	    //exec("npm install ", puts);
	    
    }
    
}




const folder_path_win = './public/files/windows/';
const folder_path_osx = './public/files/macos/';
const folder_path_lin = './public/files/linux/';
const folder_path_tool = './public/files/tool/';
//const folder_ext = './../../../../Volumes/Untitled/'
const folder_inhalt_win = []
const folder_inhalt_osx = []
const folder_inhalt_lin = []
const folder_inhalt_tool = []

const testpath = './public/files/0ad.zip';
//dirsys(folder)



//fs.stat(folder_ext, function(err, stats) {
//    console.log(folder_ext);
//    console.log();
//    console.log(stats);
//    console.log();
// 
//    if (stats.isFile()) {
//        console.log('    file');
//    }
//    if (stats.isDirectory()) {
//        console.log('    directory');
//    }
// 
//    console.log('    size: ' + stats["size"]);
//    console.log('    mode: ' + stats["mode"]);
//    console.log('    others eXecute: ' + (stats["mode"] & 1 ? 'x' : '-'));
//    console.log('    others Write:   ' + (stats["mode"] & 2 ? 'w' : '-'));
//    console.log('    others Read:    ' + (stats["mode"] & 4 ? 'r' : '-'));
// 
//    console.log('    group eXecute:  ' + (stats["mode"] & 10 ? 'x' : '-'));
//    console.log('    group Write:    ' + (stats["mode"] & 20 ? 'w' : '-'));
//    console.log('    group Read:     ' + (stats["mode"] & 40 ? 'r' : '-'));
// 
//    console.log('    owner eXecute:  ' + (stats["mode"] & 100 ? 'x' : '-'));
//    console.log('    owner Write:    ' + (stats["mode"] & 200 ? 'w' : '-'));
//  console.log('    owner Read:     ' + (stats["mode"] & 400 ? 'r' : '-'));
//
//    console.log('    file:           ' + (stats["mode"] & 0100000 ? 'f' : '-'));
//    console.log('    directory:      ' + (stats["mode"] & 0040000 ? 'd' : '-'));
// 
// 
// 
//});






function startServer(){
    
    
	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;
	  ifaces[ifname].forEach(function (iface) {
	    if ('IPv4' !== iface.family || iface.internal !== false) {
	      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	      return;
	    }
	    if (alias >= 1) {
	      // this single interface has multiple ipv4 addresses
	      //console.log(ifname + ':' + alias, iface.address);
	      intip = ifaces.address;
	    } else {
	      // this interface has only one ipv4 adress
	      //console.log(ifname, iface.address);
	      intip = iface.address;
	      //console.log(intip)
	    }
	    ++alias;
	  });
	});
    
	httpServer.listen(port);
	console.log('Server Läuft unter http://' + intip + ':' + port);
    app.use(express.static(__dirname + '/public'));
    app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
					
	});
    
    app.get('/0ad', function(req, res) {
			
        var pathname = '/public/files/0ad.zip'
        res.sendFile(__dirname + pathname);
        
        });
    app.get('/big', function(req, res) {
			
        var pathname = '/public/files/fcp.zip'
        res.sendFile(__dirname + pathname);
        
        });
    
    
	// opens the url in the default browser 
	//opn('http://' + intip + ':' + '8081/');
    

    //
    console.log(intip);
    
}


	
io.sockets.on('connection', function (socket) {	
    
    newfile(folder_path_win, "win")
    newfile(folder_path_osx, "osx")
    newfile(folder_path_lin, "lin")
    newfile(folder_path_tool, "tool")
    //newfile(folder_ext, "tool")
    
    socket.on('ping', function() {
    socket.emit('pong');
  });
    var delivery = dl.listen(socket);
	var address = socket.handshake.address;
    
    var cx = address.lastIndexOf(":");
    var cy = address.slice(cx + 1);
    
    if(cy === "1"){
        address = intip 
        }else{
        address = cy
    }
    
    members({"ip": address, "rw": "r"});
	console.log(address);
    
    socket.on('download', function(){
        //console.log("download");
    
        delivery.send({
          name: '0ad.zip',
          path : './public/files/0ad.zip',
          params: {foo: 'bar'}
        });
    
        
    delivery.on('send.success',function(file){
      //console.log('File successfully sent to client!');
    });
 
  });
    
    socket.on('file', function(){
        newfile(folder_path_win, "win")
        newfile(folder_path_osx, "osx")
        newfile(folder_path_lin, "lin")
        newfile(folder_path_tool, "tool")
    //newfile(folder_ext, "tool")
  });
    
    
    delivery.on('receive.success',function(file){
        
        var data = { name: "", ip: "", text: "Data" }
        var params = file.params;
        fs.writeFile(__dirname + '/public/files/tool' + file.name,file.buffer, function(err){
            if(err){
                
                console.log('File could not be saved.');
                chat(data);
            }else{
                console.log('File saved.');
                data.name = linkdata.a + intip + ":" + port + "/files/tool" + file.name + linkdata.taget + file.name + linkdata.aend;
                data.ip = ""
                data.text = "Es wurde " + file.name + " hochgeladen!"
                chatfunc(data);
                
            };
        });
        fs.readdir(folder_path_tool, (err, files) => {
            console.log(files);
        })
        
        
    });
    
    
    socket.on('member', function(data){
    
        console.log("IP = " + data.ip);
        console.log("Name = " + data.name);
        console.log("OS = " + data.OSName);
        console.log("RW = " + data.rw);
        members(data)

    });
    
    socket.on('chatn', function(){
        
        socket.emit('chatn', chat);
    });
    
    socket.on('user', function(){
        console.log("User möchte clients haben");
        socket.emit('users', clients);
    });
    
    socket.on('chat', function(data){
        
        chatfunc(data);
        
        
  	});
	
	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
  	
  	socket.on('solo-ping', function(data){
	  	pig(data);
	  	requ(data);
  	});
    
  	socket.on('test', function(data){
	  	linker(data)
  	});
  	
  	socket.on('multi-ping', function(data){
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
		
  	});
    
    socket.on('shutdown', function(data){
	  	sfhdks();
  	});
    
    function client_push(data) {
        clients.push({"name": data.name, "ip": data.ip, "OSName": data.OSName, "member": true } );
    }
    
    function members(data){
        
    if(data.rw == "w" && data.name != "" && data.ip != "" && data.name != undefined && data.ip != undefined){
        //clients.push()
        console.log("Name und IP sind nicht leer");
        //socket.emit('member', { member: true });
        clients.push({"name": data.name, "ip": data.ip, "OSName": data.OSName} );
        console.log(JSON.stringify(clients))
        w(data);
    }else if(data.rw == "r"){
        w(data);
        
    }
        
    
    function w(data) {
       
       
   var falses = 0; 
    if(clients.length <= 0 ){
        console.log("IP die an den ersten client gegeben wird " + data.ip);
        socket.emit('member', { ip: data.ip, member: "false" });
       }else{
           for(var i=0;i<clients.length;i++) {
                isIP(clients[i], isReady);
               console.log("Client " + i + " = " + JSON.stringify(clients[i]))
            }
       }
   
    function isReady(res, n) {
        counter = counter + 1;
        
        if(counter >= clients.length) {
            if(res === false){
                falses++
                if(falses === clients.length){
                    console.log("Falses" + n.ip);
                    socket.emit('member', { ip: n.ip, member: res, name: n.name });
                   }
            }else if(res === true) {
                console.log("isReady true")
                socket.emit('member', { ip: n.ip, member: res, name: n.name });
            }
               
               
                
            
            console.log("Alle getested");
        }
    }

    function isIP(n , callback) {
        console.log("Client = " + n.ip)
        console.log(data.ip)
        if(n.ip === data.ip ) {
            console.log("IP Arr= " + n.ip)
            console.log("IP Client= " + data.ip)
            console.log("Sind gleich")
            callback(true, n);
            
        }else {
            console.log("IP Arr= " + n.ip)
            console.log("IP Client= " + data.ip)
            console.log("Sind nicht gleich")
            callback(false, data);
        }

    }
       
       
       
}
  	
}
    
    function chatfunc(data) {
        
        if(chat.length <= 10) {
            
            chat.push(data);    
            console.log(JSON.stringify(chat));
            
        }else{
            chat.shift();
            console.log(JSON.stringify(chat));
        }
        
        //console.log(data);
        //socket.emit('chat', data);
        io.sockets.emit('chat', data);
        
    }
    
    function newfile(path, data) {
    
    
    
    //setInterval(function() {}, 5000);
        startTime = Date.now();
        console.log("Lade Ordner " + path);
        
        fs.readdir(path, (err, files) => {
            var filesOld = {};
                
                
                //console.log(files.length);
                if(files != filesOld){
                    console.log("Änderung!");
                    console.log(files.length);
                   // filesOld = files;
                var i = 1
                var leng = files.length
                    files.forEach(function (file) {
                         
                        
                        
                       // console.log(stats.isFile());
                        var filepath = path + file 
                        //console.log(filepath);
                        fs.stat(filepath, function(err, stats) { 
                            
                            if(stats.isFile === undefined) {
                                console.log("ich bin undefiniert")
                                //console.log(path);
                            }else if(stats.isFile() === true) {
                                var os = path
                                var os = os.slice(15, os.length-1)
                                //console.log(os)
                                
                                //console.log(file)
                                var newpath = os
                                var newValue = file
                                
                                console.log(newValue)
                                filesOld[newpath] = newValue ;
                                    //console.log(filesOld.path)
                                    //console.log(newValue)
                                var byte = stats["size"];
                                kb = byte / 1000
                                mb = kb / 1000
                                gb = kb / 1000
                                
                               // console.log("Files = " + JSON.stringify(filesOld));
                                //console.log(file)
                                if(file != ".DS_Store"){
                                io.sockets.emit('file', {'os': newpath, path: path, name:file, leng: leng, size: mb});
                                }
                                //console.log(filepath);
                                //filesOld.push( { 'path': filepath, 'os': data, size: mb.toFixed(2) });
                                leng--

                                }
                            })
                        
                            if(i === files.length){
                               
                                //console.log("Fertig");
                                //console.log(files.length);
                                
                                
                                //console.log("Files = " + JSON.stringify(filesOld));
                            }
                         i++
                        });
                   
                }
                    
                
            
        
        });
    
    }
    
    function dirsys(path) {
    
    fs.stat(path, function(err, stats) {
        
        //console.log(stats.isFile())
        //console.log(stats.isDirectory())
        
        
       if(stats.isFile() === true) {
            
        }else if(stats.isDirectory() === true) {
             
           console.log("dir");
            
            fs.readdir(path, (err, files) => {
                //console.log(files);
                var path
                files.forEach(function (file) {
                    //console.log(file);
                    path = folder + file
                    //filesys(path)
                });
            })
            
        }
    });
    
    };

    function filesys(path) {
    
    fs.stat(path, function(err, stats) {
        
        //console.log(stats.isFile())
        //console.log(stats.isDirectory())
        
        if(stats.isFile === undefined) {
            console.log("ich bin undefiniert")
            console.log(path);
        }else if(stats.isFile() === true) {
            //console.log("file");
            var byte = stats["size"];
            kb = byte / 1000
            mb = kb / 1000
            gb = kb / 1000


            //console.log( path + " - " + byte);
            //console.log( path + " - " + kb);
            //console.log( path + " - " + mb.toFixed(2) + "MB");

        }
    });

};
    
});


startServer();



