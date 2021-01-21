const getUserByEmail = (obj, email) => {
  let result;
  for (let id in obj) {
    obj[id].email === email ? (result = id) : null;
  }
  return result;
};

const generateRandomString = () => {
  let result = '';
  const alphanumeric =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += alphanumeric.charAt(
      Math.floor(Math.random() * alphanumeric.length)
    );
  }
  return result;
};

const urlsForUser = (database, id) => {
  let output = {};
  for (let key in database) {
    database[key].userID === id ? (output[key] = database[key].longURL) : null;
  }
  return output;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser };
