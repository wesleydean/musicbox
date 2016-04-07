var serialport = require('serialport'); //  make sure you install the library - npm install serialport
var portName = '/dev/cu.usbmodem411'; // make sure to change this to the name of your port.
var sp = new serialport.SerialPort(portName, {
    baudRate: 9600, 
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});

sp.on('data', function(input) {
    console.log(input);
    console.log(port.comName);
});

