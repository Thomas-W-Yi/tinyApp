const checkEmail = (obj, email) => {
  let result = false;
  for (let id in obj) {
    obj[id].email === email ? (result = true) : null;
  }
  return result;
};

module.exports = checkEmail;
