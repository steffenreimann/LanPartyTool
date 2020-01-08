const handshake = require('./../handshake/handshakeHelper');

var qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 400,
    height : 400
});

var config_ServerDir = [];
var config_ClientDir = [];
var html_config_ServerDir = ``;
var html_config_ClientDir = ``;
var config_data = {}
function saveConfig() {
	//Hashing eines Passwords 
	var config_pw = $( "#config_pw" ).val();
	var config_user = $( "#config_user" ).val();
	//var config_serverDir = $( "#config_serverDir" ).val();
	//var config_ClientDir = $( "#config_ClientDir" ).val();
    //var config_uuid = uuidv1(); // -> v1 UUID
    if(isCorrect([config_pw, config_user],["","0"])){
        var data = {config_pw: config_pw, config_user: config_user, config_uuid: null, config_ServerDir: config_data.config_ServerDir, config_ClientDir: config_data.config_ClientDir }
        console.log(data);
        ipcRenderer.send('saveConfig', data , () => {})
    }else{
        console.log("isNotCorrect");
    }
    
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
    //pushServerDir(data)

    if (data.type == "server") {
        pushServerDir(data.selected)
        config_data.config_ServerDir.push(data.selected);
    }
    if (data.type == "client") {
        pushClientDir(data.selected)
        config_data.config_ClientDir.push(data.selected);
    }
  

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

function loadPath(type, dir, title, button){

    if(button == undefined){
        button = "Open"
    }
    if(title == undefined){
        title = "LanTool File Open"
    }
    if(dir == undefined){
        dir = "/"
    }
    if(type == undefined){
        type = ""
    }

    let options = {
		// See place holder 1 in above image
		title : title, 
		// See place holder 2 in above image
		defaultPath : dir,
		// See place holder 3 in above image
		buttonLabel : button,
		// See place holder 4 in above image
		filters :[
		 {name: 'Images', extensions: ['jpg', 'png', 'gif']},
		 {name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
		 {name: 'Custom File Type', extensions: ['as']},
		 {name: 'All Files', extensions: ['*']}
		],
		properties: ['openDirectory']
	   }
    var config_pw = $( "#config_pw" ).val();
    ipcRenderer.send('loadPath' , {type: type, options: options}, () => {
        console.log(data)
    })
}





ipcRenderer.on('loadConfig', (event, data) => { 
    console.log(data);
    if(data != null){
        renderConfig(data)
       // $( "#config_updir" ).val(data.config_updir)
      // config_ServerDir = []
      // config_ClientDir = []

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

var renderLengServer = 0
var renderLengClient = 0

function renderConfig(data) {
    console.log('renderConfig');
        html_config_ServerDir = ``;
        html_config_ClientDir = ``;
         renderLengServer = 0
         renderLengClient = 0
        $("#config_ClientDir").html(html_config_ClientDir)
        $("#config_ServerDir").html(html_config_ServerDir)
        if(data != null){
            config_data = data
        }else{
            //config_data.config_ServerDir = []
            //config_data.config_ClientDir = []
        }


        $( "#config_user" ).val(config_data.config_user)
        $( "#config_uuid" ).val(config_data.config_uuid)
        config_data.config_ServerDir.forEach(element => {
            pushServerDir(element)
       });

       config_data.config_ClientDir.forEach(element => {
            pushClientDir(element)
       });
}


function pushClientDir(dir) {
   
    renderLengClient++
    if(dir == ""){
        dir = $( id ).val();
    }else{
        //config_data.config_ClientDir.push(dir);
        html_config_ClientDir += `<tr >
            <td data-title="Art"><i  class="material-icons pmd-sm pmd-accordion-icon-left">folder</i></td>
            
            <td onclick="loadPath('${dir}')" data-title="IP">${dir}</td>
            <td onclick="delPath('${renderLengServer}', 'client')" style="color: red;" data-title="Löschen" class="material-icons pmd-sm pmd-accordion-icon-right c pmd-ripple-effect">remove_circle_outline</i></td>
            </tr>`
    $("#config_ClientDir").html(html_config_ClientDir)
    
    }
   
}
function pushServerDir(dir) {
    renderLengServer++

    if(dir == ""){
        console.log("config_ServerDir null");
    }else{
        console.log("config_ServerDir");
        console.log(dir);
       // config_data.config_ServerDir.push(dir);
        html_config_ServerDir += `<tr >
            <td data-title="Art"><i  class="material-icons pmd-sm pmd-accordion-icon-left">folder_shared</i></td>
            
            <td onclick="loadPath('${dir}')" data-title="IP">${dir}</td>
            <td onclick="delPath('${renderLengServer}', 'server')" style="color: red;" data-title="Löschen" class="material-icons pmd-sm pmd-accordion-icon-right c pmd-ripple-effect">remove_circle_outline</i></td>
            </tr>`
    
    }
    console.log(config_data.config_ServerDir);
    $("#config_ServerDir").html(html_config_ServerDir)
}


function delPath(params, type) {
    console.log('delPath');
    console.log(params);
    console.log(type);
    if(type == 'server'){
        config_data.config_ServerDir.splice(params -1, 1);
    }
    if(type == 'client'){
        config_data.config_ClientDir.splice(params -1, 1);
    }
    renderConfig();
}

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


