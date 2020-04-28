const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'test',
        database : 'smart-brain-app'
    }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    db
        .select("*")
        .from('users')
        .then(userData => res.json(userData))
        .catch(err => res.json("OOOPS!! Error"))
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    db
        .select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db
                    .select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json("Unable to get user"));
            } else {
                res.status(400).json("Wrong credentials entered");
            }
        })
        .catch(err => res.status(400).json("Error! Wrong credentials entered"));
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash,
            email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Unable to Register'));
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db
        .select('*')
        .from('users')
        .where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(404).json("User not Found!")
            }
        })
        .catch(err => res.status(404).json("Error getting user"));
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
        .increment('entries', 1)
        .where('id', '=', id)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json("Error! Unable to get entries"));
});

app.listen(3000, () => console.log("App is running on Port 3000"));