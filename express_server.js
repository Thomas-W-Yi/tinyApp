/* eslint-disable camelcase */
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// import utility functions from util folder
const generateRandomString = require('./util/random');
const randomID = require('./util/userID');
const checkEmail = require('./util/checkEmail');

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};
const cookies = {};
const users = {
  y1: {
    id: 'yi',
    email: 'thomas.w.yee@gmail.com',
    password: '123',
  },
};
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// create /urls get route
app.get('/urls', (req, res) => {
  let templateVars = {
    urlDatabase,
    cookies,
    users,
  };
  res.render('urls_index', templateVars);
});

// create a /urls/:id get route
app.get('/urls/:id', (req, res) => {
  let id = req.params.id;
  res.render('urls_show', {
    shortURL: id,
    longURL: urlDatabase[id],
  });
});

// this route leads to the page that shorten URLs
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// this post route generates new short: long URL value pair in our urlDatabase
app.post('/urls', (req, res) => {
  let shortURL = generateRandomString();
  !urlDatabase[shortURL] ? (urlDatabase[shortURL] = req.body.longURL) : null;
  res.redirect(`/u/${shortURL}`);
});

// this post route delete url value pair in our urlDatabase
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// this post route updates the long URLs in our urlDatabase
app.post('/urls/:id', (req, res) => {
  console.log(req.params.id, req.body.longURL);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

// this get route takes a short url as parameter and redirect to the long url website
app.get('/u/:shortURL', (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// post route for login and set cookie
app.post('/login', (req, res) => {
  res.redirect('/register');
});

//post route for logout
app.post('/logout', (req, res) => {
  delete users[cookies.user_id];
  res.redirect('/register');
});

// get route for register
app.get('/register', (req, res) => {
  res.render('urls_register', { users, cookies });
});

// post route for register
app.post('/register', (req, res) => {
  console.log(req.body, checkEmail(users, req.body.email));
  if (!req.body.password || !req.body.email) {
    res.status(400).send('<h3>Please fill your email and password</h3>');
  } else if (checkEmail(users, req.body.email)) {
    res
      .status(400)
      .send(
        '<h3>Email has already been registered, please use another email!</h3>'
      );
  } else {
    let id = randomID();
    users[id] = { id: id, email: req.body.email, password: req.body.password };
    cookies['user_id'] = id;
    res.cookie('user_id', id);
    console.log(users, cookies);
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
