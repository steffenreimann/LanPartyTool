  const electron = require('electron');
    const {ipcRenderer} = electron;
    const ul = document.querySelector('ul');
    const saltRounds = 10;

    const configHelper = require('./../config/configHelper');
    const encryptAes = require('./../utils/aesEncrypt');
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width : 100,
        height : 100
    });
    

    ipcRenderer.on('selectedFiles', function(e, data){
        console.log(data);
        $( "#out" ).val(data.path);
    });






ipcRenderer.on('DOM', function(event, data){
    
    console.log("DOM Event ID : " + data.id);
    console.log("DOM Event val : " + data.val);
    console.log("DOM Event show : " + data.show);
    if(data.val && data.id != undefined){
        $( data.id ).val(data.val)
        $( data.id ).html(data.val)
       }
    
    if(data.show != undefined){
        if(data.show){
                $( data.id ).removeAttr( "disabled" )
           }else{
               $( data.id ).attr("disabled", true);
           }
    }
    });

ipcRenderer.on('split-info', function(event, data){
    console.log("File Size : " + data);
    console.log("File time : " + data.time);
    if(data.file.size != undefined){
       $( "#size" ).val(data.size)
       }
    if(data.file.time != undefined){
       $( "#time" ).val(data.time)
       }
    
    
     
    });

    function ipcSend(){
        var ip = $( "#IpAddress" ).val();
        ipcRenderer.send('tcpconnect', ip);
    }

   // ul.addEventListener('dblclick', removeItem);
  
      
    function removeItem(e){
      console.log('hallo');
    }
$( "#openfile-merge" ).click(function() {
      ipcRenderer.send('openfile-merge', () => { 
                console.log("Event sent."); 
            })
  });    
$( "#openfile-split" ).click(function() {
      console.log('open');
      open('file');
  });
$( "#split-file" ).click(function() {
      console.log('Split');
    var path = $( "#out" ).val();
    var packSize = $( "#packsize" ).val();
    console.log(path)
    ipcRenderer.send('saveSplitFile', {'path': path, 'name': 'ka', 'packSize': packSize } , () => { 
                console.log("Event sent."); 
            })
   
    
  });

      
function open(e){
    console.log('open1');
        if(e == "file") {
            ipcRenderer.send('openFile', () => { 
                console.log("Event sent."); 
            })
           
           }else if(e == "dir") {
                    ipcRenderer.send('openDirectory', () => { 
                        console.log("Event sent."); 
                      }) 
                    }
      
    }
    
    
ipcRenderer.on('fileData', (event, data) => { 
    document.write(data) 
})

ipcRenderer.on('loadConfig', (event, data) => { 
    console.log(data);
    $( "#config_user" ).val(data.config_user)
    $( "#config_uuid" ).val(data.config_uuid)
    qrcode.makeCode(data.config_uuid);
})


function saveConfig() {
	//Hashing eines Passwords 
	var config_pw = $( "#config_pw" ).val();
	var config_user = $( "#config_user" ).val();
	var config_uuid = uuidv1(); // -> v1 UUID
    
    
    console.log(configHelper.GetUserCfg());
    ipcRenderer.send('saveConfig', {'config_pw': config_pw, 'config_user': config_user, 'config_uuid': config_uuid } , () => { 
        console.log("Event sent Save Config"); 
    })
}

function loadConfig(){
    var config_pw = $( "#config_pw" ).val();
    ipcRenderer.send('loadConfig', {'config_pw': config_pw } , () => { 
        console.log("Event sent Load Config"); 
    })
}




console.log(configHelper.GetUserCfg());






