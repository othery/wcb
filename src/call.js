var https = require('https');
 
/**
 * HOW TO Make an HTTP Call - GET
 */

 
const getInfo = (who, callback) => {

// options for GET
var optionsget = {
    host : 'fr.wikipedia.org', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/w/api.php?action=opensearch&limit=2&namespace=0&format=json&search=', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

// do a POST request
// create the JSON object
var jsonObject = JSON.stringify({
    "message" : "The web of things is approaching, let do some tests to be ready!",
    "name" : "Test message posted with node.js",
    "caption" : "Some tests with node.js",
    "link" : "http://www.youscada.com",
    "description" : "this is a description",
    "picture" : "http://youscada.com/wp-content/uploads/2012/05/logo2.png",
    "actions" : [ {
        "name" : "youSCADA",
        "link" : "http://www.youscada.com"
    } ]
});
 
// prepare the header
var postheaders = {
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
};

optionsget.path += escape(who);
 
//console.log('Options prepared:');
//console.info(optionsget);
//console.info('Do the GET call');
//console.info(callback);
 
// do the GET request
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);
// API Rest https://en.wikipedia.org/api/rest_v1/page/title/Jean_Dujardin
// console.info(callback);

    res.on('data', function(d) {
// console.info(callback);

 //       console.info('GET result:\n'+ d);
        var o = JSON.parse(d);
        
 //       console.info(o[0] + '\n');
 //       console.info(o[1] + '\n');
 //       console.info(o[2] + '\n');
 //       console.info('who' + who + '\n');
      var choose = 0;
      if(o[1].length < 2) {
        callback(o[0], null, null, null, 0.0);
      } else {
        if (o[2][0].length < 100) {
            choose = 1;
        }
        var stringSimilarity = require('string-similarity');
        var confidence = stringSimilarity.compareTwoStrings(o[0], o[1][choose]);
        callback(o[0], o[1][choose], o[2][choose], o[3][choose], confidence)
//        process.stdout.write(d);
//        console.info('\n\nCall completed');
  }
    });
 
});
 
reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
}
                                   
module.exports = getInfo
 

