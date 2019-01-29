  const electron = require('electron');
    const {ipcRenderer} = electron;
    const ul = document.querySelector('ul');
    var bcrypt = require('bcrypt');
    const saltRounds = 10;

    var hashed = "";

    ipcRenderer.on('selectedFiles', function(e, data){
        console.log(data);
        $( "#out" ).val(data.path);
    });

    ipcRenderer.on('item:clear', function(){
      ul.className = '';
      ul.innerHTML = '';
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
        if(data.show == true){
                $( data.id ).removeAttr( "disabled" )
           }else if(data.show == false){
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



var options =  { 
            onKeyPress: function(cep, event, currentField, options){
           console.log('An key was pressed!:', cep, ' event: ', event,'currentField: ', currentField, ' options: ', options);
                if(cep){
                  var ipArray = cep.split(".");
                  var lastValue = ipArray[ipArray.length-1];
                  if(lastValue !== "" && parseInt(lastValue) > 255){
                      ipArray[ipArray.length-1] =  '255';
                      var resultingValue = ipArray.join(".");
                      currentField.attr('value',resultingValue);
                  }
            }             
        }};

$('.ip_address').mask("000.000.000.000", options);



function saveConfig() {
	//Hashing eines Passwords 
	var config_pw = $( "#config_pw" ).val();
	var config_user = $( "#config_user" ).val();
	var config_uuid = $( "#config_uuid" ).val();
	
	if(config_pw != "" && config_pw.length > 7) {
		bcrypt.hash( config_pw , saltRounds, function(err, hash) {
		  // Store hash in your password DB.
			hashed = hash;
			console.log("Das Password ist = " , config_pw.length , "lang.  Aus '" , config_pw , "' wurde =" , hashed);
			//ipcRenderer.send('config:safe', item);
		});
	}else if(pwsafe.length < 7){
		console.log("Das Passwort muss 8 Zeichen lang sein!", pwsafe.length);
	}
}