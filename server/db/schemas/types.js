const { GraphQLObjectType, GraphQLString } = require('graphql');

exports.MemberType = new GraphQLObjectType({
  name: "Member",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    url_avatar: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    salt: { type: GraphQLString },
  }
});

exports.FriendType = new GraphQLObjectType({
  name: "Friend",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    id_user_to: { type: GraphQLString },
    id_user_from: { type: GraphQLString },
  }
});

exports.MessageType = new GraphQLObjectType({
  name: "Message",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    id_user_to: { type: GraphQLString },
    id_user_from: { type: GraphQLString },
    text: { type: GraphQLString },
    created_at: { type: GraphQLString },
  }
});

exports.CommentType = new GraphQLObjectType({
  name: "Message",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    id_user: { type: GraphQLString },
    id_song: { type: GraphQLString },
    text: { type: GraphQLString },
    created_at: { type: GraphQLString },
  }
});

exports.SongUserType = new GraphQLObjectType({
  name: "SongUser",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    id_user: { type: GraphQLString },
    id_song: { type: GraphQLString },
    created_at: { type: GraphQLString },
  }
});

exports.SongType = new GraphQLObjectType({
  name: "Song",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    id_author: { type: GraphQLString },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    count_likes: { type: GraphQLString },
    created_at: { type: GraphQLString },
  }
});