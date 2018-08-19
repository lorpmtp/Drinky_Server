module.exports = function(req, res, next) {

    if (req.route.path === '/signin' || req.route.path === '/signup') {
        if (!tools.checkEmail(req.body.email) && req.body.email !== undefined && req.body.password !== undefined) {
            return res.status(403).send({
                status: false,
                message: 'Invalid Request.'
            })
        } else {
            return next()
        }
    }

}