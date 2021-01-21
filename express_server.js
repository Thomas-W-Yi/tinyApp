/* eslint-disable camelcase */
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');

// import utility functions from helper
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require('./helpers');

const urlDatabase = {
  b2xVn2: {
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'Xyxyxy',
    totalVisit: 0,
  },
  Bsm5xK: {
    longURL: 'http://www.google.com',
    userID: 'Xyxyxy',
    totalVisits: 0,
    totalVisitors: 0,
    everyVisit: [{ timeStamp: 0, visitor_id: 0 }],
  },
};
const users = {};
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['super secret'],
  })
);
app.use(methodOverride('_method'));

// create /urls get route
app.get('/urls', (req, res) => {
  let cookies = req.session.user_id,
    database = urlsForUser(urlDatabase, cookies),
    keys = Object.keys(database);
  if (keys.length > 0) {
    let templateVars = {
      database,
      cookies,
      users,
    };
    res.render('urls_index', templateVars);
  } else if (cookies) {
    res.redirect('/urls/new');
  } else {
    res.redirect('/login');
  }
});

// this route leads to the page that shorten URLs
app.get('/urls/new', (req, res) => {
  let cookies = req.session.user_id;
  if (cookies) {
    res.render('urls_new', { users, cookies });
  } else {
    res.redirect('/login');
  }
});

// get route for the edit page
app.get('/urls/:id', (req, res) => {
  let cookies = req.session.user_id;
  let key = req.params.id;
  let database = urlsForUser(urlDatabase, cookies);
  if (database[key]) {
    let longURL = database[key];
    res.render('urls_show', {
      cookies,
      users,
      key,
      longURL,
      urlDatabase,
    });
  } else {
    res.redirect('/login');
  }
});

// this post route generates new short: long URL value pair in our urlDatabase
app.post('/urls', (req, res) => {
  let shortURL = generateRandomString(),
    userID = req.session.user_id,
    longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL,
    userID,
  };
  res.redirect(`/urls`);
});

// this post route delete url value pair in our urlDatabase
app.post('/urls/:id', (req, res) => {
  let key = req.params.id,
    cookies = req.session.user_id,
    database = urlsForUser(urlDatabase, cookies);
  if (database[key]) {
    delete urlDatabase[key];
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

// this PUT route updates the long URLs in our urlDatabase
app.put('/urls/:id', (req, res) => {
  let cookies = req.session.user_id,
    database = urlsForUser(urlDatabase, cookies),
    key = req.params.id;
  if (urlDatabase[key]) {
    urlDatabase[key].longURL = req.body.longURL;
    database[key] = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

// this get route takes a short url as parameter and redirect to the long url website
app.get('/u/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  if (!req.session.unique_id) {
    let visitor_id = generateRandomString(),
      timeStamp = new Date().toLocaleString();
    urlDatabase[shortURL].totalVisit = 1;
    urlDatabase[shortURL].totalVisitor = 1;
    req.session.unique_id = visitor_id;
    urlDatabase[shortURL].everyVisit = [{ timeStamp, visitor_id }];
  } else {
    urlDatabase[shortURL].totalVisit++;
    let timeStamp = new Date().toLocaleString(),
      visitor_id = req.session.unique_id;
    urlDatabase[shortURL].everyVisit.push({ timeStamp, visitor_id });
  }
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

// get route for register
app.get('/register', (req, res) => {
  let cookies = req.session.user_id;
  res.render('urls_register', { users, cookies });
});

// post route for register
app.post('/register', (req, res) => {
  let password = req.body.password,
    hashedPassword = bcrypt.hashSync(password, 10),
    email = req.body.email;
  if (!password || !email) {
    res.status(400).send('<h3>Please fill required field</h3>');
  } else if (getUserByEmail(users, req.body.email)) {
    res
      .status(400)
      .send(
        '<h3>Email has already been registered, please use another email!</h3>'
      );
  } else {
    let id = generateRandomString();
    users[id] = { email, hashedPassword, id };
    req.session.user_id = id;
    res.redirect('/urls');
  }
});

// get route for login page
app.get('/login', (req, res) => {
  let cookies = req.session.user_id;
  res.render('urls_login', { users, cookies });
});
// post route for login and set cookie
app.post('/login', (req, res) => {
  let incomingEmail = req.body.email,
    incomingPass = req.body.password,
    userID = getUserByEmail(users, incomingEmail);
  if (userID) {
    if (bcrypt.compareSync(incomingPass, users[userID].hashedPassword)) {
      req.session.user_id = userID;
      res.redirect('/urls');
    } else {
      res.status(403).send('You password is incorrect!');
    }
  } else {
    res.status(403).send('Email is not registered');
  }
});

//post route for logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
