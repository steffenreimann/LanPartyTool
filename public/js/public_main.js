  const electron = require('electron');
    const {ipcRenderer} = electron;
    const ul = document.querySelector('ul');


    ipcRenderer.on('item:add', function(e, item){
      ul.className = 'collection';
      const li = document.createElement('li');
      li.className = 'collection-item';
      const itemText = document.createTextNode(item);

      li.appendChild(itemText);
      ul.appendChild(li);
    });

    ipcRenderer.on('item:clear', function(){
      ul.className = '';
      ul.innerHTML = '';
    });

   // ul.addEventListener('dblclick', removeItem);
  
      
    function removeItem(e){
      console.log('hallo');
    }
$( "#openfile" ).click(function() {
      console.log('open');
      open('file');
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