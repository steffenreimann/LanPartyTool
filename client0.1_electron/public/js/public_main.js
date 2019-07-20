const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');
const saltRounds = 10;

    
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


//ul.addEventListener('dblclick', removeItem);
  
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

  
$( "#upload" ).click(function() {
    console.log('upload');
    var path = $( "#out" ).val();
    console.log(path)

    ipcRenderer.send('uploadfile', path , () => { 
        console.log("Event sent to nodejs"); 
    })
  });

$( "#tcpconnect" ).click(function() {
    console.log('tcpconnect');
    var ip = $( "#tcpconnectip" ).val();
    console.log(ip)
    ipcRenderer.send('tcpconnect', ip , () => { 
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


