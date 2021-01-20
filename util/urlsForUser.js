const urlsForUser = (database, id) => {
  let output = {};
  for (let key in database) {
    database[key].userID === id ? (output[key] = database[key].longURL) : null;
  }
  return output;
};

module.exports = urlsForUser;
