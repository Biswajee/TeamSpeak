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

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body parser Middleware...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Set Static path...
app.use(express.static(path.join(__dirname, '/public')));



//Connect to mongo...
/*
mongo.connect('mongodb://mongo:27017/team_chat_data', function(err, db){

  if(err){
      throw(err);
  }

console.log('mongoDB Connected...');
*/


app.get('/', function(req, res){
  res.render('index');
});

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

  var dataString = '{"grant_type": "authorization_code","code":"'+ AUTH_CODE +'","client_id":"'+ CLIENT_ID +'","client_secret":"'+ CLIENT_SECRET +'","redirect_uri":"http://localhost:3000/login"}';

  var options = {
      url: 'https://api.codechef.com/oauth/token',
      method: 'POST',
      headers: headers,
      body: dataString
  };

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          //console.log(body);
          console.log(JSON.parse(body).result.data.access_token);
      }

      //res.redirect('/access_grant');
  }
  console.log(dataString);

  request(options, callback);

//------------------------------------------------------------------------------------------------------------------

res.render('login');

});


/*--------------------------------------------------------------------*/
app.get('/oauth2', function(req, res, next){
res.redirect('https://api.codechef.com/oauth/authorize?response_type=code&client_id='+CLIENT_ID+'&state=xyz&redirect_uri=http://localhost:3000/login');
});
/*---------------------------------------------------------------------*/


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



app.get('/', function(req, res){
  res.render('index', {'auth_user': username, 'errors': errors} );
});

app.get('/thanks', function(req, res){
  res.render('thanks');
});

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
//});

app.listen(3000, function(){
  console.log('Server started on port :3000');
});
