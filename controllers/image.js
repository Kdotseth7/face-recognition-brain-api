const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '18adad4d9d8a4d0caf84c4e59028d8f7'
});

const handleApiCall = (req,res) => {
    const { input } = req.body;
    app.models
        .predict(
            Clarifai.FACE_DETECT_MODEL,
            input
        )
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json("Unable to work with API"));
};

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
        .increment('entries', 1)
        .where('id', '=', id)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json("Error! Unable to get entries"));
};

module.exports = {
    handleImage,
    handleApiCall
};