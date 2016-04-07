// this code has been mondified from the original created by Bangon Kali and others for educational purposes.

// LED vars 
const int ledPin = 13;

// LED read vars
String inputString = "";         // a string to hold incoming data
boolean toggleComplete = false;  // whether the string is complete

// Potmeter vars
const int analogInPin = 0;
int sensorValue = 0;        // value read from the potmeter
int prevValue = 0;          // previous value from the potmeter

void setup() {
  // initialize serial:
  Serial.begin(9600);
  // init LED
  pinMode(ledPin,OUTPUT);
  digitalWrite(ledPin,0);

}

void loop() {
   // Recieve data from Node and write it to a String
   while (Serial.available() && toggleComplete == false) {
    char inChar = (char)Serial.read(); // convert incoming byte to a character
    if(inChar == 'E'){ // end character for led
     toggleComplete = true;
    }
    else{
      inputString += inChar; 
    }
  }
  // Toggle LED 13
  if(!Serial.available() && toggleComplete == true)
  {
    // convert String to int. 
    int recievedVal = stringToInt();
    
    digitalWrite(ledPin,recievedVal);
       
    toggleComplete = false;
  }
 
    // Potmeter
     sensorValue = analogRead(analogInPin);   
    // read the analog in value:
    if(prevValue != sensorValue){
      
  // map the value between 0 to 90 :
  int val = map(sensorValue,0,1023,0,100); // note the map function  
  // print out the value :
  Serial.print("B");
  Serial.print(val);
  Serial.print("E");
      prevValue = sensorValue;
    }  
  delay(100); // give the Arduino some breathing room.
}

int stringToInt()
{
    char charHolder[inputString.length()+1];
    inputString.toCharArray(charHolder,inputString.length()+1);
    inputString = "";
    int _recievedVal = atoi(charHolder);
    return _recievedVal;
}
