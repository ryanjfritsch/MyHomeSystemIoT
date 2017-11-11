
// Created by Ryan Fritsch
// Sensitive information replaced with '****'


var http = require('http');
var url = require('url');
var qstring = require('querystring');
var fs = require('fs');
var path = require('path');
var request = require('request');
var mysql = require('mysql');


const hostname = ********;
const port = ****;


// connect to AWS database
var connection = mysql.createConnection({
  host     : *************,
  user     : *************,
  password : *************,
  database : *************,
  port     : *************
});



connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});



//create server
const server = http.createServer((req, res) => {

  var urlObj = url.parse(req.url, true, false);





  if(req.method == "POST"){

    // POST CODE

    if(urlObj.pathname.indexOf('switchon') != -1){

        console.log("SWITCH ON");

        var switchId = urlObj.pathname.substring(10);

        console.log(switchId);

        var query = "UPDATE wifiswitches SET state = 1 WHERE id = '"+switchId+"'";

        connection.query(query, function (error, results, fields) {
            console.log()

        });


    } else if(urlObj.pathname.indexOf('switchoff') != -1){

        console.log("SWITCH OFF");

        var switchId = urlObj.pathname.substring(11);

        console.log(switchId);

        var query = "UPDATE wifiswitches SET state = 0 WHERE id = '"+switchId+"'";

        connection.query(query, function (error, results, fields) {


        });

    } else if(urlObj.pathname.indexOf('tempupdate') != -1){

        var jsonString = '';

        var updateTime = '';

        req.on('data', function (data) {
            jsonString += data;

            var d = new Date();
            var dte = d.toString().split(' ');
            var timesplit = dte[4].split(':');
            var hour = parseInt(timesplit[0]);
            var minute = timesplit[1];


            if(hour >= 12)
            {
              hour = (hour-12);
              hour = hour.toString();
              minute = minute+'pm';
            } else {
              hour = hour.toString();
              minute = minute+'am'
            }

            var upDate = dte[1] + ' ' + dte[2] + ' ' + dte[3] + ' ' + hour + ':' +minute;

            var tempObj = JSON.parse(jsonString);

            var query = "UPDATE sensors SET sensor1 = "+tempObj.temp+", sensor2 = "+tempObj.humid+", lastUpdate = '"+ upDate +"' WHERE id = '"+tempObj.id+"'";


            connection.query(query, function (error, results, fields) {

                res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
                res.end();
            });


        });

        req.on('end', function () {
            //console.log(JSON.parse(jsonString));
        });

    }

  } else { // req.method == GET

      if(urlObj.pathname == '/'){

            var d = new Date();

            var month = d.getMonth();
            var day = d.getDate();
            var year = d.getFullYear();

            var hour = d.getHours();
            var minute = d.getMinutes();

            if(minute < 10){
                minute = '0' + minute
            }

            console.log(' ')
            console.log('**   Accessed at ' + hour + ':' + minute + ' on ' + (month+1) + '/' + day + '/' + year)

               fs.readFile('********* FILE PATH ************', function (err,data) {
                 if (err) {
                   res.writeHead(404);
                   res.end(JSON.stringify(err));
                   return;
                 }

                 var htmlPage = data;

                 connection.query('SELECT * FROM wifiswitches', function (error, results, fields) {
                     var deviceCount = results.length;

                     //console.log(deviceCount+" DEVICES");

                     var endOfTable = "</tbody></table><br><br></div></body></html>";

                     for (var i = 0; i < deviceCount; i++) {
                         var tableLayout = "<tr id='devicerow"+i+"'>"+
                           "<th scope='row'>"+(i+1)+"</th>"+
                           "<td>"+results[i].name+"</td>"+
                           "<td id='id"+i+"'>"+results[i].id+"</td>";

                       if(results[i].state == 0){
                           tableLayout = tableLayout + "<td><input type='image' class='powerButton' src='images/powerOff.png' id='p"+i+"'/></td>"+
                           "</tr>";
                       } else {
                           tableLayout = tableLayout + "<td><input type='image' class='powerButton' src='images/powerOn.png' id='p"+i+"'/></td>"+
                           "</tr>";
                       }

                         htmlPage = htmlPage + tableLayout;
                     }

                     htmlPage = htmlPage + endOfTable;
                     //console.log(htmlPage);

                     connection.query('SELECT * FROM sensors', function (error, results, fields) {
                         var sensorCount = results.length;

                         var sensorTable = "<br><div class='tableTitle'>Connected Weather Sensors<div>"+
                         "<div class='row'>"+
                             "<table class='table sensorTable'>"+
                                 "<thead>"+
                                   "<tr>"+
                                     "<th>#</th>"+
                                     "<th>Name</th>"+
                                     "<th>Location</th>"+
                                     "<th>Temperature</th>"+
                                     "<th>Humidity</th>"+
                                     "<th>Last Updated</th>"+
                                   "</tr>"+
                                 "</thead>"+
                                 "<tbody>";

                                 htmlPage = htmlPage + sensorTable;

                                 for (var i = 0; i < sensorCount; i++) {
                                     var tableLayout = "<tr id='sensorrow"+i+"'>"+
                                       "<th scope='row'>"+(i+1)+"</th>"+
                                       "<td>"+results[i].name+"</td>"+
                                       "<td>"+results[i].location+"</td>"+
                                       "<td style='font-size:30px;'>"+results[i].sensor1+"&#x2109</td>"+
                                       "<td style='font-size:30px;'>"+results[i].sensor2+"%</td>"+
                                       "<td style='font-size:26px;'>"+results[i].lastUpdate+"</td>"+
                                       "</tr>";


                                     htmlPage = htmlPage + tableLayout;
                                 }

                                 htmlPage = htmlPage + endOfTable + "<br><br><br><br><center><p id='footerName'>Made by Ryan Fritsch</p></center>";


                         res.writeHead(200, {
                          'Content-Type': 'text/html',
                         });

                         res.end(htmlPage);
                     });


                 });

               });

           } else if(urlObj.pathname.indexOf('gettempdata') != -1){
               var sensorid = '';




         } else { // load files


            if(urlObj.pathname.indexOf('.html') != -1){

              fs.readFile('*********** FILE PATH ***************', function (err,data) {
                if (err) {
                  res.writeHead(404);
                  res.end(JSON.stringify(err));
                  return;
                }

                res.writeHead(200, {
                 'Content-Type': 'text/html',
                });

                res.end(data);

              });


            } else if(urlObj.pathname.indexOf('.css') != -1){

              fs.readFile('******** FILE PATH *******', function (err,data) {
                if (err) {
                  res.writeHead(404);
                  res.end(JSON.stringify(err));
                  return;
                }

                res.writeHead(200, {
                 'Content-Type': 'text/css',
                });

                res.end(data);

              });


          } else if(urlObj.pathname.indexOf('.js') != -1){

              fs.readFile('******** FILE PATH *******', function (err,data) {
                if (err) {
                  res.writeHead(404);
                  res.end(JSON.stringify(err));
                  return;
                }

                res.writeHead(200, {
                 'Content-Type': 'text/javascript',
                });

                res.end(data);

              });


            } else if(urlObj.pathname.indexOf('.jpg') != -1 || urlObj.pathname.indexOf('.png') != -1 || urlObj.pathname.indexOf('.gif') != -1 || urlObj.pathname.indexOf('.ico') != -1){

              fs.readFile('******** FILE PATH *******', function (err,data) {
                if (err) {
                  res.writeHead(404);
                  res.end(JSON.stringify(err));
                  return;
                }

                res.writeHead(200, {
                 'Content-Type': 'text/html',
                });

                res.end(data);

              });

          } else {

              fs.readFile('********* FILE PATH *********', function (err,data) {
                if (err) {
                  res.writeHead(404);
                  res.end(JSON.stringify(err));
                  return;
                }

                res.writeHead(200, {
                 'Content-Type': 'text/html',
                });

                res.end(data);
            });

          }
      }
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


process.on('uncaughtException', function (err) {

    request.post( '********* IFTTT NOTIFICATION *********',
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log('IFTTT notification triggered')
            }
        }
    );

  console.log('Caught exception: ' + err);
});



function powerButtonClicked() {

    var url = '******** IFTTT REQUEST URL *******';

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });

}
