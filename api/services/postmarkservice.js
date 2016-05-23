/**
 * get google book by id
 *
 * @description :: Get single google book by id
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */


var postmark = require("postmark");


module.exports.sendActivationEmail = function(token, user) {

  var client = new postmark.Client("6de9743e-e7cb-4833-b0bb-ef3b73ce2b88");


  
  client.sendEmailWithTemplate({
    "From": "info@bookique.it",
    "To": user.email,
    "TemplateId": 641681,
    "TemplateModel": {
      "product_name": "Bookique",
      "name": user.name,
      "action_url": "http://beta.bookique.it/#/confirm/",
      "token": token,
      "username": user.email,
      "sender_name": "Bookique Registration Confirm"
    }
  });
 
  
};