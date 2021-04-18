const fetch = require('node-fetch');

exports.sendImageToClient = function (req, res) {
    let headers = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        userAgent: 'localhost:3000'
    }

    fetch(`http://localhost:3001/${req.params.name}`, headers)
        .then(response => response.json())
        .then(image => res.send(image))
        .catch(err => {
            console.log(err);
            if (err.status === 404) {
                res.sendStatus(404)
            } else {
                res.render("error", {error: err, message: err})
            }
        });
}

exports.saveImageToDB = function (req, res) {
    let headers = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        userAgent: 'localhost:3000',
        body: JSON.stringify(req.body)
    }

    fetch(`http://localhost:3001`, headers)
        .then(response => {
            if(response.status !== 201) { throw new Error('error saving to database') }
            res.send(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).render("error", {error: err, message: err});
        });
}