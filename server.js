var fs = require('fs') // file system
,http = require('http'),
socketio = require('socket.io'),
url = require("url"), 
SerialPort = require("serialport").SerialPort

var socketServer;
var serialPort;
var portName = '/dev/cu.usbmodem621'; //change this to your Arduino port if it is not COM5
var sendData;
var ldr1, ldr2, ldr3, ldr4 = "";

// template server code
// handle contains locations to browse to (vote and poll); pathnames.
function startServer(route,handle,debug)
{
	// on request event
	function onRequest(request, response) {
	  // parse the requested url into pathname. pathname will be compared
	  // in route.js to handle (var content), if it matches the a page will 
	  // come up. Otherwise a 404 will be given. 
	  var pathname = url.parse(request.url).pathname; 
	  console.log("Request for " + pathname + " received");
	  var content = route(handle,pathname,response,request,debug);
	}
	// make sure your website is: http://localhost:1337/ 
	var httpServer = http.createServer(onRequest).listen(1337, function(){
		console.log("Listening at: http://localhost:1337");
		console.log("Server is up");
	}); 
	serialListener(debug);
	initSocketIO(httpServer,debug);
}

function initSocketIO(httpServer,debug)
{
	socketServer = socketio.listen(httpServer);
	if(debug == false){
		socketServer.set('log level', 1); // socket IO debug off
	}

	socketServer.on('connection', function (socket) {
		console.log("user connected to server");
		socket.emit('onconnection', sendData);
		socketServer.on('update', function(data) {
			socket.emit('updateData',data);


			console.log("update() = " + data);
	});

	// this will send either a 1E or 0E back to the arduino board through the socket connection - the E is used so we know when the communication "ends"
	// you create a listner for buttonval and when the browser sends the message this function will write the data to Arduino
	socket.on('buttonval', function(data) {

		serialPort.write(data + 'E');

	});
	
	
    });
}

// Listen to serial port
function serialListener(debug)
{
    var receivedData = "";
    serialPort = new SerialPort(portName, {
        baudrate: 19200,
        // defaults for Arduino serial communication
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
    });
 
    serialPort.on("open", function () {
      console.log('open serial communication');
            // Listens to incoming data
        serialPort.on('data', function(data) {
        	
             receivedData += data.toString();
         if (receivedData .indexOf('A') >= 0 && receivedData .indexOf('a') >= 0) {
           ldr1 = receivedData .substring(receivedData .indexOf('a') + 1, receivedData .indexOf('A'));
           //console.log(sendData) //we can test to see if we are getting any input from the Arduino Board
           socketServer.emit('lightReading', {ldr1:ldr1});
         } else  if (receivedData .indexOf('B') >= 0 && receivedData .indexOf('b') >= 0) {
           ldr2 = receivedData .substring(receivedData .indexOf('b') + 1, receivedData .indexOf('B'));
           //console.log(sendData) //we can test to see if we are getting any input from the Arduino Board
          socketServer.emit('lightReading', {ldr2:ldr2});
         } else if (receivedData .indexOf('C') >= 0 && receivedData .indexOf('c') >= 0) {
           ldr3 = receivedData .substring(receivedData .indexOf('c') + 1, receivedData .indexOf('C'));
           //console.log(sendData) //we can test to see if we are getting any input from the Arduino Board
           socketServer.emit('lightReading', {ldr3:ldr3});
         } else if (receivedData .indexOf('D') >= 0 && receivedData .indexOf('d') >= 0) {
           ldr4 = receivedData .substring(receivedData .indexOf('d') + 1, receivedData .indexOf('D'));
           //console.log(sendData) //we can test to see if we are getting any input from the Arduino Board
           socketServer.emit('lightReading', {ldr4:ldr4});
         }
        
            receivedData = '';
         
         // send the incoming data to browser with websockets.
       
      });  

    });  
}

exports.start = startServer;