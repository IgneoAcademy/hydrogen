# Codename Igneo Hydrogen

The classroom web platform for Igneo Academy.

#### Developing code

To run the code in development:

1. Clone / pull from this repo
2. `npm install`
3. Create a `config/env.js` file which will load the appropriate environment variables so Github authentication and other things that require secret information will work. **This file must always remain in the `.gitignore` file.** 

It will look something like the below:

    process.env.MONGOLAB_URI = 'mongodb://...';
    process.env.SESSION_SECRET = '...';
    process.env.GITHUB_ID = '...';
    process.env.GITHUB_SECRET = '...';

