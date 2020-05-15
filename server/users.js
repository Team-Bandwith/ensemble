const usersOnline = [];
const usersInRooms = {};

const logUser = (user) => usersOnline.push(user);

const getOnlineUsers = () => usersOnline;

const addUserToRoom = (user) => usersInRooms[user.room]
  ? usersInRooms[user.room].push(user.user) : usersInRooms[user.room] = [user.user];

const getUsersInRoom = (room) => usersInRooms[room];

module.exports = {
  logUser,
  getOnlineUsers,
  addUserToRoom,
  getUsersInRoom,
};
