const express = require('express');
const morgan = require('morgan'); //log reqs
const passport = require('passport');
const app = express();
const promise = require('rsvp').Promise;
const bodyParser = require('body-parser');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');

var cors = (function(req,res,next){
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
      } else {
        res.header('Access-Control-Allow-Origin', '*');
      }
    next();
});

app.use(cors)
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash())
app.use(function(req,res,next){
    res.setTimeout(480000, function(){
        console.log('Request has timed out');
        res.sendStatus(408);
    });
    next();
});

app.use(session({secret:process.env.SESSION_SECRET,resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
require('./app/routes.js')(app,passport);

app.engine('html', require('ejs').renderFile);
app.set('views', 'views');
app.set('view engine', 'html');

app.use(function(req,res,next){
    res.status(404).render('404.ejs')
});

var port = 8080;
app.listen(port,function(){
    console.log('Listening on ' + port)
})
