var express = require('express');
var router = express.Router();

var path = require('path');
var pg = require('pg');

var connectionString = require(path.join(__dirname, '../', 'config'));

function sendQuery(res,query) {
    
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
        var query = client.query(QUERY_FRIENDS);
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

var QUERY_FRIENDS =
    "SELECT first_name, last_name, email, birthday" +
    " FROM tonight.users;";



router.get('/friends', function(req, res) {
    
    sendQuery(res,QUERY_FRIENDS);

});










module.exports = router;
