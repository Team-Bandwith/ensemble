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
        const query = `SELECT song.*, member.username, member.url_avatar
        FROM song, member
        WHERE id_author = member.id
        AND public
        ORDER BY created_at DESC`;
        return db.any(query)
          .then((data) => data)
          .catch((err) => { console.log('err', err); });
      },
    },
    getSongComments: {
      type: new GraphQLList(CommentType),
      args: { id_song: { type: GraphQLInt } },
      resolve(parentValue, args) {
        const query = `SELECT comment.*, member.username, member.url_avatar FROM comment, member
        WHERE id_song = $1 
        AND id_user = member.id
        ORDER BY created_at ASC`;
        return db.any(query, [args.id_song])
          .then((data) => data)
          .catch((err) => { console.log('err', err); });
      },
    },
    getUserSongs: {
      type: new GraphQLList(SongType),
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        const query = 'SELECT * FROM song WHERE id_author = $1 ORDER BY created_at DESC ';
        return db.any(query, [args.id])
          .then((data) => data)
          .catch((err) => { console.log('err', err); });
      },
    },
    getLikedSongs: {
      type: new GraphQLList(SongType),
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        const query = `SELECT song.* FROM song, song_user
          WHERE id_song=song.id
          AND id_user=$1
          AND type='like'`;
        return db.any(query, [args.id])
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
    getAllInvites: {
      type: new GraphQLList(InviteType),
      args: { id: { type: GraphQLInt } },
      resolve(parentValue, args) {
        const query = `SELECT invite.*, member.username, member.url_avatar FROM invite, member
        WHERE id_user_to = $1
        AND id_user_from = member.id
        AND created_at > now() - interval '6 hour'
        ORDER BY created_at DESC`;
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
    getUserFriends: {
      type: new GraphQLList(MemberType),
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = `SELECT member.* from friend, member
        WHERE id_user_from = $1
        AND id_user_to = ANY(
          SELECT id_user_from FROM friend WHERE id_user_to = $1
        )
        AND id_user_to = member.id`;

        return db.any(query, [args.id])
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
    getUserDMs: {
      type: new GraphQLList(MessageType),
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = `SELECT message.*, member.username, member.url_avatar
        FROM message, member
        WHERE id_user_to = $1
        AND id_user_from = member.id
        AND type = 'dm'
        ORDER BY created_at DESC`;
        return db.any(query, [args.id])
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
    messageHistory: {
      type: new GraphQLList(MessageType),
      args: {
        user_id: { type: GraphQLInt },
        friend_id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = `SELECT message.*, member.username, member.url_avatar
        FROM message, member
        WHERE type = 'dm'
        AND ((id_user_to = $1 AND id_user_from = $2)
        OR (id_user_to = $2 AND id_user_from = $1))
        AND id_user_from = member.id
        ORDER BY created_at ASC`;
        const values = [args.user_id, args.friend_id];
        return db.any(query, values)
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
    getUserId: {
      type: MemberType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = 'SELECT id, username, url_avatar, email, bio from member where id = $1';
        return db.one(query, [args.id])
          .then((res) => res)
          .catch((err) => console.log(err, "error obtaining user's id"));
      },
    },
    getFriendRequests: {
      type: new GraphQLList(MemberType),
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = `SELECT member.* FROM friend, member
        WHERE id_user_to = $1
        AND NOT id_user_from = ANY(SELECT id_user_to FROM friend WHERE id_user_from = $1)
        AND id_user_from = member.id`;
        return db.any(query, [args.id])
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
    checkRequest: {
      type: FriendType,
      args: {
        id_user_to: { type: GraphQLInt },
        id_user_from: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = 'SELECT * FROM friend WHERE id_user_to = $1 AND id_user_from = $2';
        const values = [args.id_user_to, args.id_user_from];
        return db.one(query, values);
      },
    },
    getUserName: {
      type: new GraphQLList(MemberType),
      args: {
        name: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = 'SELECT id, username, url_avatar from member Where levenshtein(username, $1) < char_length(username) ORDER BY levenshtein(username, $1) limit 5';
        return db.any(query, [args.name])
          .then((res) => res)
          .catch((err) => console.log(err, 'cannot search for names'));
      },
    },
    getUserContribs: {
      type: new GraphQLList(SongType),
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = `SELECT song.* from song, song_user
        WHERE song_user.id_user = $1
        AND song_user.id_song = song.id
        AND song_user.type = 'contribution'`;
        return db.any(query, [args.id])
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
    getPrivateFeed: {
      type: new GraphQLList(SongType),
      args: {
        userIDs: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `SELECT song.*, member.username, member.url_avatar
        FROM song, member
        WHERE id_author = ANY($1::int[])
        AND id_author = member.id
        ORDER BY created_at DESC`;
        return db.any(query, [args.userIDs])
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
    getTotalLikes: {
      type: SongType,
      args: {
        id: {type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const query = 'SELECT count_likes from song WHERE id_author = $1';
        return db.any(query, [args.id])
          .then((res) => res.reduce((totalCount, count) => {
            totalCount.count_likes = totalCount.count_likes + count.count_likes;
            return totalCount;
          }))
          .catch((err) => console.log(err));
      },
    },
  },
});
