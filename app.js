var express = require('express'),
    socket_io = require('socket.io'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    users = require('./routes/users'),

    app = express(),
    io = socket_io();
    app.io = io;

var architecture = require('./architecture.js'),
    Room = architecture.Room,
    User = architecture.User,
    
    _ = require('underscore')._,
    uuid = require('uuid');

app.use("/style", express.static(path.join(__dirname, 'public/style')));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

var userIDToUser = {};
var rooms = {};

var roomReaper = setInterval(function() {
  for(var roomID in rooms) {
    if(rooms.hasOwnProperty(roomID)) {
      if(rooms[roomID].isEmpty()) {
        rooms[roomID].closeRoom();
        delete rooms[roomID];
      }
    } 
  }
}, 5*60*1000);

io.sockets.on('connection', function(socket) {
  console.log("A socket with id:" + socket.id + " has connected.");

  socket.on('disconnect', function() {
    var user = userIDToUser[socket.id];
    if(user != null) {
      var room = rooms[user.roomID];

      room.removeUser(user);

      delete userIDToUser[socket.id];

      if(room.isEmpty()) {
        delete rooms[room.id];
        room.closeRoom();
      }
    }
  });

  socket.on('sendMessage', function(data) {
    var roomID = data.roomID;
    var userID = data.userID;
    var message = data.message;

    var room = rooms[roomID];

    if(!room) {
      socket.emit('onError', 'Room does not exist for roomID.');
      return;
    }

    var user = userIDToUser[userID];
    if(!user) {
      socket.emit('onError', 'User does not exist for userID');
      return;
    }

    io.to(roomID).emit('onMessage', 
    { 
      name: user.name,
      message: message      
    });
  });

  socket.on('joinRoom', function(data) {
    var roomID = data.roomID;
    var name = data.name;

    console.log(name + ' is joining ' + roomID)
    var room = rooms[roomID];

    if(!room) {
      socket.emit('onError', 'Room does not exist for roomID.');
      return;
    }
    
    var uName = room.getUniqueName(name);
    var uID = socket.id;

    var newUser = new User(uName, uID, roomID);


    console.log(newUser.id);
    io.to(socket.id).emit('userInfo', newUser.name, newUser.id);

    socket.join(roomID);

    room.addUser(newUser);
    userIDToUser[newUser.id] = newUser;
  })

  socket.on('addTrack', function(data) {
    var roomID = data.roomID;
    var userID = data.userID;
    var track = data.track;

    var room = rooms[roomID];

    if(!room) {
      socket.emit('onError', 'Room does not exist for roomID.');
      return;
    }

    var user = userIDToUser[userID];
    if(!user) {
      socket.emit('onError', 'User does not exist for userID');
      return;
    }

    console.log('sucessfully added track!');

    
    room.addTrack(user, track);
  });

  socket.on('bootTrack', function(data) {
    var roomID = data.roomID;
    var userID = data.userID;
    
    var room = rooms[roomID];
    if(!room) {
      socket.emit('onError', 'Room does not exist for roomID.');
      return;
    }

    var user = userIDToUser[userID];
    if(!user) {
      socket.emit('onError', 'User does not exist for userID');
      return;
    }

    room.bootTrack(user);
  })

  socket.on('getRoomState', function(roomID, fn) {
    var room = rooms[roomID];
    if(!room) {
      socket.emit('onError', 'Room does not exist for roomID.');
      return;
    }


    socket.emit('onRoomUpdate', room.getRoomState());
  })  
});

var onRoomChange = function(roomID) {
  return function(roomState, error, userID) {
    if(roomState) {
      io.to(roomID).emit('onRoomUpdate', 
      { 
          name: roomState.name,
          users: roomState.users.array(),
          currentSongEpoch: roomState.currentSongEpoch,
          trackQueue: roomState.trackQueue.getQueue(),
          bootVotes: roomState.bootVotes.array()
      });
    } else if(error) {
      if(userID) {
        io.to(userID).emit('onError', error);
      } else {
        io.to(roomID).emit('onError', error);
      }
    } else {
      io.to(roomID).emit('onClose');
    }
  };
}

exports.rooms = rooms;
exports.onRoomChange = onRoomChange;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function (req, res) {
  res.render('index');
});


//adding next 3 get() for zero release / product page
app.get('/zero.html', function (req, res) {
        res.sendFile(path.join(__dirname, 'views/zero.html'))
});

app.get('/dev_documentation', function (req, res) {
	res.sendFile(path.join(__dirname, './documentation/dev_documentation.pdf'))
});
/* once the user documentation gets pushed to github uncomment this
app.get('/user_documentation', function(req, res) {
	res.sendFile(path.join(__dirname, '../documentation/user_documentation.pdf'))
});
*/

module.exports = app;
