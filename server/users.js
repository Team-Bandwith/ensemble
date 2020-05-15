const users = [];

const addUser = (user) => users.push(user);

const getUsers = (room) => users.filter((user) => user.room === room).map((user) => user.user); 

module.exports = {
  addUser,
  getUsers,
};
