const bcrypt = require('bcrypt');
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

        return db
          .one(query, [args.username])
          .then((member) => bcrypt.compare(args.password, member.password)
            .then((result) => result ? member : "Incorrect password")
          )
          .catch((err) => console.log(err.message))
      }
    }
  }
});