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
  let result = [];
  for (let key in database) {
    let output = {};
    if (database[key].userID === id) {
      output.shortURL = key;
      output.longURL = database[key].longURL;
      output.dateCreated = database[key].dateCreated;
      output.totalVisits = database[key].totalVisits;
      output.totalVisitors = database[key].totalVisitors;
      result.push(output);
    }
  }
  return result;
};

module.exports = { getUserByEmail, generateRandomString, urlsForUser };
