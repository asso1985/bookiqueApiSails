/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  login: function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }

    User.findOne({email: email}, function (err, user) {
      if (!user) {
        return res.json(401, {err: 'invalid email or password 1'});
      }

      User.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'invalid email or password 2'});
        } else {
          res.json({
            user: user,
            token: jwtservice.issue({id : user.id })
          });
        }
      });
    })
  },
  check : function(req, res) {
    var token = req.body.token;
    jwtservice.verify(token, function (err, token) {
      if (err) {
        return res.json(401, {err: 'notvalid'});
      } else {
        return res.json(200, {success: 'valid'})
      }
    });    
  }
};