var traffic = {"down": 0,"up": 0}

function speedtest(size, time){
    var nowTime = Date.now()
    var speed = size / time;
    var out = speed.toFixed(2)
    return out;
}
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

module.exports = {
    speed: speedtest,
    streamSize: steamDataSize
  };