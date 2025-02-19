let posts = [];

const getAllPosts = async () => {
  return posts;
};

const getPostById = async (id) => {
  return posts.find(post => post.id === id);
};

const createPost = async (postData) => {
  const post = {
    id: Date.now().toString(),
    ...postData,
    createdAt: new Date()
  };
  posts.push(post);
  return post;
};

const updatePost = async (id, postData) => {
  const index = posts.findIndex(post => post.id === id);
  if (index === -1) return null;
  
  posts[index] = {
    ...posts[index],
    ...postData,
    updatedAt: new Date()
  };
  return posts[index];
};

const deletePost = async (id) => {
  const index = posts.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  posts.splice(index, 1);
  return true;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};