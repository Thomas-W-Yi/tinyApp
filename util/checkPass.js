const checkPass = (obj, password) => {
  let result = false;
  for (let id in obj) {
    obj[id].password === password ? (result = true) : null;
  }
  return result;
};

module.exports = checkPass;
