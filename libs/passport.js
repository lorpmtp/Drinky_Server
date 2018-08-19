const passport = require('passport');

passport.use(new FacebookStrategy({
        clientID: '1739450116078139',
        clientSecret: '37c1432e3573ddbd35dae19aefcc678e',
        callbackURL: "http://localhost:8080/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(res.json(JSON.stringify(profile)));
        /*       User.findOrCreate({
                   where: {
                       mail: mail,
                       username: username,
                       password: password
                   }
               }, function(err, user) {
                   if (err) { return done(err); }
                   done(null, user);
               }).spread(function(data, created) {

                   if (created) {
                       res.status(200).json({
                           result: 'User ' + mail + ' added in DB !'
                       })
                   } else {
                       res.status(403)
                       res.json({
                           result: mail + " already exists"
                       })
                   }
               }).catch(function(error) {
                   res.status(500)
                   res.json({
                       result: 'Error while adding the member',
                       errorDB: error,
                       stackError: error.stack
                   })
               });*/
    }
));