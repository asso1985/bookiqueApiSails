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
    var fbId = req.body.fbId;

    console.log(fbId);
    if (fbId) {
      User.findOne({fbId: fbId}, function (err, user) {
        if (!user) {
          return res.json(401, {err: 'This Facebook user does not exist'});
        } else {
          res.json({
            user: user,
            token: jwtservice.issue({id : user.id })
          });          
        }
      })
    } else {
      if (!email || !password) {
        return res.json(401, {err: 'Sorry, email and password are required'});
      }     

      

      User.findOne({email: email}, function (err, user) {
        if (!user) {
          return res.json(401, {err: 'Sorry, invalid email or password'});
        }

        if (user.status != 'approved') {
          return res.json(401, {err: 'Your account is not active, please check in your inbox for a validation email'});
        }

        User.comparePassword(password, user, function (err, valid) {
          if (err) {
            return res.json(403, {err: 'forbidden'});
          }

          if (!valid) {
            return res.json(401, {err: 'invalid password'});
          } else {
            res.json({
              user: user,
              token: jwtservice.issue({id : user.id })
            });
          }
        });
      })      
    }
  },
  checkfbUser : function(req, res) {
    var fbId = req.body.fbId;
    User.findOne({fbId: fbId}, function (err, user) {
      if (user) {
        return res.json(200, {result : true, message : "This Facebook user exist", user : user})
      } else {
        return res.json(401, {result : false, message : "This Facebook user does not exist"})
      }
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
  },
  activateUser : function(req, res) {
    var token = req.body.token;
    Activation.find({token:token}, function(err, act){
        if (!err) {
          console.log(act);
          User.update(act.user, {status:"approved"}, function(err, updated){
            if (!err) {
              return res.json(200, {activated:"true"});
            };
          })
          
        };
    })
    
  }  
};