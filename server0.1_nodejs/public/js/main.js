/**
 * Created by Steffen on 03.07.2017.
 */
var conlist = [];
var clientslist = [];
var ix = 0;
var data1 = "";
var chatme = "";
var clients = "";
var myip
var myname = "";
var ip;
var socket;
var filelist;
var chatHistory = [];
var chatHistoryI = 0;
jsondata = { ul: '<ul class=" mit">',
            li: '<li class="lgi"><h3 class="list-group-item-heading">',
            span: '</h3><span class="list-group-item-text">',
            send: '</span></li>',
            uend: '</ul>'
            }

linkdata = { a: '<a class="btn pmd-btn pmd-ripple-effect btn-primary" type="button" href="',
            link: 'http://www.deinedomain.de',
            taget: '" target="_blank" rel="noopener">',
            aend: '</a>'
            }
filedata = { a: '<a class="col-xs-6 text-center" type="button" href="',
            link: 'http://www.deinedomain.de',
            taget: '" target="_blank" rel="noopener">',
            aend: '</a>'
            }
siodata = { a: '<a class="btn pmd-btn pmd-ripple-effect btn-primary" type="button" onclick="sendIO(\'',
            link: '',
            end: '\')"',
            aend: '</a></li>'
            }

var OSName = "Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

function listdel() {
    data1 = "";
    conlist = [];
    ix = 0;
    console.log(data1 + ix);
    $('#ergebnis').html(data1);
}

var counter = 0;
    
  

console.log("LANFileChat");


$( "#x" ).keyup(function() {
  	var x = $("#x").val();
  	x = eval(x)
	$("#y").val(x)
});

// Popover Propeller.in 
$(document).ready(function(){
   // soio();
    var options = {
			placement: function(pop, dom_el){
				var range = 200; 
				var curPlacement = $(dom_el).attr("data-placement");
				var scrolled = $(window).scrollTop();
				var winWidth = $(window).width();
				var winHeight = $(window).height();
				var elWidth = $(dom_el).outerWidth();
				var elHeight = $(dom_el).outerHeight();
				var elTop =  $(dom_el).offset().top;
				var elLeft =  $(dom_el).offset().left;
				var curPosTop =  elTop - scrolled;
				var curPosLeft =  elLeft;
				var curPosRight = winWidth - curPosLeft - elWidth;
				var curPosBottom = winHeight - curPosTop - elHeight;
				if(curPlacement == "left" && curPosLeft <= range){
					return 'right';	
				}
				else if(curPlacement == "right" && curPosRight <= range){
					return 'left';	
				}
				else if(curPlacement == "top" && curPosTop <= range){
					return 'bottom';	
				}
				if(curPlacement == "bottom" && curPosBottom <= range){
					return 'top';	
				}else {
					return curPlacement;
				}
			}
		};
    $('[data-toggle="popover"]').popover(options);
});

function soio(){
    socket = io.connect();
    
    socket.emit('filelist');
   
      $("input[type=submit]").click(function(evt){
        var file = $("input[type=file]")[0].files[0];
        var extraParams = {foo: 'bar'};
        
      });
    
  
    
setInterval(function() {
  startTime = Date.now();
  socket.emit('ping');
}, 500);

socket.on('pong', function(data) {
  latency = Date.now() - startTime;
  console.log(latency);
  console.log(data);
  console.log(data.down);
});
    
    
    
    socket.on('member', function (data) {
        if(data.member === true){
            socket.emit('chatn');
            $('#login').modal("hide");
            //console.log(JSON.stringify(data));
            //list(data.name);
            //list(data.ip);
            myip = data.ip;
            ip = data.ip;
            myname = data.name;
            $("#ipchat").text(myip);
            $("#namechat").text(myname);
        }else{
        console.log(JSON.stringify(data));
        $('#login').modal("show");
        $("#OSName").val(OSName);
        $("#ip").val(data.ip);
            ip = data.ip;
            myip = data.ip;
        }
        
    });
    
    socket.on('chat', function (data) {
        if(myname != "") {
            console.log("Chat = " + data.text);
            list(data.text, data.name, data.ip)
        }
    }); 
    
    socket.on('filelist', function (data) {
        console.log("data = " + data);
        var file_d = "";
        var filelist = [];
        $('#files').html("");
        for (var i=0; i<data.length; i++) {
            if(data[i] != '.DS_Store'){
               console.log(data[i]);
                file_d += filedata.a
                file_d += 'download/'
                file_d += ip
                file_d += '/' + data[i]
                file_d += filedata.taget
                file_d += data[i]
                file_d += filedata.aend
                console.log(file_d);
                filelist.push(file_d);
                file_d = "";
               }
        }   
        $('#files').html(filelist);
         filelist = [];
    }); 
    
    socket.on('chatn', function (data) {
        $('#chatw').html("");
        console.log(JSON.stringify(data));
        for(var i = 0; i <= data.length - 1; i++){
            console.log(data[i]);
            ll = data[i]
            list(ll.text, ll.name, ll.ip)
        }
        //console.log(data.length);
    });
    
    socket.on('analyticData', function (data) {
        console.log(JSON.stringify(data));
    });
    
    socket.on('users', function (data) {
        //$('#chatw').html("");
        var i = 0
        clientslist = []
    $('#clients').html("");
        //console.log(JSON.stringify(data));
        for(var i; i <= data.length - 1; i++){
            console.log("Client " + i + " = " + JSON.stringify(data[i]));
            loadip(data[i])
        }
        //console.log(data.length);
    });
       
}

document.getElementById('chat').addEventListener ('keydown', function (e) {
    if (event.which == 13) {
        text = $("#chat").val()
        chat(text)
        $("#chat").val("")
        
        if(text != "" && chatHistory[chatHistoryI] != text){
            chatHistory.push(text)
            chatHistoryI = chatHistoryI + 1
        }
        
    }
    if(e.keyCode == 40){
        if(chatHistoryI + 1 <= chatHistory.length){
            chatHistoryI = chatHistoryI + 1   
        }  
        $("#chat").val(chatHistory[chatHistoryI])
    }
    if(e.keyCode == 38) {
        if(chatHistoryI - 1 >= 0){
            chatHistoryI = chatHistoryI - 1   
        }
        $("#chat").val(chatHistory[chatHistoryI])  
    }
});

function chat(data) {
    console.log("Chat = " + data);
    //list(data, myname, myip)
    
    if(data === "!stats"){
            socket.emit('analyticData');
       }else{
           
           socket.emit('chat', { name: myname, ip: myip, text: data });
           
       }
    
    
    
}

function list(data, name, ip){
    
    ix++
    chatme += jsondata.ul;
    chatme += jsondata.li;
    chatme += data;
    chatme += jsondata.span;
    chatme += name + " / " + ip;
    chatme += jsondata.send;
    chatme += jsondata.uend;
    
    conlist.push(chatme);
    $('#chatw').html(conlist);
    chatme = "";
    scrolldown();
}

function scrolldown() {
    checkbox = $('#scrollcheck:checked').val();
    console.log(checkbox);
    if (checkbox === "on") {
        var elem = document.getElementById('chatw');
        //elem.scrollTop = elem.scrollHeight;
       $([document.documentElement, document.body]).animate({
        scrollTop: elem.scrollHeight
    }, 0);

    }
}

function anhang() {
    var linka = "";

    var linktext = $("#linktext").val();
    var link = $("#verbindung").val();
    console.log(linktext);
    console.log(link);
    if(linktext != "" && link != ""){
        linka += linkdata.a
        linka += link
        linka += linkdata.taget
        linka += linktext
        linka += linkdata.aend
        chat(linka)
        
        console.log("nur link anhang");
       
    }else{
        console.log("Fehlerhafte Eingabe")
    }
}

function listuser() {
    
    $('#alluser').modal("show");
    socket.emit('user');
   
}

function loadip(data) {
    console.log("Rein geballert");
            clients += jsondata.ul
            clients += jsondata.li
            clients += data.name + " " + data.ip
            clients += jsondata.span
            clients += data.OSName
            clients += jsondata.send
            clients += jsondata.uend
            clientslist.push(clients);
            $('#clients').html(clientslist);
    clients = ""
}

function shutdown(){
    socket.emit('shutdown');
}

function sendIO(data){
    socket.emit('download', data);
}

 /**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the paramiters to add to the url
 * @param {string} [method=post] the method to use on the form
 */


function submit(path){
     var filein = $("input[type=file]")[0].files[0];
    post(path, filein);
    
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    //form.setAttribute("href", "/upload/Test_ID_00001/test.zip");
    form.setAttribute("action", path);
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("target", "_blank");
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
    console.log('Submit');
}


function changeMode() {
    var modecheck = $('#modecheck:checked').val();
    
    if(modecheck == "on"){
        //$('.h').css('background-color', '#80cbc4').css('color','red');
        document.getElementsByTagName("body")[0].style.backgroundColor = "#15323E";
    }else{
        //$('.h').css('background-color', '#80cbc4').css('color','red');
        document.getElementsByTagName("body")[0].style.backgroundColor = "#14373D";
    }
    
    
}

function memberlog() {
    console.log("memberlog");
    var name = $('#name').val();
    console.log("name");
    socket.emit('member', { name: name, ip: ip, OSName: OSName, rw: "w" });
}  

function connectSIO(data){
    //var ipsioserver = $('#ipsioserver').val();
    soio(data)
    //memberlog()
}

//list("Halllo Halllo erster test", "Steffen", "192.168.0.22")
connectSIO()
changeMode()