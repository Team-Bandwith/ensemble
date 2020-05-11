const { db } = require('../pgAdapter');
const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");
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
    member: {
      type: MemberType,
      args: { username: { type: GraphQLString } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM project WHERE username=$1`;
        const values = [args.username];

        return db
          .one(query, values)
          .then(res => res)
          .catch(err => err);
      }
    },
  }
});