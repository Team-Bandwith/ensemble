const graphql = require('graphql');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressGraphQl = require('express-graphql');
const socketio = require('socket.io');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const randomstring = require('randomstring');
const history = require('connect-history-api-fallback');
const path = require('path');

const { GraphQLSchema } = graphql;
const { query } = require('./db/schemas/query');
const { mutation } = require('./db/schemas/mutation');

const {
  logUser,
  logOutUser,
  addUserToRoom,
  getUsersInRoom,
  getOnlineUsers,
  removeUserFromRoom,
  addNotification,
  clearNotifications,
  getNotifications,
} = require('./users');

const schema = new GraphQLSchema({
  query,
  mutation,
});

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb'}));

const staticFileMiddleware = express.static('dist');

app.use(staticFileMiddleware);

// app.use(history({
//   index: '/dist/index.html'
// }));

// app.use(staticFileMiddleware);

app.use(
  '/api',
  expressGraphQl({
    schema,
    graphiql: true,
  }),
);

app.post('/verify', (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send();
    }
    return res.status(200).send(decoded);
  });
});

app.post('/song', (req, res) => {
  const { url } = req.body
  const songName = randomstring.generate();
  fs.writeFile(`${songName}.ogg`, Buffer.from(url.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64'), (err) => {
    if (err) {
      console.log(err);
    } else {
      cloudinary.uploader.unsigned_upload(`${songName}.ogg`, 'ensemble-sound',
        {
          cloud_name: 'my-ensemble',
          resource_type: 'video',
        },
        (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            fs.unlink(`${songName}.ogg`, (err) => {
              if (err) {
                console.log(err);
              } else {
                res.status(201).send(data);
              }
            });
          }
        });
    }
  });
});

app.all("*", (_req, res) => {
  try {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  } catch (error) {
    res.json({ success: false, message: "Something went wrong" });
  }
});

const server = app.listen(process.env.S_PORT, () => console.log(`GraphQL server running on ${process.env.S_PORT}`));

const io = socketio(server);

io.on('connection', (socket) => {
  socket.on('login', (user) => {
    userWithId = { ...user };
    userWithId.socketId = socket.id;
    logUser(userWithId);
    io.sockets.emit('updateOnlineUsers', Object.values(getOnlineUsers()));
    if (getNotifications(user.id)) {
      io.to(socket.id).emit('backlog', getNotifications(user.id));
      clearNotifications(user.id);
    }
  });

  socket.on('join', ({ room, user }) => {
    socket.join(room);
    const userWithId = { ...user };
    userWithId.socketId = socket.id;
    addUserToRoom({ room, user: userWithId });
    io.to(room).emit('receiveMessage', { user: 'Ensemble', message: `${user.username} has joined the band!`});
    io.to(room).emit('updateUsers', getUsersInRoom(room));
  });

  socket.on('openDM', (room) => {
    socket.join(room);
  });

  socket.on('sendDM', (room) => {
    socket.broadcast.to(room).emit('getDM');
  });

  socket.on('closeDM', (room) => {
    socket.leave(room);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    let user = removeUserFromRoom(socket.id, room);
    user = user ? user.left : null;
    if (user) {
      io.to(room).emit('receiveMessage', { user: 'Ensemble', message: `${user.username} has left the band!` });
      io.to(room).emit('updateUsers', getUsersInRoom(room));
    }
  });

  socket.on('startNote', ({ note, vibFreq, vibDepth, oscType, room }) => {
    socket.broadcast.to(room).emit('receiveStart', { note, vibFreq, vibDepth, oscType });
  });

  socket.on('stopNote', ({ note, room }) => {
    socket.broadcast.to(room).emit('receiveStop', note);
  });

  socket.on('startDrum', ({ drum, room }) => {
    socket.broadcast.to(room).emit('receiveStartDrum', { drum });
  });

  socket.on('sendMessage', ({ message, room }) => {
    io.to(room).emit('receiveMessage', message);
  });

  socket.on('notify', (id) => {
    const online = getOnlineUsers();
    console.log(online, online[id]);
    if (online[id]) {
      io.to(online[id].socketId).emit('notified');
    } else {
      addNotification(id);
    }
  });

  socket.on('logout', () => {
    logOutUser(socket.id);
    io.sockets.emit('updateOnlineUsers', Object.values(getOnlineUsers()));
  });

  socket.on('disconnect', () => {
    logOutUser(socket.id);
    const info = removeUserFromRoom(socket.id);
    if (info) {
      io.to(info.room).emit('receiveMessage', { user: 'Ensemble', message: `${info.left.username} has left the band!` });
      io.to(info.room).emit('updateUsers', getUsersInRoom(info.room));
    }
    io.sockets.emit('updateOnlineUsers', Object.values(getOnlineUsers()));
  });
});
