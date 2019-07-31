var mysql = require('mysql');

var sql = mysql.createConnection({
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.SQLDB 
})

module.exports = (function(app,passport){

    app.get('/', function(req, res) {
        res.render('index.ejs', { title: 'Ryzone - Take Your Business Global!' });
    });

    app.get('/downloads', function(req,res){
        res.render('downloads.ejs', { title: 'Ryzone - Downloads'});
    });

    app.get('/services', function(req, res) {
        res.render('service.ejs', { title: 'Ryzone - Services' });
    });

    app.get('/services/web', function(req,res) {
        res.render('web.ejs', {title: 'Ryzone - Web Services' });
    });

    app.get('/services/security', function(req,res) {
        res.render('sec.ejs', {title: 'Ryzone - Security Services' });
    });

    app.get('/services/consultations', function(req,res) {
        res.render('consult.ejs', {title: 'Ryzone - Consultations' });
    });

    app.get('/contact', function(req, res) {
        res.render('contact.ejs', { title: 'Ryzone - Contact' });
    });

    app.get('/about', function(req,res) {
        res.render('about.ejs', {title: 'Ryzone - About Us'});
    });

    app.post('/contact', function(req,res) {
        var b = req.body
        var d = new Date().getTime().toString()
        var query = "INSERT INTO clients (First, Last, Phone, Email, Category, id) VALUES ('"+b.first+"', '"+b.last+"', '"+b.phone+"', '"+b.email+"', '"+b.option+"', '"+d+"')"
        console.log(query)
        sql.query(query, function(err,results){
            if(err){throw(err)}
            console.log("Inserted Record")
            res.render('thankyou.ejs', {title: 'Thank You! - Ryzone'})
        })
    });

    app.get('/login', (req,res)=>{
        res.render('login.ejs', {title: 'Ryzone - Login', message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : process.env.ADMINROUTE,
        failureRedirect : process.env.LOGINROUTE,
        failureFlash: true,
    })); 

    /* Only use to make new admins, do not expose to regular users, add some 
    kind of security to this, or just leave it commented out 

    app.get('/register', (req,res)=>{
        res.render('register.ejs', {title: 'Ryzone - Registration', message: req.flash('loginMessage') });
    });

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect : process.env.ADMINROUTE,
        failureRedirect : process.env.REGROUTE,
        failureFlash: true,
    })); 
    */

    app.get('/admin', isAdmin, (req,res)=>{
        sql.query('SELECT * FROM clients', function(err,clients){
            console.log(clients)
            res.render('admin.ejs', {title: 'Ryzone - Admin Panel', contacts: clients});
        });
    });

    app.post('/admin', function(req,res){
        var q = "DELETE FROM clients WHERE id='" + req.body.id + "'"
        sql.query(q, function(err){
            if(err){throw(err)}
            res.send('success!')
        })
    });

    function isAdmin(req,res,next){
        console.log(req.user)
        console.log(req.isAuthenticated())
        if(req.isAuthenticated()){
            return next();
        } else {
            res.redirect(process.env.LOGINROUTE);
        }
    }
});
