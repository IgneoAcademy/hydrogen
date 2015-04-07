// Secret variables that are loaded from the environment.
// In development, load the env.js file (gitignored) first.
module.exports = {
  db: process.env.MONGOLAB_URI,
  sessionSecret: process.env.SESSION_SECRET,
  github: {
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  }
};
