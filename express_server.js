/* eslint-disable camelcase */
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

// import function to generate a random string of 6 alphnumeric charactor from util folder
const generateRandomString = require('./util/random');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
const cookies = {};
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// create /urls get route
app.get('/urls', (req, res) => {
  res.render('urls_index', {
    urlDatabase,
    cookies
  });
});

// create a /urls/:id get route
app.get('/urls/:id', (req, res) => {
  let id = req.params.id;
  res.render('urls_show', {
    shortURL: id,
    longURL: urlDatabase[id]
  });
});

// this route leads to the page that shorten URLs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// this post route generates new short: long URL value pair in our urlDatabase
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  !urlDatabase[shortURL] ? urlDatabase[shortURL] = req.body.longURL : null;
  res.redirect(`/u/${shortURL}`);
});

// this post route delete url value pair in our urlDatabase
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// this post route updates the long URLs in our urlDatabase
app.post("/urls/:id", (req, res) => {
  console.log(req.params.id, req.body.longURL);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls');
});

// this get route takes a short url as parameter and redirect to the long url website
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// post route for login and set cookie
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  !cookies['username'] ? cookies['username'] = req.body.username : null;
  console.log(cookies);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});