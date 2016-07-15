//Define variables & dependencies

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var controllers = require('./controllers');
var config = require('./config.js');

//Configure Express

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use('/upload', express.static(__dirname + '/public'))
	app.use(config.publicUrl, express.static(__dirname + config.storageDir));
	app.use(app.router);
	app.engine('html', require('ejs').renderFile);
});

//Define routes
app.get('/upload', controllers.index);
app.post('/api/upload', controllers.upload);

//Start the server
server.listen(config.port, function() {
  console.log("Express server up and running.");
});