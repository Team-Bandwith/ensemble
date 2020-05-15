const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../pgAdapter');

const {
  GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt,
} = graphql;
const {
  MemberType,
  FriendType,
  MessageType,
  CommentType,
  SongUserType,
  SongType,
} = require('./types');

exports.mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  type: 'Mutation',
  fields: {
    likeSong: {
      type: SongType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = 'UPDATE song SET count_likes = count_likes + 1 WHERE id = $1 RETURNING count_likes';
        return db.one(query, [args.id])
          .then((data) => data)
          .catch((err) => { console.log('err', err); });
      },
    },
    signUp: {
      type: MemberType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = 'INSERT INTO member(username, email, password) VALUES ($1, $2, $3) RETURNING id';
        return bcrypt.hash(args.password, 8)
          .then((hash) => db.one(query, [args.username, args.email, hash]))
          .then((res) => ({
            auth: true,
            token: jwt.sign({
              id: res.id,
              username: args.username,
              email: args.email,
              url_avatar: null,
            }, process.env.secret, { expiresIn: 86400 }),
          }))
          .catch((err) => console.log(err));
      },
    },
    storeAvatar: {
      type: MemberType,
      args: {
        id: { type: GraphQLInt },
        url_avatar: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = 'UPDATE member SET url_avatar = $1 WHERE id = $2 RETURNING id, username, email, url_avatar';
        return db.one(query, [args.url_avatar, args.id])
          .then((res) => ({
            token: jwt.sign({
              id: res.id,
              username: res.username,
              email: res.email,
              url_avatar: res.url_avatar,
            }, process.env.secret, { expiresIn: 86400 }),
            url_avatar: res.url_avatar,
          }))
          .catch((err) => console.error('avatar error', err));
      },
    },
    addSong: {
      type: SongType,
      args: {
        id_author: { type: GraphQLInt },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        public: { type: GraphQLBoolean },
      },
      resolve(parentValue, args) {
        const query = 'INSERT INTO song(id_author, name, url, public, created_at) VALUES ($1, $2, $3, $4, now()) RETURNING id, id_author';
        const values = [args.id_author, args.name, args.url, args.public];
        return db.one(query, values)
          .then((res) => res)
          .catch((err) => console.log(err));
      }
    },
  },
});
