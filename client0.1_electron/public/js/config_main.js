const handshake = require('./../handshake/handshakeHelper');

var qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 400,
    height : 400
});

var config_ServerDir = [];
var config_ClientDir = [];

function saveConfig() {
	//Hashing eines Passwords 
	var config_pw = $( "#config_pw" ).val();
	var config_user = $( "#config_user" ).val();
	//var config_serverDir = $( "#config_serverDir" ).val();
	//var config_ClientDir = $( "#config_ClientDir" ).val();
    //var config_uuid = uuidv1(); // -> v1 UUID
    if(isCorrect([config_pw, config_user],["","0"])){
        var data = {config_pw: config_pw, config_user: config_user, config_uuid: null, config_ServerDir: config_ServerDir, config_ClientDir: config_ClientDir }
        console.log(data);
        ipcRenderer.send('saveConfig', data , () => {})
    }else{
        console.log("isNotCorrect");
    }
    
}

function pushClientDir(dir, id) {
    if(dir == "" && id !== ""){
        dir = $( id ).val();
    }else{
        config_ClientDir.push(dir);
    }
    
}
function pushServerDir(dir) {
    if(dir == "" && id !== ""){
        console.log("config_ServerDir null");
    }else{
        console.log("config_ServerDir");
        config_ServerDir.push(dir);

    }
        console.log(config_ServerDir);
}

function listServerDir(params) {
    
}


ipcRenderer.on('saveConfig', (event, data) => { 
    console.log(data);
    $( "#config_user" ).val(data.config_user)
    $( "#config_uuid" ).val(data.config_uuid)
    $( "#config_updir" ).val(data.config_updir)
})

ipcRenderer.on('applogin', (event, data) => { 
    console.log(data);
})

ipcRenderer.on('loadPath', (event, data) => { 
    console.log(data);
    $( "#config_updir" ).val(data)
    pushServerDir(data)
})
function applogin(){
    var config_pw = $( "#config_pw" ).val();
    ipcRenderer.send('applogin', {'config_pw': config_pw } , () => {})
}



function loadConfig(){
    var config_pw = $( "#config_pw" ).val();
    ipcRenderer.send('loadConfig' , {'config_pw': config_pw}, () => {
        console.log(data)
    })
}

function loadPath(){
    var config_pw = $( "#config_pw" ).val();
    ipcRenderer.send('loadPath' , {'config_pw': config_pw}, () => {
        console.log(data)
    })
}

ipcRenderer.on('loadConfig', (event, data) => { 
    console.log(data);
    if(data != null){
        $( "#config_user" ).val(data.config_user)
        $( "#config_uuid" ).val(data.config_uuid)
       // $( "#config_updir" ).val(data.config_updir)
      // config_ServerDir = []
      // config_ClientDir = []

       data.config_ServerDir.forEach(element => {
            pushServerDir(element)
       });
       data.config_ClientDir.forEach(element => {
            pushClientDir(element)
       });


        var token = handshake.GenerateToken(data.config_uuid);
        console.log(token.toString());

        var newObj = {
            token: token.toString(), 
        ip: "192.168.178.23",
        key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr4MdqPlGn0lj27aAOnMV\
        JAxZUrEEVQeCn+Jtn/WsSNnnc51DJIFxv4vP8mn76C91W0iMRLEhSf/3CBQNEwH0\
        n+TXwAc91Ia7Gx/uCmuOq6TGfm/es0NhES2WvE42XwvbxtX7Vv8gsdCeXoGG6oJo\
        6ivQbcjhcEjNouEAWB1sl8rd9iYnqD4VOld+zPwEaghoTo+NRXCEEmZViK5ZwmqX\
        gJVB/+ahWC14YuTejdgIPQdbyy39QviYej4QY3rubSc6pSJwyGovqsrlCJZoDFHf\
        c+bv3LrEJTvRoQq1z9Ox/ySU1wAhaoD/9QxNn1655zWg9Uo1+YmSR8EogP7W+TzW\
        MQIDAQAB"
        }


        qrcode.makeCode(JSON.stringify(newObj));

        var de = handshake.DecryptToken(data.config_uuid, token); 
        console.log(de.toString());
    }
})



/**
 * Return false if data and filter are equal tetstå
 * @param data {array} 
 * @param filter {array}
 * @returns boolean {boolean}
 */
function isCorrect(data, filter){
    for (let index = 0; index < data.length; index++) {
        const dataelement = data[index];
        for (let idex = 0; idex < filter.length; idex++) {
            const filterelement = filter[idex];
            if(dataelement == filterelement){
                console.log("isNotCorrect");
                console.log("data element" + dataelement);
                console.log("filter element" + filterelement);
                return false;
            }
        }
    }
    return true;
}


