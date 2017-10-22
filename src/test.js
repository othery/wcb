// JavaScript Document

const wiki = require('./call')

wiki("jean dujardain", function (req, selected, text, url, confidence) {
        console.info('request =' + req + '\n');
        console.info(selected + '\n');
        console.info(text + '\n');
        console.info('url:' + url + '\n');
        console.info('confidence:' + confidence + '\n');
});