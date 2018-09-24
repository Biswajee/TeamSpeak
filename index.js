// Import Statements...

var express = require('express');
var http = require('http').Server(app);
const https = require('https');
var io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var app = express();

//CLIENT SECRET & ID --- REMOVE IN PRODUCTION
const CLIENT_SECRET = '7771a6ddf052493003da004a21126112';
const CLIENT_ID = '7cce36cb340734b30f805f2c47629548';
const REDIRECT_URI = 'http://localhost:3000/login';

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body parser Middleware...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Set Static path...
app.use(express.static(path.join(__dirname, '/public')));



//Connect to mongo...

mongo.connect('mongodb://mongo:27017/team_chat_data', function(err, db){

  if(err){
      throw(err);
  }

console.log('mongoDB Connected...');


// Home page of application

app.get('/', function(req, res){
  res.render('login');
});


//OAuth2.0 Endpoint...

app.get('/oauth2', function(req, res, next){
res.redirect('https://api.codechef.com/oauth/authorize?response_type=code&client_id='+CLIENT_ID+'&state=xyz&redirect_uri='+REDIRECT_URI);
});


// Chat platform display after valid user authentication...

var username;
var errors = "Authentication Error";

app.get('/login', function(req, res){
  var AUTH_CODE = req.query.code;
  console.log('code', req.query.code);
  console.log('state', req.query.state);

//----------------------------------------------------------------------------------------------------------


  var headers = {
      'content-Type': 'application/json'
  };

  var dataString = '{"grant_type": "authorization_code","code":"'+ AUTH_CODE +'","client_id":"'+ CLIENT_ID +'","client_secret":"'+ CLIENT_SECRET +'","redirect_uri":"'+ REDIRECT_URI+'"}';

  var options = {
      url: 'https://api.codechef.com/oauth/token',
      method: 'POST',
      headers: headers,
      body: dataString
  };


  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          //console.log(body);
          access_token = JSON.parse(body).result.data.access_token;
          refresh_token = JSON.parse(body).result.data.refresh_token;

          //Processing the access_token

          var query_headers = {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+ access_token
          };

          var query_options = {
              url: 'https://api.codechef.com/users/me',
              headers: query_headers
          };

          function query_callback(error, response, body) {
              if (!error && response.statusCode == 200) {
                  body = JSON.parse(body);
                  var username = body['result']['data']['content']['username'];
                  res.render('index', {'auth_user': username});
              }else{
                res.redirect('/');
              }
          }
          request(query_options, query_callback);
      }
  }
  // End of query using access_token...

  request(options, callback);


//------------------------------------------------------------------------------------------------------------------

});




// Endpoint to be converted to feedback submit....
app.post('/login/auth', function(req, res, next){
  console.log('Auth URL Visit !');
  username = req.body.codechef_id;
  errors = null;
  if(username)
  next();
  else {
    res.redirect('/login');
  }
},
  function(req, res) {
  res.render('index', {'auth_user': username, 'errors': errors});
});


// Thanks page ending session - logout...

app.get('/thanks', function(req, res){
  res.render('thanks');
});


// JSON of Mongodb stored chat - FOR A DEVELOPMENT API

app.get('/chat.json', function(req, res){
  //let data = db.collection('codechef-chats');
  res.json(data);
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  let chat = db.collection('codechef-chats');

  // Create function to send status
        sendStatus = function(s){
            io.emit('status', s);
        }


        // Get chats from mongo collection
                chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
                    if(err){
                        throw err;
                    }

                    // Emit the messages
                    socket.emit('output', res);
                });

                // Handle input events
                socket.on('input', function(data){
                    let name = data.name;
                    let message = data.message;

                    // Check for name and message
                    if(name == '' || message == ''){
                        // Send error status
                        sendStatus('Please enter a name and message');
                    } else {
                        // Insert message
                        chat.insert({name: name, message: message}, function(){
                            io.emit('output', [data]);

                            // Send status object
                            sendStatus({
                                message: 'Message sent',
                                clear: true
                            });
                        });
                    }
                });
          });
      });

app.listen(3000, function(){
  console.log('Server started on port :3000 ** [ run docker on :80 ]');
});
