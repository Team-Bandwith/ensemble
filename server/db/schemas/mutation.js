const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../pgAdapter');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt } = graphql;
const { 
  MemberType,
  FriendType,
  MessageType,
  CommentType,
  SongUserType,
  SongType,
} = require("./types");

exports.mutation = new GraphQLObjectType({
  name: "RootMutationType",
  type: "Mutation",
  fields: {
    likeSong: {
      type: SongType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = `UPDATE song SET count_likes = count_likes + 1 WHERE id = $1 RETURNING count_likes`;
        return db.any(query, [args.id])
          .then(function(data) { return data })
          .catch(function(err) { console.log('err', err)})
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
        const query = `INSERT INTO member(username, email, password) VALUES ($1, $2, $3) RETURNING id`;
        return bcrypt.hash(args.password, 8)
          .then((hash) => db.one(query, [args.username, args.email, hash]))
          .then(res => {
            return {
              auth: true,
              token: jwt.sign({
                id: res.id,
                username: args.username,
                email: args.email,
                url_avatar: null,
              }, process.env.secret, { expiresIn: 86400 }),
            }
          })
          .catch(err => console.log(err));
      }
    }
  }
});