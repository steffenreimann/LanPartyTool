function mergee(data) {
    const {dialog} = require('electron') 
    const fs = require('fs') 
	var t_start, t_end;
	t_start = new Date().getTime();
	console.log('Merge with ' + data.names[0]);
	console.log('Name Megre ' + data.name);
	
    dialog.showSaveDialog({ nameFieldLabel: data.name, title: data.name, filters: [

     { defaultPath: data.path, name: data.typ, extensions: [data.typ], buttonLabel: "Merge"  }

    ]}, function (fileName) {

    if (fileName === undefined) return;
        console.log(fileName)
        splitFile.mergeFiles(data.names, fileName)
  		.then(() => {
  		console.log('Done!');
  		t_end = new Date().getTime();
        console.log(t_end - t_start + 'ms');
        })
        .catch((err) => {
            console.log('Error: ', err);
        });

  }); 
    
  }

 var mergee = function(data, callback) {
     
     
     console.log("Merge Data = " + data[0]);
     
     
      const testFolder = './';
const testFile = 'TestOrdner.zip';

var names = [];


function listNames(Dir, path) {
	var pathres = path.split('-');
	console.log(pathres[0]); 
	console.log(pathres[1]); 
	if(pathres[1] == undefined){
		pathres[0] += '.sf';
		//pathres[1] = 'part1';
		console.log(pathres[0]);
	}
	fs.readdir(Dir, (err, files) => {
		files.forEach(file => {
			
			//console.log(file); 
			fileres = file.split('-');
			//console.log(fileres[0]);
			if(pathres[0] == fileres[0]) {
		    	console.log('Push ',file,' in names')
		    	names.push(file)
	    	}
	  });
	  mergee(names);
	})
	
}

/*
var t_start, t_end;
t_start = new Date().getTime();
// Code, dessen Ausführungszeit wir messen wollen
t_end = new Date().getTime();
alert(t_end - t_start);
*/
//listNames(testFolder, '5gbtest.zip')
     
   
 }