var traffic = {"down": 0,"up": 0}
var speedDia = [];
var sizeDia = [];


/**
 * steamDataSize
 * @param pwd {number} BufferLength, {bool} upload, {string} IP
 * @returns {number} speed
 */
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

/**
 * speedtest
 * @param pwd {number} size, {number} time
 * @returns {number} speed
 */
function speedtest(size, time){
    var speed = size / time;
    var out = speed.toFixed(2)
    return out;
}

/**
 * streamSpeedAnalyse
 * @param pwd {bool} upload, {number} speedtest, {number} Fullsize, {string} IP
 * @returns {Object} {"speed": speed, "size": size,  "FinishTime": time, "upload": upload, "ip": ip };
 */
function streamSpeedAnalyse(upload, speed, size, ip){
    var time = Date.now()
    var out = {"speed": speed, "size": size,  "FinishTime": time, "upload": upload, "ip": ip }; 
    speedDia.push(out);
    console.log('steamSpeedAnalyse = ');
    console.log(speedDia);
    return out;
}



module.exports = {
    speed: speedtest,
    streamSize: steamDataSize,
    speedtest: speedtest,
    streamAnalyse: streamSpeedAnalyse,

  };