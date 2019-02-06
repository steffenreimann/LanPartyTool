const fs = require('fs');
const os = require('os');
const path = require('path');
const aes = require('../utils/aesEncrypt');


let homeDir = '';
let baseDir = 'LanToolConfigs';
const userCfgName = 'user.cfg';
let userCfg = null;
let userCfgPath = '';


function init() {
    homeDir = os.homedir();
    baseDir = path.join(homeDir, baseDir);
    userCfgPath = path.join(baseDir, userCfgName);
    return fs.existsSync(baseDir);
}

function read(file, callback){

    
    var params = req.params;
    console.log(params);
    

    const inpu = fs.createReadStream('./public/files/' );
    var inpu_size = 0
    var startTime = Date.now();

    inpu.on('data', function(data){

        var datas = steamDataSize(data.length, false, params.ip );
        inpu_size = inpu_size + datas.size;
        
        var sectionTime = Date.now() - startTime;
        sectionTime = sectionTime / 1000;

        //Schreibt Datenstream in result 
        const isReady = callback(data);

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
        callback([null, {error: true}]);
        console.log('-- ERROR --');
    })	
}    


module.exports = {
    Init: init,
    InitDirs: initDirs,
    GetBaseDir: getHomeDir,
    GetUserCfg: getUserCfg,
    LoadUserConfig: loadUserConfig,
    WriteUserConfig: writeUserConfig,
};
