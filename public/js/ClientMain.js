const electron = require('electron');
const {ipcRenderer} = electron;
var config = require('./../config.json');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
var hashed = "";

/*
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});
const text = 'Hello RSA!';
const encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);
const decrypted = key.decrypt(encrypted, 'utf8');
console.log('decrypted: ', decrypted);
console.log('key: ', key.keyPair);
*/


var item = {
  "username": "",
  "password": "hmmea",
  "id": "0001",
  "server": {
	  "ip": "192.168.178.32",
	  "port": "8888"
  },
  "printer": {
    "standard": "",
    "all": []
  },
  "virtual_printer": {
	  "ip": "192.168.178.122",
	  "port": "3434"
  },
  "allow": {
	  "print_from_ext": true,
	  "print_to_ext": false
  }
}


function writeInput(data) {
	
	//server
	$( "#s_ip" ).val(data.server.ip);
	$( "#s_port" ).val(data.server.port);
	$( "#s_printer" ).val(data.server.printer);
	$( "#s_start" ).prop('checked', data.server.start);
	
	//ext_server
	$( "#se_ip" ).val(data.ext_server.ip);
	$( "#se_port" ).val(data.ext_server.port);
	$( "#se_name" ).val(data.ext_server.name);
	$( "#s_printer" ).val(data.ext_server.printer);
	$( "#se_start" ).prop('checked', data.ext_server.start);
	
	$( "#username" ).val(data.username);
	$( "#pw" ).val(data.password);
	//$( "#username" ).val(data.username);
	
	$( "#ap_e2i" ).val(data.allow.print_from_ext);
	$( "#ap_i2e" ).val(data.allow.print_to_ext);
}


function safe() {
	//Hashing eines Passwords 
	var pwsafe = $( "#pw" ).val();
	
	if(pwsafe != "" && pwsafe.length > 7) {
		bcrypt.hash( pwsafe , saltRounds, function(err, hash) {
		  // Store hash in your password DB.
		  	hashed = hash;
		  	console.log("Das Password ist = " , pwsafe.length , "lang.  Aus '" , pwsafe , "' wurde =" , hashed);
		  	item.username = $( "#username" ).val();
		  	item.password = hashed;
			ipcRenderer.send('config:safe', item);
		});
	}else if(pwsafe.length < 7){
		console.log("Das Passwort muss 8 Zeichen lang sein!", pwsafe.length);
	}
}




console.log(config);

writeInput(config)



//Vergleich zweier passwörter
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hashed, function(err, res) {
    // res == true
    console.log("Check Richtiges PW ", res);
});
bcrypt.compare(someOtherPlaintextPassword, hashed, function(err, res) {
    // res == false
    console.log("Check falsches PW ", res);
});