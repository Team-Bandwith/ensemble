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

const { GraphQLSchema } = graphql;
const { query } = require('./db/schemas/query');
const { mutation } = require('./db/schemas/mutation');

const schema = new GraphQLSchema({
  query,
  mutation,
});

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb'}));
app.use(express.static('dist'));

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
    if(err) {
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
            })
          }
      });
    }
  });
});

const server = app.listen(process.env.S_PORT, () => console.log(`GraphQL server running on ${process.env.S_PORT}`));

const io = socketio(server);

io.on('connection', (socket) => {
  console.log('A new client has connected!');
  console.log(socket.id);
  socket.on('join', ({ room, user }) => {
    console.log(room, user);
    socket.join(room);
    io.to(room).emit('newUser', user);
  });

  socket.on('startNote', ({ note, room }) => {
    socket.broadcast.to(room).emit('receiveStart', note);
  });

  socket.on('stopNote', ({ note, room }) => {
    socket.broadcast.to(room).emit('receiveStop', note);
  });

  socket.on('sendMessage', ({ message, room }) => {
    console.log(message, 'server message');
    io.to(room).emit('receiveMessage', message);
  });
});
