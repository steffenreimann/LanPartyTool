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
    
var intip
var clients = new Array(); // or the shortcut: = []
var counter = 0;
var chat = [];

var files
} catch (ex) {
    //console.log(ex);
    console.log(ex.code)
    if(ex.code == 'MODULE_NOT_FOUND'){
	    console.log(ex)
	    //exec("npm install ", puts);
    }
}

function startServer(){
	Object.keys(ifaces).forEach(function (ifname) {
        console.log(ifname)
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
    
	httpServer.listen("8081");
	console.log('Server Läuft unter http://' + intip + ':' + '8081/');
	app.use(express.static(__dirname + '/upload'));
    app.use(express.static(__dirname + '/public/files'));
    app.use(express.static(__dirname + '/public'));
    app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');
		console.log("Zugriff")			
	});
    
	// opens the url in the default browser 
	//opn('http://' + intip + ':' + '8081/');
    
    console.log(intip);
    
}



	
io.sockets.on('connection', function (socket) {	
    
    //readfiles(__dirname + '/public/files', socket)
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
    
    
    
    
    delivery.on('receive.success',function(file){
        var params = file.params;
        fs.writeFile(__dirname + '/public/files/' + file.name,file.buffer, function(err){
            if(err){
                console.log('File could not be saved.');
                socket.emit('uploadstatus', false);
            }else{
                console.log('File saved.');
                socket.emit('uploadstatus', true);
                
                io.emit('chat', { name: 'Server', ip: 'Server', text: __dirname + '/public/files/' + file.name });
                //socket.emit('chat', { name: 'Server', ip: 'Server', text: items[i] });
            };
        });
    });
    
    socket.on('filelist', function () {
        fs.readdir(__dirname + '/public/files', function(err, items) {
        console.log(items);
            socket.emit('filelist', items);
        });
    
    });
    socket.on('member', function (data) {
    
        console.log("IP = " + data.ip);
        console.log("Name = " + data.name);
        console.log("OS = " + data.OSName);
        console.log("RW = " + data.rw);
        members(data)

    });
    
    socket.on('chatn', function () {
        
        socket.emit('chatn', chat);
    });
    
    socket.on('user', function () {
        console.log("User möchte clients haben");
        socket.emit('users', clients);
    });
    
    socket.on('chat', function(data){
        
        console.log(chat.length);
        
        if(chat.length <= 10) {
            
            chat.push(data);    
            console.log(JSON.stringify(chat));
            
        }else{
            chat.shift();
            console.log(JSON.stringify(chat));
        }
        
        //console.log(data);
        socket.broadcast.emit('chat', data);
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
    
});
    //readfiles()

function readfiles(){
    
    fs.readdir(__dirname + '/public/files', function(err, items) {
        //console.log(items);
        
    });
    return items
}

startServer();



