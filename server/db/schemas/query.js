const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../pgAdapter');
const { GraphQLObjectType, GraphQLString, GraphQLID } = require("graphql");
const { 
  MemberType,
  FriendType,
  MessageType,
  CommentType,
  SongUserType,
  SongType,
} = require("./types");

exports.query = new GraphQLObjectType({
  name: "RootQueryType",
  type: "Query",
  fields: {
    logIn: {
      type: MemberType,
      args: { username: { type: GraphQLString }, password: { type: GraphQLString }},
      resolve(parentValue, args) {
        const query = `SELECT * FROM member WHERE username=$1`;
        console.log(args);
        return db
          .one(query, [args.username])
          .then((member) => bcrypt.compare(args.password, member.password)
            .then((result) => {
              if (result) {
                return {
                  auth: true,
                  username: member.username,
                  email: member.email,
                  token: jwt.sign({ id: member.id }, process.env.secret, { expiresIn: 86400 }),
                }
              }
              return { auth: false, token: null };
            })
          )
          .catch((err) => console.log(err.message))
      }
    }
  }
});