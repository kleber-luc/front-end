const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const session = require('express-session');
const crypto = require('crypto');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Substitua pelo URL do frontend
  credentials: true, // Permite cookies de sessão
}));

app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    sameSite: 'lax', // Ou 'none' se usar HTTPS
  },
}));

app.use(express.json());
app.use('/api', routes);

module.exports = app;