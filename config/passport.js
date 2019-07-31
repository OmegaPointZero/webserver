const LocalStrategy = require('passport-local').Strategy
/*const User = require('../app/models/admin')
const mongo = require('mongodb').MongoClient;
const configDB = process.env.MONGO;*/
const mysql = require('mysql')
var sql = mysql.createConnection({
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.SQLDB 
})
const bcrypt = require('bcrypt-nodejs')

const generateHash = function(password){
    return bcrypt.hashSync(password,/* bcrypt.genSaltSync(8),*/ null)
}

//Compare and check if password is correct
const validPassword = function(password, userPassword){
    return bcrypt.compareSync(password, userPassword)
}

module.exports = function(passport) {

    passport.serializeUser(function(user, done){
        done(null, user.id)
    })

    passport.deserializeUser(function(id, done){
        sql.query("SELECT * FROM administrators WHERE id='"+ id +"'", function(err, users){
            var user = users[0]
            done(err,user)
        })
        /*User.findById(id, function(err, user){
            done(err,user)  
        })*/
    })

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // send entire request to the callback function on next line
    },
        function(req, username, password, done){
            /*User.findOne({'username':username}, function(err, user){*/
            var q = "SELECT * FROM administrators WHERE username='"+username+"'"
            sql.query(q, function(err,users){
                var user = users[0]
                if(err)
                    return done(err);

                if(!user){
                    console.log('Need to make new user');
                    /*var newUser = new User();
                    var date = new Date().getTime()
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                        });
                    };*/
                    var nd = new Date().getTime().toString().slice(9,)
                    var p = generateHash(password)
                    var newUser = {
                        id: nd,
                        username: username,
                        password: p
                    }
                    var nq = "INSERT INTO administrators (id, username,password) VALUES ('"+nd+"', '"+username+"', '"+p+"')"
                    sql.query(nq, function(err){
                        if(err){throw(err)}
                        return done(null, newUser)
                    })
                }
            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, function (req, username, password, done) {
        var q = "SELECT * FROM administrators WHERE username='"+username+"'"
        sql.query(q, function(err,users){
            var user = users[0]
        /*User.findOne({'username' : username }, function(err,user){*/
            if(err){
                return done(err);
            }
            var valid = validPassword(password, user.password)
            if(!user){
                console.log('User login not found:'+username)
                return done(null,false,req.flash('loginMessage','Incorrect Login Credentials'))
            } else if(!valid){
                console.log('Incorrect password for user login:'+username)
                return done(null,false,req.flash('loginMessage','Incorrect Login Credentials'))
            } else { return done(null, user) }
        });
    }));
};
