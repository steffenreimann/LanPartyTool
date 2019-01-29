'use strict';
var os = require('os');
var ifaces = os.networkInterfaces();
var express        	= require('express');   
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
var app            	= express();  
var httpServer		= require("http").createServer(app);  
var io 				= require('socket.io').listen(httpServer);
var parseUrl = require('parseurl')
var send = require('send')



var Server = require('fast-tcp').Server;
var Socket = require('fast-tcp').Socket;
var server = new Server();


var intip
var clients = new Array(); // or the shortcut: = []
var counter = 0;
var chat = [];
var port = "8081"
var traffic = {"down": 0,"up": 0}
const testpath = './public/files/0ad.zip';

var linkdata = { a: '<a type="button" href="http://',
            link: 'http://www.deinedomain.de',
            taget: '" target="_blank" rel="noopener">',
            aend: '</a>'
            }
var picdata = { a: '<img src="',
            link: 'http://www.deinedomain.de',
            aend: '" alt="uploaded img" class="chatimg mit" >'
            }
var viddata = { a: '<video src="',
            link: 'http://www.deinedomain.de',
            control: '" class="chatimg mit" controls>',
            aend: '</video>'
            }


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
    server.listen('8090');

    server.on('connection', function (socket) {
      socket.on('login', function (username) {
        console.log('Trying to login: ' + username);
      });
    
    });
    
    





    console.log('Http Server Läuft unter http://' + intip + ':' + port);
    console.log('File Server Läuft unter ' + intip + ':' + '8090');
    app.use(express.static(__dirname + '/public'));

    app.use('/games', express.static(__dirname + '/public/files/'));

    app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html');			
	});
    
    app.use(busboy({
        highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
    })); // Insert the busboy middle-ware

    const uploadPath = path.join(__dirname, 'public/files/'); // Register the upload path
    fs.ensureDir(uploadPath); // Make sure that he upload path exits

    app.route('/upload').post((req, res) => {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var startTime = Date.now();
        
        //console.log(req.rawHeaders)
        
        var file_size = req.headers['content-length']
        //console.log(parseInt(file_size))
        
        
        req.pipe(req.busboy); // Pipe it trough busboy
        req.busboy.on('file', (fieldname, file, filename) => {
            console.log(`Upload of '${filename}' started`);
            // Create a write stream of the new file
            const fstream = fs.createWriteStream(path.join(uploadPath, filename));
            var inpu_size = 0
            var startTime = Date.now();
            
            file.on('data', function(data){
                var datas = steamDataSize(data.length, true, ip);
                inpu_size = inpu_size + datas.size;
                
                var sectionTime = Date.now() - startTime;
                sectionTime = sectionTime / 1000;
                
                //console.log(speedtest(inpu_size, sectionTime));
                const isReady = fstream.write(data);
                //Wenn Result nicht Bereit ist 
                if(!isReady){
                    //wird der Inputstream gestoppt
                   file.pause();
                    //ist der resultstream wieder aufnahmefähig 
                    fstream.once('drain', function(){
                        //wird der inputstream gestartet
                        file.resume();
                    });      
                }
            });
            
            file.on('end', function(data){
                fstream.end();
                console.log('-- END -- Upload');
                //console.log(inpu_size);
                var fullTime = Date.now() - startTime;
                fullTime = fullTime / 1000;
                var speed = speedtest(inpu_size, fullTime)
                //console.log(fullTime);
                //console.log(speed);
                steamSpeedAnalyse("true", speed, inpu_size, ip);
                
                var ChatData = {text: "", ip: ip, speed: speed, filename: filename};
                chatfunc(chatContentSwitch(ChatData));
            })
            
            file.on('error', function(data){
                console.log('-- ERROR -- Upload');
            })
        
            // On finish of the upload
            fstream.on('close', () => {
                console.log(sizeDia);
                
                console.log(`Upload of '${filename}' finished`);
                res.redirect('back');

                
                
                
                
            });
        });
        req.busboy.on('finish', function () {
            //res.writeHead(200, {'Connection': 'close'});
            //res.end();
        });
    });
    
    function chatContentSwitch(data){
        var tt = data.filename.split('.').pop();
        //console.log(tt)
        if(tt === 'jpg' || tt === 'png' || tt === 'gif' || tt === 'tif' || tt === 'jpeg'){
            data.text = picdata.a + "/games/" + data.filename + picdata.aend;
        }else if(tt === 'mp4' || tt === 'ogg' || tt === 'webm' || tt === 'mp3'){
            data.text = viddata.a + "/games/" + data.filename + viddata.control + viddata.aend;
        }else{
            data.text = linkdata.a + intip + ":" + port + "/download/test/" + data.filename + linkdata.taget + data.filename + linkdata.aend;
        }
        
        
        data.name = data.speed + "MB/s"
        data.ip = "gesendet von " + data.ip
        
        return data
    }
    
    
    app.get('/download/:ip/:path', function(req, res) {
        
        var params = req.params;
        console.log(params);
        
        const inpu = fs.createReadStream('./public/files/' + params.path);
        var inpu_size = 0
        var startTime = Date.now();
       
        inpu.on('data', function(data){

            var datas = steamDataSize(data.length, false, params.ip );
            inpu_size = inpu_size + datas.size;
            
            var sectionTime = Date.now() - startTime;
            sectionTime = sectionTime / 1000;
            
            //console.log(sectionTime.toFixed(2));
            //console.log(inpu_size.toFixed(2));
            //console.log(speedtest(inpu_size, sectionTime));

            
            //Schreibt Datenstream in result 
            const isReady = res.write(data);
            //Wenn Result nicht Bereit ist 
            if(!isReady){
                //wird der Inputstream gestoppt
               inpu.pause();
                //ist der resultstream wieder aufnahmefähig 
                res.once('drain', function(){
                    //wird der inputstream gestartet
                    inpu.resume();
                });      
            }
        })
        inpu.on('end', function(data){
            res.end();
            console.log('-- END --');
            console.log(inpu_size);
            var fullTime = Date.now() - startTime;
            fullTime = fullTime / 1000;
            var speed = speedtest(inpu_size, fullTime)
            console.log(fullTime);
           // console.log(speed);
            //console.log(datas);
            steamSpeedAnalyse("false", speed, inpu_size, params.ip);
        })
        inpu.on('error', function(data){
            console.log('-- ERROR --');
        })		
	});


}

var speedDia = [];
function speedtest(size, time){
    var nowTime = Date.now()
    var speed = size / time;
    var out = speed.toFixed(2)
    return out;
}

function steamSpeedAnalyse(upload, speed, size, ip){
    var time = Date.now()
    var out = {"speed": speed, "size": size,  "FinishTime": time, "upload": upload, "ip": ip }; 
    speedDia.push(out);
    console.log('steamSpeedAnalyse = ');
    console.log(speedDia);
    return out;
}

var sizeDia = [];

function steamDataSize(BufferLength, upload, ip, time){
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

io.sockets.on('connection', function (socket) {	
    
    socket.on('ping', function() {
        socket.emit('pong', traffic );      
              
    });
    
	var address = socket.handshake.address;
    
    var cx = address.lastIndexOf(":");
    var cy = address.slice(cx + 1);
    
    if(cy === "1"){
        address = intip 
        }else{
        address = cy
    }
    
    socket.on('filelist', function () {
        fs.readdir(__dirname + '/public/files', function(err, items) {
        console.log(items);
            socket.emit('filelist', items);
        });
    
    });
    
    members({"ip": address, "rw": "r"});
	console.log(address);
    
    
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
    
    socket.on('analyticData', function(){
        var data = {"text": "", "name": ""}
        data.text = 'Gesammt Upload = ' + traffic.up.toFixed(2) + 'MB  // ' + '  Gesammt Download = ' + traffic.down.toFixed(2) + 'MB '
        data.name = "Stats"
        data.ip = "Server"
        chatfunc(data);
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
        //console.log("IP die an den ersten client gegeben wird " + data.ip);
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
                    //console.log("Falses" + n.ip);
                    socket.emit('member', { ip: n.ip, member: res, name: n.name });
                   }
            }else if(res === true) {
                //console.log("isReady true")
                socket.emit('member', { ip: n.ip, member: res, name: n.name });
            }
               
               
                
            
            //console.log("Alle getested");
        }
    }

    function isIP(n , callback) {
       // console.log("Client = " + n.ip)
       // console.log(data.ip)
        if(n.ip === data.ip ) {
           // console.log("IP Arr= " + n.ip)
           // console.log("IP Client= " + data.ip)
           // console.log("Sind gleich")
            callback(true, n);
            
        }else {
        //    console.log("IP Arr= " + n.ip)
        //    console.log("IP Client= " + data.ip)
        //    console.log("Sind nicht gleich")
            callback(false, data);
        }

    }
       
       
       
}
  	
}
    
    
    function newfile(path, data) {
        //setInterval(function() {}, 5000);
        startTime = Date.now();
        //console.log("Lade Ordner " + path);
        fs.readdir(path, (err, files) => {
            var filesOld = {};
                //console.log(files.length);
                if(files != filesOld){
                 //   console.log("Änderung!");
                  //  console.log(files.length);
                   // filesOld = files;
                var i = 1
                var leng = files.length
                    files.forEach(function (file) {                   
                                      
                       // console.log(stats.isFile());
                        var filepath = path + file 
                        //console.log(filepath);
                        fs.stat(filepath, function(err, stats) { 
                            
                            if(stats.isFile === undefined) {
                       //         console.log("ich bin undefiniert")
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

function chatfunc(data) {
    if(chat.length <= 100) {
            chat.push(data);    
           // console.log(JSON.stringify(chat));  
        }else{
            chat.shift();
           // console.log(JSON.stringify(chat));
        }
    io.sockets.emit('chat', data);   
}

startServer();


