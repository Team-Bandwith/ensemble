const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt,
} = require('graphql');
const { db } = require('../pgAdapter');
const {
  MemberType,
  FriendType,
  MessageType,
  CommentType,
  SongUserType,
  SongType,
  InviteType,
} = require('./types');

exports.query = new GraphQLObjectType({
  name: 'RootQueryType',
  type: 'Query',
  fields: {
    getAllSongs: {
      type: new GraphQLList(SongType),
      resolve() {
        const query = 'SELECT * FROM song';
        return db.any(query)
          .then((data) => data)
          .catch((err) => { console.log('err', err); });
      },
    },
    getAllInvites: {
      type: new GraphQLList(InviteType),
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        const query = `SELECT invite.*, member.username, member.url_avatar
        FROM invite, member WHERE id_user_to = $1 AND id_user_from = member.id ORDER BY created_at DESC`;
        return db.any(query, [args.id])
          .then((data) => data)
          .catch((err) => { console.log('err', err); });
      },
    },
    logIn: {
      type: MemberType,
      args: { username: { type: GraphQLString }, password: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = 'SELECT * FROM member WHERE username=$1';
        return db
          .one(query, [args.username])
          .then((member) => bcrypt.compare(args.password, member.password)
            .then((result) => {
              if (result) {
                return {
                  auth: true,
                  token: jwt.sign({
                    id: member.id,
                    username: member.username,
                    email: member.email,
                    url_avatar: member.url_avatar,
                  }, process.env.secret, { expiresIn: 86400 }),
                };
              }
              return { auth: false, token: null };
            }))
          .catch((err) => console.log(err.message));
      },
    },
  },
});
