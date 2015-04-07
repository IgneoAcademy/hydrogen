var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var secrets = require('./secrets.js');
var User = require('../models/User');

// Passport serialization and deserialization of user ID into user object
// This is done so only the user ID is stored in the session instead of the
// whole user object, which may become very large. 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/* Code from Hackathon Starter (https://github.com/sahat/hackathon-starter) */
passport.use(new GitHubStrategy(secrets.github, function(req, accessToken,
  refreshToken, profile, done) {
  if (req.user) {
    // User already been logged in; connecting Github account.
    User.findOne({ github: profile.id }, function(err, existingUser) {
      if (existingUser) { // Github user already exists in our database
        req.flash('errors', { msg: 'There is already a GitHub account' +
          ' that belongs to you. Sign in with that account or delete it,' + 
          ' then link it with your current account.' });
        done(err);
      } else { 
        // User is logged in, but hasn't connected Github yet.
        // Update user with Github information.
        User.findById(req.user.id, function(err, user) {
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.website = user.profile.website || profile._json.blog;
          user.save(function(err) {
            req.flash('info', { msg: 'GitHub account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    // User is not logged in; logging in with Github.
    User.findOne({ github: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      // New user! Fill in profile information with info from Github.
      User.findOne({ email: profile._json.email },
        function(err, existingEmailUser) {
          if (existingEmailUser) { // A user already exists with this email.
            req.flash('errors', { msg: 'There is already an account using' +
              ' this email address. Sign in to that account and link it with' +
              ' GitHub manually from Account Settings.' });
            done(err);
          } else { // Create a new user. 
            var user = new User();
            user.email = profile._json.email;
            user.github = profile.id;
            user.tokens.push({ kind: 'github', accessToken: accessToken });
            user.profile.name = profile.displayName;
            user.profile.picture = profile._json.avatar_url;
            user.profile.location = profile._json.location;
            user.profile.website = profile._json.blog;
            user.save(function(err) {
              done(err, user);
            });
          }
        }
      );
    });
  }
}));

exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/welcome');
};

// exports.isLoggedIn = function(req, res, next) {
//   if(req.user) {
//     return next();
//   }
//   res.redirect('/welcome', {flash: {error: "Please log in first!"}});
// };