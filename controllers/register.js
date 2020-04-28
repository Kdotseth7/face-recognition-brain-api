const handleRegister = (req, res, bcrypt, db) => {
    const { name, email, password } = req.body;
    if ( !name || !email || !password) {
        return res.status(400).json("Incorrect Form Submission");
    }
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
};

module.exports = {
    handleRegister: handleRegister
};