/*
 * Utility functions for all sort of Object, Array and string operations
 * Initial author: Steffen Reimann
 * Created: 19.07.2019
 */
const path = require('path');
var fs = require('fs')
var Server = require('fast-tcp').Server;
var server = new Server(); 
var Socket = require('fast-tcp').Socket;
var client_sockets = [];
var messure = require('./messure.js'); 
var log = true
var crypto = require('crypto');
// Import events module
var events = require('events');
var tempDir = []
// Create an eventEmitter object
var obj = new events.EventEmitter();
var user_data = new events.EventEmitter();

var server_client_connections = []
 /**
 * Creates TCP Server
 * @param number {number}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function runTCP_Server(port, dir) {
    console.log('Try Starting TCP Server ...' );
    readDir(dir, function(data){
        console.log('Reading Dir ...' );
        console.log(data);
        tempDir = data
        user_data.emit("tempDir", tempDir);
    })
    
    server.on('connection', function (socket) {
        
        console.log(server_client_connections);
        console.log('TCP Server ... Client Connection ...');
        socket.on('login', function (d) {
            console.log('Trying to login: ' + d.ip);
            server_client_connections.push({socket: socket, ip: d.ip, username: d.data.config_user, user_uuid: d.data.config_uuid});
            console.log(server_client_connections[0]);
        });
        socket.on('LT-Broadcast', function (data) {
          console.log('LT-Broadcast');
          console.log(data);
        });
        socket.on('download', function (info) {

            var paath = path.join(dir, info.path)
            console.log('Server // Download request from client');
            console.log(paath);

            const readStream = fs.createReadStream(paath);
            console.log(fs.lstatSync(paath));
            var WriteStream = server.stream('download' + info.path, fs.lstatSync(paath).size);
            readStream.on('data', function(data){
                console.log('Server // data download');

                const isReady = WriteStream.write(data);
                if(!isReady){
                    //wird der Inputstream gestoppt
                    readStream.pause();
                    //ist der resultstream wieder aufnahmefähig 
                    WriteStream.once('drain', function(){
                        //wird der inputstream gestartet
                        readStream.resume();
                    });  
                }
            });
            readStream.on('end', function() {
                WriteStream.end();
                console.log("Server // File end");
                return true
            });
            readStream.on('error', function(data){
                console.log('Server // -- ERROR -- ');
                WriteStream.end();
                console.log(data);
                return false
            })
        });
        socket.on('upload', function (readStream, info) {
            var str = JSON.stringify(info.client); 
            console.log('Server //  upload new path');
            var base = path.basename(info.path)
            var tmp_path = path.join(dir, str + base)
            console.log(base);
            console.log(tmp_path);
            const Wstream = fs.createWriteStream(tmp_path);
            readStream.on('data', function(data){
                const isReady = Wstream.write(data);
                if(!isReady){
                    //wird der Inputstream gestoppt
                    readStream.pause();
                    //ist der resultstream wieder aufnahmefähig 
                    Wstream.once('drain', function(){
                        //wird der inputstream gestartet
                        readStream.resume();
                    });  
                }
            });
            readStream.on('end', function() {
                Wstream.end();
                console.log("Server // File end upload");
                return true
            });
            readStream.on('error', function(data){
                console.log('-- ERROR -- server');
                console.log(data);
                return false
            })
        });
        socket.on('list', function (req, callback) {
            //dirList = readDir(dir)
            //console.log(dirList)
            callback(tempDir);
        });
        socket.on('close', function() {
            console.log('Server // Client closed Connection ');
            //client_sockets[client_sockets.length - 1].destroy();
            //client_sockets.splice( client_sockets.length - 1, 1 )
            //console.log( client_sockets.length);
            //return null
        });
    });
    
    server.listen(port);
}

function loadClients() {
    return server_client_connections
}

 /**
 * Stops TCP Server 
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function stopTCP_Server(port) {
    
}

/**
 * Read any dir
 * @param dir string
 * @return Array
 */
function readDir(dir, callback) {
    var out = []
    var algo = 'md5';
    fs.readdir(dir, (err, files) => {
        //console.log("files : " +  JSON.stringify(files));
        var i = 0  
        files.forEach(element => {    
            fs.lstat(path.join(dir, element), (err, stats) => {
                
                //console.log(`Is file: ${stats.isFile()}`);
                //console.log(`Is directory: ${stats.isDirectory()}`);
                var FileSize = stats.size / 1000000;
                //console.log(FileSize);
                FileSize = Math.round(FileSize)
                var sizeMGB = 0
                if(FileSize >= 1000){
                    sizeMGB = FileSize / 1000
                    sizeMGB = sizeMGB + " GB"
                }else{
                    sizeMGB = FileSize + " MB"
                }

                if(stats.isFile()){
                    var shasum = crypto.createHash(algo);

                    var s = fs.ReadStream(path.join(dir, element));
                    s.on('data', function(d) { shasum.update(d); });

                    s.on('end', function() {
                        i++
                        var d = shasum.digest('hex');
                        console.log(d);
                        
                        out.push({filename: element, isFile: stats.isFile(), isDir: stats.isDirectory(), size: sizeMGB, fileuuid: d  })
                        if(i == files.length){
                            console.log("Out " + out);
                            callback(out);
                            user_data.emit("tempDir", out);
                            out = ""
                        }
                    }); 
                }
                   
                //console.log(out);
                //console.log("i " + i);
                //console.log("files.length " + files.length);
                
            });
        }); 
    });
}


var client_server_connections = []

 /**
 * Start an Client connection to server
 * @param host string
 * @param port number
 * @return 
 */
function runTCP_Client(data, port) {
var host = data.ip    
var name = data.name
    // Client
    client_sockets.push(new Socket({
        host: host,
        port: port,
        reconnect: false
    }));

   // console.log(client_sockets[client_sockets.length - 1]); 

    console.log(client_sockets[client_sockets.length - 1]._socket.connecting); 
    
    if(client_sockets[client_sockets.length - 1]._socket.connecting){
        console.log(); 
    }

    client_sockets[client_sockets.length - 1].emit('list' , "1", function (response) {
        console.log('Response Client : ' + response);
        client_server_connections.push({host: host, port: port, loadable: response, server: client_sockets.length - 1, name: name})
        console.log("Client = " + JSON.stringify(client_server_connections));
      });

    client_sockets[client_sockets.length - 1].on('close', function() {
        console.log('Connection closed');
        //client_sockets[client_sockets.length - 1].destroy();
        client_sockets.splice( client_sockets.length - 1, 1 )
        console.log( client_sockets.length);
        return null
    });
}

 /**
 * Stops an Client connection to server
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function stopTCP_Client(server) {
    client_sockets[server].destroy();
    console.log('stopTCP_Client : ' + server);
    
    client_server_connections.splice( server, 1 )
    //loadListFormServer();
    console.log('client_server_connections : ' + client_server_connections.length);
}

 /**
 * Stops an Client connection to server
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function upload2server(params) {
    
}

function loadListFormServer(server) {
    
    var i = 0
    console.log('client_server_connections.length : ' + client_server_connections.length);
    if(client_server_connections.length >= 1){

    
        client_server_connections.forEach(element => {
            client_sockets[element.server].emit('list' , "1", function (response) {
                console.log('Response Client : ');
                console.log(response);
                i = response
                client_server_connections[element.server].loadable = response
                user_data.emit("client_server_connections", client_server_connections);
            });
        });
    }
        //client_server_connections.push({host: host, port: port, loadable: response, server: server})
     
    return client_server_connections;
}

function acc(path) {
    fs.access(path, fs.F_OK, (err) => {
        if (err) {
            console.error(err)
            return false
        }
        return true
        //file exists
    })
}

function login(data){
    client_sockets[client_sockets.length - 1].emit('login' , data, function (response) {
        console.log('Response login Client : ' + response);
        
    });
}


function download(dpath, file, server) {
    var startTime = Date.now();
    var paathh = path.join(dpath, file)
    console.log(file);
    console.log(server);
    console.log('Client Download request to server');
    var fileAcc = true
            //var base = path.basename(info.path)
            ///var tmp_path = path.join(dir, str + base)
            //console.log(base);
            //console.log(tmp_path);

    fs.access(paathh, fs.F_OK, (err) => {
        if (err) {
            //console.error(err)
            fileAcc = true
        }else{
            fileAcc = true
            var paathh = path.join(dpath, file + '(1)')
        //file exists
        }
        
    })


    if(fileAcc){
        console.log("fileAcc");
        console.log(fileAcc);
        client_sockets[server].emit('download', {'path': file, 'client': server});

        client_sockets[server].on('download' + file, function (readStream, info) {
            var WriteStream = fs.createWriteStream(paathh);
            console.log(info);
            console.log(paathh);
            var inpu_size = 0    
            readStream.on('data', function(data){
                var datas = messure.streamSize(data.length, false, server );
                inpu_size = inpu_size + datas.size;
                var sectionTime = Date.now() - startTime;
                sectionTime = sectionTime / 1000;
                const isReady = WriteStream.write(data);
                if (log) {
                    obj.emit("downloading", {finishSize: inpu_size, size: info, file: file, server: server});

                    
                }
                if(!isReady){
                    //wird der Inputstream gestoppt
                    readStream.pause();
                    //ist der resultstream wieder aufnahmefähig 
                    WriteStream.once('drain', function(){
                        //wird der inputstream gestartet  
                        readStream.resume();  
                    });       
                }
            });
            readStream.on('end', function() {
                WriteStream.end();
                console.log("File end client");
                var fullTime = Date.now() - startTime;
                fullTime = fullTime / 1000;
                var speed = messure.speed(inpu_size, fullTime)
                console.log(fullTime);
                console.log(speed);
                //console.log(datas); 
                
                return messure.streamAnalyse(false, speed, inpu_size, server);
            });
            readStream.on('error', function(data){
                WriteStream.error();
                WriteStream.end();
                console.log('-- ERROR -- client');
                console.log(data);
                
                return data
            })  
        });
    }   
}

 /**
 * Upload an File to server
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function upload(file, server) {
    var startTime = Date.now();
    //const inpu = fs.createReadStream('./games/GOPR0292.zip');
    console.log(file);
    console.log(fs.lstatSync(file).isFile());
    const inpu = fs.createReadStream(file);
    var inpu_size = 0
    //socket.emit('login', new User('alex', '1234'));
    var writeStream = client_sockets[server].stream('upload', {'path': file, 'client': server});
    console.log('write stream to server ' + server);
    //fs.createReadStream('./games/img.zip').pipe(writeStream);

    inpu.on('data', function(data){

        var datas = messure.streamSize(data.length, true, "localhost" );
        inpu_size = inpu_size + datas.size;
        
        var sectionTime = Date.now() - startTime;
        sectionTime = sectionTime / 1000;
        //Schreibt Datenstream in result 
        const isReady = writeStream.write(data);

        if (log) {
            obj.emit("uploading", inpu_size);
        }
        //Wenn Result nicht Bereit ist 
        if(!isReady){
            //wird der Inputstream gestoppt
            inpu.pause();
            //ist der resultstream wieder aufnahmefiähig 
            writeStream.once('drain', function(){
                //wird der inputstream gestartet
                inpu.resume();
            });      
        }
    })
    inpu.on('end', function(data){
        writeStream.end();
        console.log('-- END --');
        console.log(inpu_size);
        var fullTime = Date.now() - startTime;
        fullTime = fullTime / 1000;
        var speed = messure.speed(inpu_size, fullTime)
        console.log(fullTime);
        console.log(speed);
        //console.log(datas);
        
        return messure.streamAnalyse(true, speed, inpu_size, "localhost");
    })
    inpu.on('error', function(data){
        console.log('-- ERROR --');
        console.log(data);
        return data
    })	
}

function setLog(data) {
    console.log('set Log');
    console.log(data);
    log = data
}

// export the EventEmitter object so others can use it

module.exports = {
    runServer: runTCP_Server,
    stopServer: stopTCP_Server,
    runClient: runTCP_Client,
    stopClient: stopTCP_Client,
    upload: upload,
    download: download,
    traffic: obj,
    user: user_data,
    setlog: setLog,
    list: loadListFormServer,
    login: login,
    loadClients: loadClients
  };