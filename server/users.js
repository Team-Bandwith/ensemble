let usersOnline = [];
const usersInRooms = {};

const logUser = (user) => usersOnline.push(user);

const logOutUser = (sockId) => {
  usersOnline = usersOnline.filter((user) => user.socketId !== sockId);
  console.log(usersOnline);
} 

const getOnlineUsers = () => usersOnline;

const addUserToRoom = (user) => usersInRooms[user.room]
  ? usersInRooms[user.room].push(user.user) : usersInRooms[user.room] = [user.user];

const getUsersInRoom = (room) => usersInRooms[room];

module.exports = {
  logUser,
  logOutUser,
  getOnlineUsers,
  addUserToRoom,
  getUsersInRoom,
};
