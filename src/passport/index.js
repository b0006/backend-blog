const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {
  let User = user;
  let LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function(user, done) {
    done(null, {
      id: user.id,
      login: user.login,
      role: user.role,
      email: user.email,
      active: user.active
    });
  });

  passport.deserializeUser(function(user, done) {
    User.findByPk(user.id).then(function(user) {
      if (user) {
        done(null, user.get());
      } else {
        done('Errors user not found', null);
      }
    });
  });

  passport.use('local-signin', new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password',
      passReqToCallback: true
    },

    function(req, login, password, done) {
      let User = user;

      let isValidPassword = function(userpass, password) {
        return bCrypt.compareSync(password, userpass);
      };
      User.findOne({
        where: {
          login: login
        }
      }).then(function(user) {
        if (!user) {
          return done(null, false, {
            message: 'User not registered'
          });
        }

        if (!isValidPassword(user.password, password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }

        let userinfo = user.get();
        return done(null, userinfo);

      }).catch(function(err) {
        APP.log.error('Error:', err);
        return done(null, false, {
          message: 'Oops. Unknown error'
        });
      });
    }
  ));

  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      const generateHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
      User.findOne({
        where: {
          email: email
        }
      }).then(function(user) {
        if (user) {
          return done(null, false,{
            message: 'That email is already taken'
          });
        } else {
          const userPassword = generateHash(password);
          const data = {
            email: email,
            password: userPassword,
            login: req.body.login
          };
          User.create(data)
            .then((newUser) => {
              if (!newUser) {
                return done(null, false,{
                  message: 'That email is already taken'
                });
              }
              if (newUser) {
                return done(null, newUser, {
                  message: 'Registeretion successful'
                });
              }
            })
            .catch(e => console.log(e));
        }
      });
    }
  ));

};
