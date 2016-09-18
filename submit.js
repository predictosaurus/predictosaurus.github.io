



function Submit(user,course,interest,diff,time) {
    
  if ("WebSocket" in window){
      console.log("WebSocket is supported by your Browser!");

       // Let us open a web socket
       var ws = new WebSocket("ws://localhost:3141");

       ws.onopen = function(){
           // Web Socket is connected, send data using send()
           packet="submit "+user+" "+course+" "+interest+" "+diff+" "+time;
           ws.send(packet);
           console.log("Message is sent..."+packet);
           ws.close();
       };

       ws.onclose = function(){ 
          // websocket is closed.
          console.log("Connection is closed..."); 
       };   

  }//end if WebSocket

    else{
       // The browser doesn't support WebSocket
       console.log("WebSocket NOT supported by your Browser!");
    }


}//end function Test Websocket