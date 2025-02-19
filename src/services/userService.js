let users = [];

const getAllUsers = async () => {
  return users;
};

const getUserById = async (id) => {
  return users.find(user => user.id === id);
};

const createUser = async (userData) => {
  const user = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date()
  };
  users.push(user);
  return user;
};

const updateUser = async (id, userData) => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date()
  };
  return users[index];
};

const deleteUser = async (id) => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;
  
  users.splice(index, 1);
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};