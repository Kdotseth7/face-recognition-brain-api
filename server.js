const server = require('express');
const bodyParser = require('body-parser');

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
    ]
};

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Root');
});

app.post('/signin', (req, res) => {
    database.map(user => {
        if ((req.body.email === user.email) && (req.body.password === user.password)) {
            res.send("Success!")
        } else {
            res.status(400).json("Error Logging In");
        }
    });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
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

app.listen(3000, () => console.log("App is running on Port 3000"));