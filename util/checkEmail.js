const checkEmail = (obj, email) => {
  let result;
  for (let id in obj) {
    obj[id].email === email ? (result = id) : null;
  }
  return result;
};

module.exports = checkEmail;
