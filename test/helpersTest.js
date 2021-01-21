const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail(testUsers, 'user@example.com');
    const expectedOutput = 'userRandomID';
    // Write your assert statement here
    assert(user, expectedOutput);
  });
  it('should return undefined with invalid email', () => {
    const user = getUserByEmail(testUsers, 'user3@example.com');
    const expectedOutput = undefined;
    console.log(user, expectedOutput);
    // Write your assert statement here
    assert(typeof user, typeof expectedOutput);
  });
});
