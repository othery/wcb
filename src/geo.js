// JavaScript Document

var StaticMaps = require('staticmaps');
var Jimp = require('jimp');

export const geo = (request, response, callback) => {
var options = {
  width: 350,
  height: 270
};
var map = new StaticMaps(options);

var marker = {
  img: __dirname + '/marker.png', // can also be a URL 
  offsetX: 15,
  offsetY: 51,
  width: 30,
  height: 51
};
 
var marker1 = {
  img: __dirname + '/marker1.png', // can also be a URL 
  offsetX: 15,
  offsetY: 51,
  width: 30,
  height: 51
};
 
var marker2 = {
  img: __dirname + '/marker2.png', // can also be a URL 
  offsetX: 10,
  offsetY: 34,
  width: 20,
  height: 34
};

 
var marker3 = {
  img: __dirname + '/marker3.png', // can also be a URL 
  offsetX: 10,
  offsetY: 34,
  width: 20,
  height: 34
};

 
var marker4 = {
  img: __dirname + '/marker4.png', // can also be a URL 
  offsetX: 10,
  offsetY: 34,
  width: 20,
  height: 34
};

 console.info(request.query)
var x = request.query["x"] ? parseFloat(request.query["x"]) : 1.3;
var y = request.query["y"] ? parseFloat(request.query["y"]) : 44.3;
  console.info("x " + x + " y " +y)
if(request.query["x"]) {
marker.coord = [x,y];
map.addMarker(marker);
}
if(request.query["mx1"] && request.query["my1"]) {
marker1.coord = [parseFloat(request.query.mx1),parseFloat(request.query.my1)];
map.addMarker(marker1);
}


if(request.query["mx2"] && request.query["my2"]) {
marker2.coord = [parseFloat(request.query.mx2),parseFloat(request.query.my2)];
map.addMarker(marker2);
}

if(request.query["mx3"] && request.query["my3"]) {
marker3.coord = [parseFloat(request.query.mx3),parseFloat(request.query.my3)];
map.addMarker(marker3);
}


if(request.query["mx4"] && request.query["my4"] && null) {
marker4.coord = [parseFloat(request.query.mx4),parseFloat(request.query.my4)];
map.addMarker(marker4);
}


map.render()
  .then(function(values) {
    map.image.buffer(Jimp.MIME_JPEG, function(err, buffer){
                    response.set("Content-Type", Jimp.MIME_JPEG);
                    response.send(buffer);
                });
  })
  .catch(function(err) { console.log(err); });
 }