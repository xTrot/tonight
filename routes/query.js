var express = require('express');
var router = express.Router();

var path = require('path');
var pg = require('pg');
var bcrypt = require('bcrypt');

var connectionString = require(path.join(__dirname, '../', 'config'));


var USER_LOGIN = 
    "SELECT user_id,password FROM tonight.users"+
    " WHERE email=$1";

var QUERY_FRIENDS =
    "SELECT first_name, last_name, email, birthday" +
    " FROM tonight.users";

var NEW_USER =
    "INSERT INTO tonight.users(first_name, last_name, email, password)" +
    " VALUES($1, $2, $3, $4)";

var GET_USER_ID =
    "SELECT user_id FROM tonight.users" +
    " WHERE email=$1 AND password=$2";
    
var QUERY_GROUPS =
    "SELECT name" +
    " FROM tonight.groups";


//Get friends
router.get('/friends', function(req, res) {
    sendQuery(res, QUERY_FRIENDS);
});



function sendQuery(res, QUERY) {
    
    var result = [];
    
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        //console.log("\n\n** 1");
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }


        // SQL Query > Select Data
        var query = client.query(QUERY);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
            console.log(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
}

//Get groups
router.get('/groups', function(req, res) {
    sendQuery(res, QUERY_GROUPS);
});



function sendQuery(res, QUERY) {
    
    var result = [];
    
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        //console.log("\n\n** 1");
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }


        // SQL Query > Select Data
        var query = client.query(QUERY);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
            console.log(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
}

//Registration
router.post('/register', function(req, res) {
    var results = [];
    
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    
    // Grab data from http request
    var data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash
    };
    
    console.log(data);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query(NEW_USER, [data.first_name, data.last_name, data.email, data.password]);

        // SQL Query > Select Data
        var query = client.query(GET_USER_ID, [data. email, data.password]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);

        });

    });

});

// User Login
router.post('/login', function(req, res) {
    var results = [];
    
    // Grab data from http request
    var data = {
        email: req.body.email,
        password: req.body.password
    };

    console.log(data);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        // SQL Query > User Authentication
        var query = client.query(USER_LOGIN, [data.email]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            if (results[0]) {
                if(bcrypt.compareSync(data.password, results[0].password)){
                    console.log("User: "+results[0].user_id+" Authenticated");
                    req.session.user_id = results[0].user_id;
                    res.redirect('/feed');
                }else {
                    res.redirect('/?error=true');
            }
            }; 
        });

    });

});

// Logout route
router.get('/logout', function(req,res){
    delete req.session.user_id;
    res.redirect('/');
});



module.exports = router;