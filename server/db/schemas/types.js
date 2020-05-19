const {
  GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLBoolean,
} = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

exports.MemberType = new GraphQLObjectType({
  name: 'Member',
  type: 'Query',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    url_avatar: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    auth: { type: GraphQLBoolean },
    token: { type: GraphQLString },
  },
});

exports.FriendType = new GraphQLObjectType({
  name: 'Friend',
  type: 'Query',
  fields: {
    id: { type: GraphQLID },
    id_user_to: { type: GraphQLID },
    id_user_from: { type: GraphQLID },
    created_at: { type: GraphQLDateTime },
  },
});

exports.MessageType = new GraphQLObjectType({
  name: 'Message',
  type: 'Query',
  fields: {
    id: { type: GraphQLID },
    id_user_to: { type: GraphQLID },
    id_user_from: { type: GraphQLID },
    text: { type: GraphQLString },
    type: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    username: { type: GraphQLString },
    url_avatar: { type: GraphQLString },
  },
});

exports.CommentType = new GraphQLObjectType({
  name: 'Comment',
  type: 'Query',
  fields: {
    id: { type: GraphQLID },
    id_user: { type: GraphQLID },
    id_song: { type: GraphQLID },
    text: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    username: { type: GraphQLString },
    url_avatar: { type: GraphQLString },
  },
});

exports.SongUserType = new GraphQLObjectType({
  name: 'SongUser',
  type: 'Query',
  fields: {
    id: { type: GraphQLID },
    id_user: { type: GraphQLID },
    id_song: { type: GraphQLID },
    type: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
  },
});

exports.SongType = new GraphQLObjectType({
  name: 'Song',
  type: 'Query',
  fields: {
    id: { type: GraphQLID },
    id_author: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    count_likes: { type: GraphQLInt },
    public: { type: GraphQLBoolean },
    created_at: { type: GraphQLDateTime },
  },
});

exports.InviteType = new GraphQLObjectType({
  name: 'Invite',
  type: 'Query',
  fields: {
    id: { type: GraphQLID },
    id_user_to: { type: GraphQLID },
    id_user_from: { type: GraphQLID },
    link: { type: GraphQLString },
    created_at: { type: GraphQLDateTime },
    username: { type: GraphQLString },
    url_avatar: { type: GraphQLString },
  },
});
