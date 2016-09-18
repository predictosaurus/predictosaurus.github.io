

function Query(userID) {
    
  if ("WebSocket" in window){
      console.log("WebSocket is supported by your Browser!");

       // Let us open a web socket
       var ws = new WebSocket("ws://localhost:3141");

       ws.onopen = function(){
           // Web Socket is connected, send data using send()
           query='query '+userID;
           ws.send(query);
           console.log("Message is sent..."+query);
       };
    
      //create datatable
      data=[[]]
      data[0]=["course id","interest","difficulty","time"];

      ws.onmessage = function (evt){
          
          var pkt = evt.data;
          
          if (pkt!="done"){
                // pkt="6.0001 5 5 9"
               r=pkt.split(" ");//split the received packet by spaces into an array
              
              //it would be nice to loop
              r[0]=r[0];
               r[1]=parseInt(r[1]);
               r[2]=parseInt(r[2]);
               r[3]=parseInt(r[3]);
              
               data.push([]);//append row to datatable
              data[data.length-1]=r;
               console.log("Message is received..."+r.toString());
          }
          else{
                console.log("DONE!");
                ws.close();
              
                google.charts.load('current', {'packages':['table','controls']});
                google.charts.setOnLoadCallback(drawTable);

                //start creating datatable
                function drawTable() {

                    data=google.visualization.arrayToDataTable(data);

                    /*var table = new google.visualization.Table(document.getElementById('table'));

                    //specify table properties
                    options={showRowNumber: true, width: '600px', height: '100%'}
                    table.draw(data, options);  
                    */
                    
                    var wrapper = new google.visualization.ChartWrapper({
                        "containerId": "table",
                        "chartType": "Table",
                        "options": {
                            showRowNumber: true,
                            'width': '600px',
                            'height': '100%',
                        }
                    });
                    
                    //sliders
                    
                    var cw = new google.visualization.ControlWrapper({
                        'controlType': 'NumberRangeFilter',
                        'containerId': 'sl',
                        'options': {'filterColumnIndex':1,ui:{label:'Interest:\xA0\xA0\xA0\xA0\xA0\xA0'}}
                    });
                    var cw2 = new google.visualization.ControlWrapper({
                        'controlType': 'NumberRangeFilter',
                        'containerId': 'sl2',
                        options:{filterColumnIndex:2,ui:{label:'Difficulty:\xA0\xA0\xA0',allowTyping:false}}
                    });
                    var cw3 = new google.visualization.ControlWrapper({
                        'controlType': 'NumberRangeFilter',
                        'containerId': 'sl3',
                        options:{filterColumnIndex:3,ui:{label:'Time:\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0',allowTyping:false}}
                    });
                    
                    //dashboard
                    var dashboard = new google.visualization.Dashboard(document.getElementById('dash'));
                    dashboard.bind([cw, cw2,cw3],wrapper);
                    dashboard.draw(data);
                }
              
              
          }//end else
          
       };
    
       ws.onclose = function(){ 
          // websocket is closed.
          console.log("Connection is closed..."); 
       };
        

  }//end if WebSocket

    else{
       // The browser doesn't support WebSocket
       alert("WebSocket NOT supported by your Browser!");
    }


}//end function Test Websocket