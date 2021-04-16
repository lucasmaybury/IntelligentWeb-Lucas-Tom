const fetch = require('node-fetch');

exports.sendImageToClient = function (req, res) {
    let headers = {
        method: 'Get',
        headers: {'Content-Type': 'application/json'},
        userAgent: 'localhost:3000'
    }

    fetch(`http://localhost:3001/${req.params.name}`, headers)
        .then(response => response.json())
        .then(image => res.send(image))
        .catch(err => {
            if (err.status === 404) {
                res.sendStatus(404)
            } else {
                res.render("error", {error: err, message: err})
            }
        });
}

exports.saveImageToDB = function (req, res) {

}