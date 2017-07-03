const express = require('express');
const router = express.Router();
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const sha1 = require('sha1');
const sqlite3 = require('../services/sqlite3');

/**
 * Integration of the passport middleware. We have integrated local strategy by now...
 */
passport.use('local', new LocalStrategy({
        usernameField: 'user',
        passwordField: 'pass'
    },
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure.  Otherwise, return the authenticated `user`.
            sqlite3.findByUsername(username, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (user.password !== sha1(password)) {
                    return done(null, false);
                }
                return done(null, user);
            })
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});

/* POST login page */
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

/* GET logout page */
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
