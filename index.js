'use strict';
var express = require ('express');
var app = express();
var router = require('./routes');
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var path = require('path');
var models = require('./models');

// templating boilerplate setup
app.engine('html', nunjucks.render); // how to render html templates
app.set('view engine', 'html'); // what file extension do our templates have
var env = nunjucks.configure('views', { noCache: true }); // where to find the views, caching off

// and then include these two lines of code to add the extension:
var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

// old start the server
// var server = app.listen(3000, function(){
//     console.log('listening on port 3000');
// });


app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function(req, res){
    res.send('hello world');
});
app.use('/', router);

models.User.sync({})
    .then(function () {
        return models.Page.sync({})
    })
    .then(function () {
        // make sure to replace the name below with your express app
        var server =app.listen(3000, function () {
            console.log('Server is listening on port 3000!');
        });
    })
    .catch(console.error);