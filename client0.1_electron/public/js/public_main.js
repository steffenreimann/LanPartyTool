const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');
const saltRounds = 10;

    
ipcRenderer.on('selectedFiles', function(e, data){
    console.log(data);
    $( "#out" ).val(data.path);
});

ipcRenderer.on('progrss', function(e, data){
    console.log(data);
    $( "#out" ).val(data.path);
});

ipcRenderer.on('clientValid', function(e, data){
    console.log(data);
    
});
ipcRenderer.on('list', function(e, data){
    console.log(data);
    serverList(data)
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

function serverList(data) {
    var fileOut = ""
    var out = ""
    data.forEach(element => {
        element.loadable.forEach(file => {
            var filetyp = "insert_drive_file"
            if(file.isDir){
                filetyp = "folder"
            }
            fileOut += `<tr>
                            <td data-title=""><i class="material-icons pmd-sm pmd-accordion-icon-left">${filetyp}</i></td>
                            <td data-title="Name">${file.filename}</td>
                            
                            <td data-title="Größe">${file.size}</td>
                            
                            <td data-title="Download"> <i onclick="DFFS(${element.server},'${file.filename}');" class="c material-icons pmd-sm pmd-accordion-icon-left">file_download</i></td>

                        </tr>`
        });

        out += `<div class="panel panel-info"> 
            <div class="panel-heading" role="tab" id="heading${element.server}">
                <h4 class="panel-title">
                    <a  data-toggle="collapse" data-parent="#accordion${element.server}" href="#collapse${element.server}" aria-expanded="false" aria-controls="collapse${element.server}"  data-expandable="false">
                        <i class="material-icons pmd-sm pmd-accordion-icon-left">cloud</i> 
                         ${element.name} -- ${element.host}
                        <i onclick="tcpdisconnect(${element.server})" class="material-icons pmd-sm pmd-accordion-icon-right">block</i> 
                    </a>
                </h4>
            </div>
            <div id="collapse${element.server}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading${element.server}">
                    <!-- Striped table -->
                        <div class="pmd-card pmd-z-depth">
                            <div class="table-responsive">
                                <!-- Table -->
                                <table class="table pmd-table table-striped table-mc-red">
                                <thead>
                                    <tr>
                                    <th>Art</th>
                                    <th>Name</th>
                                    
                                    <th>Größe</th>
                                    <th>Download</th>
                                    </tr>
                                </thead>
                                <tbody>	
                                    ${fileOut}
                                </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                
            </div>
        </div>`
        fileOut = ""
    });

    $("#servers").html(out)
    
    out = ""
}


  
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
$( "#download" ).click(function() {

    console.log('download');
    
    
    //tmp dir nutzen !!

    ipcRenderer.send('downloadfile', {'path': 'path', 'file': 'test.zip','server': 0 } , () => { 
        console.log("Event sent to nodejs"); 
    })
  });

$( "#tcpconnect" ).click(function() {
    console.log('tcpconnect');
    var ip = $( "#tcpconnectip" ).val();
    var name = $( "#tcpconnectname" ).val();
    console.log(ip)
    ipcRenderer.send('tcpconnect', {ip: ip, name: name }, () => { 
        console.log("Event sent."); 
    })
  });

$( "#tcpserver" ).click(function() {
    console.log('tcp server');
    ipcRenderer.send('tcpstartServer' , () => { 
        console.log("Event sent."); 
    })
  });
$( "#list" ).click(function() {
    console.log('tcp server');
    ipcRenderer.send('list' , () => { 
        console.log("Event sent."); 
    })
  });
 

function DFFS(server, file) {
    ipcRenderer.send('downloadfile', {'path': 'path', 'file': file,'server': server } , () => { 
        console.log("Event sent to nodejs"); 
    })
}
  
function tcpdisconnect(server) {
    
    ipcRenderer.send('tcpdisconnect', server , () => { 
        console.log("Event sent to nodejs"); 
    })
}
      
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


