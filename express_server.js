/* eslint-disable camelcase */
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const generateRandomString = require('./util/random');

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/urls', (req, res) => {
  res.render('urls_index', {
    urlDatabase
  });
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  !urlDatabase[shortURL] ? urlDatabase[shortURL] = req.body.longURL : null;
  res.redirect(`/u/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});