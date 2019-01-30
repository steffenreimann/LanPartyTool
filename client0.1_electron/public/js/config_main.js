const configHelper = require('./../config/configHelper');
const encryptAes = require('./../utils/aesEncrypt');

var qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 100,
    height : 100
});

function saveConfig() {
	//Hashing eines Passwords 
	var config_pw = $( "#config_pw" ).val();
	var config_user = $( "#config_user" ).val();
	var config_uuid = uuidv1(); // -> v1 UUID
    ipcRenderer.send('saveConfig', {'config_pw': config_pw, 'config_user': config_user, 'config_uuid': config_uuid } , () => {})
}

ipcRenderer.on('saveConfig', (event, data) => { 
    console.log(data);
    $( "#config_user" ).val(data.config_user)
    $( "#config_uuid" ).val(data.config_uuid)
    qrcode.makeCode(data.config_uuid);
})

function loadConfig(){
    var config_pw = $( "#config_pw" ).val();
    ipcRenderer.send('loadConfig', {'config_pw': config_pw } , () => {})
}

ipcRenderer.on('loadConfig', (event, data) => { 
    console.log(data);
    if(data != null){
        $( "#config_user" ).val(data.config_user)
        $( "#config_uuid" ).val(data.config_uuid)
        qrcode.makeCode(data.config_uuid);
    }
    
})

loadConfig()