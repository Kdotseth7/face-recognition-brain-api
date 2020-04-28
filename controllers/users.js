const handleUsers = (req, res, db) => {
    db
        .select("*")
        .from('users')
        .then(userData => res.json(userData))
        .catch(err => res.json("OOOPS!! Error"))
};

module.exports = {
    handleUsers: handleUsers
};