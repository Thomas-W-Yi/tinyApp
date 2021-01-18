const generateRandomString = () => {
  let result = '';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  return result;
};

module.exports = generateRandomString;