const server = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');

const app = server();

const database = {
    users: [
        {
            id: 123,
            name: 'Harry',
            email: 'harry@email.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: 124,
            name: 'Sally',
            email: 'sally@email.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: 987,
            hash: '',
            email: 'harry@email.com'
        }
    ]
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Root');
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    let userFound = false;
    database.users.forEach(user => {
        if ((user.email === email) && (user.password === password)) {
            userFound = true;
            return res.json("Success!");
        }
    });
    if (!userFound)
        res.status(400).json("Error! Can't Login");
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
    database.users.push({
        id: database.users[database.users.length - 1].id +1,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let userFound = false;
    database.users.forEach(user => {
        if (user.id.toString() === id) {
            userFound = true;
            return res.json(user);
        }
    });
    if (!userFound)
        res.status(404).json("Error! User not found");
});

app.put('/image', (req, res) => {
    let { id } = req.body;
    let userFound = false;
    database.users.forEach(user => {
        if (user.id.toString() === id) {
            userFound = true;
            user.entries++;
            res.json(user.entries);
        }
    });
    if (!userFound)
        res.status(404).json("Error! User not found");
});

/*// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});*/

app.listen(3000, () => console.log("App is running on Port 3000"));