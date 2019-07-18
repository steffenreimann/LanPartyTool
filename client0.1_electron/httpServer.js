var http = require("http");
var port = 3000;
var serverUrl = "localhost";

var connections = [];
var server = http.createServer(function(req, res) {

  console.log("Request: " + req.url);

  var now = new Date();
  var html = "<p>Hello World, the time is " + now + ".</p>";
  res.end(html);
  closeServer()                      
  
});

server.on("connection", function(con) { 
  connections.push(con);                
});                                    

console.log("Listening at " + serverUrl + ":" + port);
server.listen(port, serverUrl);

function closeServer(){
  connections.forEach(function(con) {   
      con.destroy();                    
  });                                
  server.close(); 
}
