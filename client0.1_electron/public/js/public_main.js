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

function serverList(data) {
    var fileOut = ""
    var out = ""
    data.forEach(element => {
        element.loadable.forEach(file => {
            fileOut += `<tr>
                            <td data-title="File">${file.filename}</td>
                            <td data-title="Folder">${file.isDir}</td>
                            <td data-title="Größe">${file.size}</td>
                            <td data-title="Download"><button onclick="DFFS(${element.server},'${file.filename}');" type="button" class="btn btn-primary">download</button ></td>
                        </tr>`
        });

        out += `<div class="panel panel-info"> 
            <div class="panel-heading" role="tab" id="heading${element.server}">
                <h4 class="panel-title"><a  data-toggle="collapse" data-parent="#accordion${element.server}" href="#collapse${element.server}" aria-expanded="false" aria-controls="collapseFour${element.server}"  data-expandable="false"><i class="material-icons pmd-sm pmd-accordion-icon-left">account_box</i> Server ${element.server} </a> </h4>
            </div>
            <div id="collapse${element.server}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading${element.server}">
                <div class="panel-body">
                    <!-- Striped table -->
                        <div class="pmd-card pmd-z-depth">
                            <div class="table-responsive">
                                <!-- Table -->
                                <table class="table pmd-table table-striped table-mc-red">
                                <thead>
                                    <tr>
                                    <th>File</th>
                                    <th>Folder?</th>
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
            </div>
        </div>`
    });

    $("#servers").html(out)

}

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
    console.log(ip)
    ipcRenderer.send('tcpconnect', ip , () => { 
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


