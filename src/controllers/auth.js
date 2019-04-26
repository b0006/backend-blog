const passport = require('passport');
const models = require('../database/models');
const bCrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

class Auth {
  static signIn(req, res, next) {
    passport.authenticate('local-signin', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        return res.send({
          message: info.message,
          status: false
        });
      }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send({
          message: 'Authentication successful',
          session: {
            id: req.sessionID,
            user: req.session.passport.user
          },
          status: true
        });
      });
    })(req, res, next);
  }


  static logout(req, res, next) {
    req.session.destroy(function(err) {
      if (err) { return next(err); }
      return res.send({ status: true });
    });
  }

  static signUp(req, res, next) {
    passport.authenticate('local-signup',function(err, user, info){
      if (err) { return next(err); }
      if (!user) {
        return res.send({
          status: false,
          message: info.message
        });
      }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        const generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        const hash = generateHash(user.email);
        let link = `http://${req.get('host')}/verify?hash=${hash}&email=${user.email}`;
        transporter.sendMail({
          to: user.email,
          from: 'SibDev@sibdev.com',
          subject: 'Please confirm your Email account',
          html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${link}>Click here to verify</a>`
        }, (err, body) => {
          if (err) console.log(`Message not send  ${err}`);
          if (body) console.log('Message send on email');
        });
        return res.send({
          message: info.message,
          session: {
            id: req.sessionID,
            user: req.session.passport.user
          },
          status: true
        });
      });
    })(req, res);
  };

  static verify(req, res, next) {
    let isValidPassword = function(userpass, password) {
      return bCrypt.compareSync(password, userpass);
    };
    if (isValidPassword(req.query.hash,req.query.email)) {
      models.user.findOne({
        where: { email: req.query.email }
      })
        .then((user) => {
          user.active = true;
          user.save().catch((err) => console.log(err));
          res.send({
            message: 'email is verified'
          });
        })
        .catch((err) => console.log(err));
    }
    else {
      res.send({
        message: 'Opps email not is verified'
      });
    }
  }
}
module.exports = Auth;
