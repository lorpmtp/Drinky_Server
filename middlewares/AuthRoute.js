module.exports = function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.headers.authorization

    console.log(JSON.stringify(req.body) + " " + JSON.stringify(req.query) + " " + JSON.stringify(req.headers))
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    status: false,
                    message: 'Failed to wrong or expired token.'
                })
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded
                next()
            }
        })

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            status: false,
            message: 'Forbidden : No token provided.'
        })

    }

}