/*
 *  test-node/lib/passport
 */

"use strict";

const passport = require('passport');

passport.serializeUser((user, done)=>{
    done(null, JSON.stringify(user));
});
passport.deserializeUser((userstr, done)=>{
    done(null, JSON.parse(userstr));
});

const local  = require('passport-local');
const Passwd = require('../etc/passwd.json');

passport.use(new local.Strategy(
    { usernameField: 'login',
      passwordField: 'passwd' },
    (login, passwd, done)=>{
        let user = Passwd.find(u=>u.id == login && u.passwd == passwd);
        if (! user) done(null, false);
        else        done(null, { id: ` ${user.id}@local`,
                                 name: user.name,
                                 icon: user.icon         });
    }
));

const hatena = require('passport-hatena');

passport.use(new hatena.Strategy(
    require('../etc/hatena.json'),
    (token, tokenSecret, profile, cb)=>{
        cb(null, { id:   profile.id + '@hatena',
                   name: profile.displayName,
                   icon: profile.photos[0].value    });
    }
));

module.exports = passport;
