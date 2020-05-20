let usersOnline = {};
const usersInRooms = {};

const logUser = (user) => usersOnline[user.id] = user;

const logOutUser = (sockId) => {
  for(let key in usersOnline) {
    if (usersOnline[key].socketId === sockId) {
      delete usersOnline[key];
    }
  }
};

const getOnlineUsers = () => usersOnline;

const addUserToRoom = (user) => usersInRooms[user.room]
  ? usersInRooms[user.room].push(user.user) : usersInRooms[user.room] = [user.user];

const removeUserFromRoom = (sockId, room) => {
  if (!room) {
    room = Object.keys(usersInRooms)
      .filter((rm) => usersInRooms[rm]
      .some((user) => user.socketId === sockId))[0];
  }
  if (room) {
    const left = usersInRooms[room].filter((user) => user.socketId === sockId)[0];
    usersInRooms[room] = usersInRooms[room].filter((user) => user.socketId !== sockId);
    return { left, room };
  }
};

const getUsersInRoom = (room) => usersInRooms[room];

module.exports = {
  logUser,
  logOutUser,
  getOnlineUsers,
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
};
