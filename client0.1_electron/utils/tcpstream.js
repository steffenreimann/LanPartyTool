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
var socket;
 /**
 * Creates TCP Server tets
 * @param number {number}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function runTCP_Server(port) {
    
    server.on('connection', function (socket) {
        socket.on('login', function (username) {
          console.log('Trying to login: ' + username);
        });
        socket.on('LT-Broadcast', function (data) {
          console.log('LT-Broadcast');
          console.log(data);
        });
        socket.on('zip', function (readStream, info) {
            console.log('Server upload');
            const Wstream = fs.createWriteStream(path.join(info));
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
                console.log("File end");
            });
        });
    });
    server.listen(port);
}


 /**
 * Stops TCP Server 
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function stopTCP_Server(port) {
    
}


 /**
 * Start an Client connection to server
 * @param host string
 * @param port number
 * @return 
 */
function runTCP_Client(host, port) {
    // Client
    socket = new Socket({
        host: host,
        port: port
    }); 
    //socket.emit('login', 'alejandro');
}
 /**
 * Stops an Client connection to server
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function stopTCP_Client(port) {
    
}

 /**
 * Stops an Client connection to server
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function upload2server(params) {
    
}

 /**
 * Stops an Client connection to server
 * @param obj {Object}
 * @return {Object} {error:boolean, obj:cloned object}
 */
function upload(file) {
    var startTime = Date.now();
    //const inpu = fs.createReadStream('./games/GOPR0292.zip');
    console.log(fs.lstatSync(file).isFile());
    const inpu = fs.createReadStream(file);
    var inpu_size = 0
    //socket.emit('login', new User('alex', '1234'));
    var writeStream = socket.stream('zip', file);
    //fs.createReadStream('./games/img.zip').pipe(writeStream);

    inpu.on('data', function(data){

        var datas = steamDataSize(data.length, false, "localhost" );
        inpu_size = inpu_size + datas.size;
        
        var sectionTime = Date.now() - startTime;
        sectionTime = sectionTime / 1000;
        //Schreibt Datenstream in result 
        const isReady = writeStream.write(data);
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
        var speed = speedtest(inpu_size, fullTime)
        console.log(fullTime);
        console.log(speed);
        //console.log(datas);
        // steamSpeedAnalyse("false", speed, inpu_size, params.ip);
    })
    inpu.on('error', function(data){
        console.log('-- ERROR --');
        console.log(data);
    })	
}




module.exports = {
    runServer: runTCP_Server,
    stopServer: stopTCP_Server,
    runClient: runTCP_Client,
    stopClient: stopTCP_Client,
    upload: upload
  };