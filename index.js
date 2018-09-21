var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient;

app.use('/static', express.static(path.join(__dirname, 'static')))

//Connect to mongo...
mongo.connect('mongodb://127.0.0.1:27017/team_chat_data', function(err, db){

  if(err){
      throw(err);
  }

console.log('mongoDB Connected...');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.get('/chat.json', function(req, res){
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

http.listen(3000, function(){
  console.log('listening on *:3000');
});
