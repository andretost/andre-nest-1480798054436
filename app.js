/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var nest = require('nest-thermostat').init('andretost@yahoo.com', 'c!R28sol');
var xively = require('xively');

// create a new express server
var app = express();

var current=0;

app.get('/', function (req, res) {
  res.send('Current temp is '+current);
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var x = new xively();
x.setKey('Gb2kHwE47iXaQXpxIABlUe1ksI8FjFX8LoG8MgEgUOxeSkfo');

nest.getInfo('09AA01AC381600T6', function(data) {
    console.log('Currently ' + celsiusToFahrenheit(data.current_temperature) + ' degrees fahrenheit');
    current = data.current_temperature;
    var timestamp = new Date().toISOString();
    var data = { "version" : "1.0.0",
                "datastreams" : [
                   { "id" : "sensor", "datapoints" : [ {"at" : timestamp, "value" : data.current_temperature} ] }
                ]
             };
             x.feed.new('1866255207.json', {
                   data_point: data,
                   callback: function(e) { console.log(e); }});
});

function celsiusToFahrenheit(temp) {
    return Math.round(temp * (9 / 5.0) + 32.0);
};
