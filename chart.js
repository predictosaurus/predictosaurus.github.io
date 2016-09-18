

function doMagic(){
    
    //load table Google Charts package into the webpage
    google.charts.load('current', {'packages':['table']});
    google.charts.setOnLoadCallback(drawTable);
    
    //start creating datatable
    function drawTable() {
        
        data=[[]]
        data[0]=["course id","interest","difficulty","time"];

        var pkt="6.0001 5 5 9"
        r=pkt.split(" ");//split the received packet by spaces into an array
        data.push(r);//append row to datatable
 //       console.log("pkt:"+r.toString())

        data=google.visualization.arrayToDataTable(data);
        
        var table = new google.visualization.Table(document.getElementById('table'));

        //specify table properties
        options={showRowNumber: true, width: '600px', height: '100%'}
        table.draw(data, options);
    }

}

