var http = require('http');

/**
 * Make a call to local cbp
 */


const getRDV = (where, callback) => {

    // options for GET
    var optionsget = {
        host: '127.0.0.1', // here only the domain name
        // (no http/https !)
        port: 80,
        path: '/cbp/?q=', // the rest of the url with parameters if needed
        method: 'GET' // do GET
    };



    optionsget.path += escape(where);

    console.log('Options prepared:');
    console.info(optionsget);
    //console.info('Do the GET call');
    //console.info(callback);

    // do the GET request
    var reqGet = http.request(optionsget, function(res) {
        console.log("statusCode: ", res.statusCode, "\n");
        // uncomment it for header details
        //  console.log("headers: ", res.headers);
        // API Rest https://en.wiki pedia.org/api/rest_v1/page/title/Jean_Dujardin
        // console.info(callback);      var resBody = '';
        var resBody = '';
        // Listen for data and add
        res.on('data', function(chunk) {
            resBody += chunk
        });

        res.on('end', function() {
            // console.info(callback);

                   console.info('GET result:\n');
            var o = JSON.parse(resBody);
                   console.info(where, o);
             callback(where, o);


    });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
}

module.exports = getRDV