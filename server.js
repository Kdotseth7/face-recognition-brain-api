const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const users = require('./controllers/users');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => { users.handleUsers(req, res, db) });

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, bcrypt, db) });

app.post('/register', (req, res) => { register.handleRegister(req, res, bcrypt, db) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`App is running on Port ${PORT}`));