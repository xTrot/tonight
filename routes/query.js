var express = require('express');
var upload = require('express-upload');
var gm = require('gm');
var sg = require('sendgrid')("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");
var router = express.Router();

var path = require('path');
var pg = require('pg');
var bcrypt = require('bcrypt');

var uploadThumb = upload()
    .accept([/image.*/])
    .gm(function(gm) {
        return gm.resize(false, 100);
    })
    .to('public/images/thumbs/');


var connectionString = require(path.join(__dirname, '../', 'config'));

var F_NEW_HANG = "select tonight.hang($1::integer[],null::integer[],$2::integer," +
                    "$3::text,$4::date,$5::time,$6::text,true)";

var F_QUERY_RELATION = "select tonight.get_friend_status($1,$2) as relation";

var F_SEND_REQUEST = "select tonight.request($1,$2) as email";

var F_ACCEPT_REQUEST = "select tonight.accept($1,$2) as email";

var F_UNFRIEND = "select tonight.unfriend($1,$2)";

var USER_EXISTS = 
    "SELECT user_id FROM tonight.users"+
    " WHERE email=$1";

var USER_LOGIN = 
    "SELECT user_id,password FROM tonight.users"+
    " WHERE email=$1";

var QUERY_FRIENDS =

    "SELECT user_id, first_name, last_name, email, birthday, thumb" +
    " FROM tonight.users natural join( " +
        "select friend as user_id from tonight.befriend " +
        "where user_i=$1" +
    ") as myfriends";
    
var QUERY_HANG =
    "SELECT *" +
    " FROM tonight.hangs";

var NEW_USER =
    "INSERT INTO tonight.users(first_name, last_name, email, password)" +
    " VALUES($1, $2, $3, $4)";
    
var NEW_BUSINESS =
    "INSERT INTO tonight.business_pages(user_id, name)" +
    " VALUES($1, $2)"; 
    
var NEW_GROUP =
    "INSERT INTO tonight.groups(user_id, name)" +
    " VALUES($1, $2)";

var GET_USER_ID =
    "SELECT user_id FROM tonight.users" +
    " WHERE email=$1 AND password=$2";
    
var QUERY_GROUPS =
    "SELECT group_id, name, thumb" +
    " FROM tonight.groups";
    
var QUERY_BUSINESS =
    "SELECT page_id, name, thumb" +
    " FROM tonight.business_pages";
    
var QUERY_POST =
    "INSERT INTO tonight.posts(text,visible,user_id,type)"+
    " values($1,$2,$3,$4)";

var CHECK_USER =
    "SELECT user_id FROM tonight.users" +
    " WHERE email=$1";


var QUERY_SEARCH =
    "SELECT user_id, first_name, last_name, thumb" +
    " FROM tonight.users WHERE CONCAT(first_name,' ',last_name)" +
    " LIKE ";

var GET_FEED =
    "select user_id, concat(first_name,' ',last_name) as author, "+
    "datetime as date, thumb, type, text, post_id " +
    "from tonight.users natural join( " +
    "select text, type, datetime, user_id, post_id " +
    "from tonight.posts natural join ( " +
    "select friend as user_id from tonight.befriend " +
    "where user_i=$1 union select $1 as user_id) as nj) " +
    "as posted order by datetime desc ";

var HANG_LIST =
    "SELECT hang_id, name, thumb, datetime_created "+
        "FROM tonight.hangs "+
        "WHERE hang_id = "+
            "ANY(SELECT hang_id "+
                "FROM tonight.hang_invites_users "+
                "WHERE user_id = $1 "+
                "UNION "+
                "SELECT hang_id "+
                "FROM tonight.hangs "+
                "WHERE user_i = $1) "+
        "ORDER BY datetime_created DESC";

var GROUP_LIST =
    "SELECT name, thumb, datetime"+
    " FROM tonight.groups"+
    " WHERE group_id = "+
        "ANY(SELECT group_id "+
            "FROM tonight.group_invites_users "+
            "WHERE user_id = 67 "+
            "UNION "+
            "SELECT group_id "+
            "FROM tonight.groups "+
            "WHERE user_id = 67) "+
    "ORDER BY datetime DESC";
    
var GET_GOING = "select concat(first_name,' ', last_name) as name, thumb " +
    "from tonight.users natural join tonight.hang_invites_users " +
    "where hang_id=$1 and status='going'";

var GET_MAYBE = "select concat(first_name,' ', last_name) as name, thumb " +
    "from tonight.users natural join tonight.hang_invites_users " +
    "where hang_id=$1 and status='maybe'";

var GET_NOT = "select concat(first_name,' ', last_name) as name, thumb " +
    "from tonight.users natural join tonight.hang_invites_users " +
    "where hang_id=$1 and status='not'";
    
var QUERY_COMMENT = "insert into tonight.comments (c_text,author,post_id) " +
    "values($1,$2,$3)";
    
var QUERY_COMMENTS = "select concat(first_name,' ',last_name) as author, c_text from (select c_text, author as user_id " +
  "from tonight.posts natural join tonight.comments " +
  "where post_id=$1) as foo natural join tonight.users as withnames"

var DELETE_USER = "DELETE FROM tonight.users"+
                    " WHERE user_id = $1";

var DELETE_GROUP = "DELETE FROM tonight.groups"+
                    " WHERE group_id=";

var DELETE_POST = "DELETE FROM tonight.posts"+
                    " WHERE post_id = $1";

var DELETE_HANG = "DELETE FROM tonight.hangs"+
                    " WHERE hang_id = $1";

var DELETE_BP = "DELETE FROM tonight.business_pages"+
                    " WHERE page_id=";




function sendNotification(emails,ofType) {
    
    var sendText;
    
    switch(ofType){
        case('hang'): sendText = "You have been invited to a new hang."; break;
        case('friendRequest'): sendText = "You have recieved a new friend request."; break;
        default: return false;
    };
    
    var email     = new sg.Email({
        to: emails,
        from: 'no-reply@tonight-social.herokuapp.com',
        subject: 'Notification - Tonight',
        text: sendText
    });
    
    sg.send(email, function(err, json) {
        if (err) { return console.error(err); }
        console.log(json);
    });
    
    return true;
    
}

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
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
}

router.get('/feed', function name(req,res) {
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
        var query = client.query(GET_FEED,[req.session.user_id]);
        console.log("Set the query.");
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
});

router.get('/comments?', function name(req,res) {
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
        var query = client.query(QUERY_COMMENTS,[req.query.post_id]);
        console.log("Set the query.");
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
});

// Set user as Going
router.post('/hang/going?', function(req, res) {
    sendQuery(res,"UPDATE tonight.hang_invites_users SET status='going' " +
        "WHERE hang_id="+req.query.hang_id+" and user_id="+req.session.user_id);
});

//Update group info
router.post('/updategroup?', function(req, res) {
   console.log(req.query.group_id);
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
        var query = client.query("UPDATE tonight.groups SET name='"
        +req.body.name+"' WHERE group_id="+
        req.query.group_id+" AND user_id="+req.session.user_id);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            res.redirect('/groups');
        });

    });
   
});

//Delete group
router.post('/deletegroup?', function(req, res) {
   console.log(req.query.group_id);
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
        var query = client.query(DELETE_GROUP+req.query.group_id);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            res.redirect('/groups');
        });

    });
   
});

//update business info
router.post('/updatebusiness?', function(req, res) {
   console.log(req.query.b_id);
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
        var query = client.query("UPDATE tonight.business_pages SET name='"
        +req.body.name+"' WHERE page_id="+
        req.query.b_id+" AND user_id="+req.session.user_id);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            res.redirect('/businesses');
        });

    });
   
});

//Delete business
router.post('/deletebusiness?', function(req, res) {
   console.log(req.query.b_id);
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
        var query = client.query(DELETE_BP+req.query.b_id);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            res.redirect('/businesses');
        });

    });
   
});

// Set user as Maybe
router.post('/hang/maybe?', function(req, res) {
    sendQuery(res,"UPDATE tonight.hang_invites_users SET status='maybe' " +
        "WHERE hang_id="+req.query.hang_id+" and user_id="+req.session.user_id);
});

// Set user as Not Going
router.post('/hang/not?', function(req, res) {
    sendQuery(res,"UPDATE tonight.hang_invites_users SET status='not' " +
        "WHERE hang_id="+req.query.hang_id+" and user_id="+req.session.user_id);
});

// Get users Going
router.get('/hang/going?', function(req, res) {
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
        var query = client.query(GET_GOING,[req.query.hang_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
});

// Get users Maybe
router.get('/hang/maybe?', function(req, res) {
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
        var query = client.query(GET_MAYBE,[req.query.hang_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
});

// Get users Not Going
router.get('/hang/not?', function(req, res) {
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
        var query = client.query(GET_NOT,[req.query.hang_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
});

router.get('/relationship?',function (req,res) {
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
        var query = client.query(F_QUERY_RELATION,[req.session.user_id,req.query.user]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
});

router.post('/relationship?',function (req,res) {
    var result = [];
    var action = '';
    switch (req.body.status) {
        case 'Add Friend':
            action = F_SEND_REQUEST;
            break;
        case 'Request Sent':
            return;
            break;
        case 'Accept':
            action = F_ACCEPT_REQUEST;
            break;
        case 'Unfriend':
            action = F_UNFRIEND;
            break;
        default:
            break;
    }
    
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        //console.log("\n\n** 1");
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }
        
        console.log(query+"\n",[req.session.user_id,Number(req.query.user)]);


        // SQL Query > Select Data
        var query = client.query(action,[req.session.user_id,Number(req.query.user)]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            res.redirect('/profile?user='+req.query.user);
        });

    });
});

//temp profile query
router.get('/profile?', function(req, res){   
   console.log(req.query.user);
   sendQuery(res,"SELECT user_id, first_name, last_name, thumb FROM tonight.users WHERE user_id="+req.query.user);
});

//Get groups
router.get('/groups', function(req, res) {
    sendQuery(res,QUERY_GROUPS);
});

//Get group profile 
router.get('/groupprofile?', function(req, res) {
    console.log(req.query.b_id);
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
       
       var searchFor = QUERY_GROUPS + " WHERE group_id="+req.query.group_id;
       console.log(searchFor);

        // SQL Query > Select Data
        var query = client.query(searchFor);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });
    });
});

//Get business
router.get('/business', function(req, res) {
    sendQuery(res, QUERY_BUSINESS);
});

//Get business profile 
router.get('/businessprofile?', function(req, res) {
    console.log(req.query.b_id);
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
       
       var searchFor = QUERY_BUSINESS + " WHERE page_id="+req.query.b_id;
       console.log(searchFor);

        // SQL Query > Select Data
        var query = client.query(searchFor);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });
    });
});

//Get an individual hang
router.get('/hang?', function(req, res) {
    console.log(req.query.hang_id);
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
       
       var searchFor = QUERY_HANG + " WHERE hang_id="+req.query.hang_id;
       console.log(searchFor);

        // SQL Query > Select Data
        var query = client.query(searchFor);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });
    });
});

//Get a list of hangs
router.get('/hangs', function(req, res) {
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
        var query = client.query(HANG_LIST,[req.session.user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });
    });
});

//Get search results
router.get('/search?', function(req, res) {
    console.log(req.query.search);
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
       
       var searchFor = QUERY_SEARCH + "'%"+req.query.search+"%'";
       console.log(searchFor);

        // SQL Query > Select Data
        var query = client.query(searchFor);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });
    });
});

//Get friends
router.get('/friends', function(req, res) {
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
        var query = client.query(QUERY_FRIENDS,[req.session.user_id]);
        // Stream results back one row at a time
        query.on('row', function(row) {
            result.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(result);
        });

    });
});

router.post('/newhang', function (req, res) {
    var emailList=[];
    
    console.log(req.body);
    var date = new Date();
    var today = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear();
    var invited = [];
    invited.push(req.body.invited);
    var invited_string = "{"+invited.join(",")+"}";
    
    // Grab data from http request
    var data = {
        user_id: req.session.user_id,
        name: req.body.name,
        invited: invited_string,
        place: req.body.place,
        time: req.body.time,
        date:today
    };
    
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        console.log(F_NEW_HANG,[data.invited,data.user_id, data.name,
            data.date,data.time,data.place]);

        // SQL Query > Insert Data
        var query = client.query(F_NEW_HANG, [data.invited,data.user_id, data.name,
            data.date,data.time,data.place]);     
        
         query.on('row', function(row) {
            emailList.push(row.hang);
        });
        
        
         query.on('end', function() {
            done();
            console.log("Mailed Hang Notification to:\n" + emailList);
            sendNotification(emailList,'hang');
            res.redirect('/hangs');
        });
        

    });
});

//Registration
router.post('/register', function(req, res) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    // Grab data from http request
    var data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash
    };

    //console.log(data);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        
        client.query(CHECK_USER, [data.email], function(err, result) {
            var tempUserID = result.rows[0];

            //console.log(tempUserID);
            if(tempUserID){
                res.redirect('/register?error=true');
                done();
                return;
            }
        });
    });

     pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        client.query(NEW_USER, [data.first_name, data.last_name, data.email, data.password]);
        res.redirect('/login');
        done();
        return;
    });
});

//Businesses
router.post('/businesses', function(req, res) {
    
    // Grab data from http request
    var data = {
        name: req.body.name
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
        client.query(NEW_BUSINESS, [40, data.name]);     
        res.redirect('/businesses');

    });

});

//Groups
router.post('/groupinfo', function(req, res) {
    
    // Grab data from http request
    var data = {
        name: req.body.name
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
        client.query(NEW_GROUP, [40, data.name]);     
        res.redirect('/groups');

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
                    res.redirect('/login?error=true');
            }
            }; 
        });

    });

});

router.post('/comment',function name(req,res) {
    
    // Grab data from http request
    var data = {
        c_text: req.body.text,
        author:req.session.user_id,
        post_id: req.body.post_id
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
        client.query(QUERY_COMMENT, [data.c_text,data.author,data.post_id]);

        res.redirect('/feed');
    });
    
});

router.post('/post',function name(req,res) {
    
    // Grab data from http request
    var data = {
        text: req.body.text,
        visible: true,
        user_id:req.session.user_id,
        ptype: req.body.type
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
        client.query(QUERY_POST, [data.text,data.visible,data.user_id,data.ptype]);

        res.redirect('/feed');
    });
    
});

router.post('/uploadThumb',function(req,res){
    console.log(req.files);
    uploadThumb.exec(req.files.image, function(err, file) {
        console.log(req.files);
        if (err) {
            console.log(err);
        } else {
            console.log(file);
            console.log('Got a file', file, 'uploaded to public/images with name', file.name);
        }
        
        res.redirect('/');
    });
});

// Logout route
router.get('/logout', function(req,res){
    delete req.session.user_id;
    res.redirect('/');
});

//Delete Hang
router.delete('/deleteHang?', function(req,res){
    var hang_id=req.query.hang_id;
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query(DELETE_HANG, [hang_id]);


    });


    return;
});







module.exports = router;