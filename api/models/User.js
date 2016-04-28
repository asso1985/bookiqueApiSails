/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {
  schema : false, 
  uniqueEmail: false,
  types: {
      uniqueEmail: function(value) {
          return uniqueEmail;
      }
  },
  attributes: {
  	name : {
  		type : "string",
  		required : true
  	},
    surname : {
  		type : "string",
  		required : true
  	},
    email : {
  		type : "email",
      required : true,      
  		unique : true,
      uniqueEmail: true        
  	},
   	encryptedPassword : {
  		type : "string"
  	},
   	username : {
  		type : "string",
  		unique : true
  	},
   	fbId : {
  		type : "integer",
      unique: true
  	},
   	registered : { 
   		type: "string",
   		defaultsTo : Date.now
   	},
   	birthdate : { 
   		type: "date"
   	},
   	thumb : {
  		type : "string"
  	},
    state: {
    	type: 'string',
    	enum: ['pending', 'approved', 'denied']
    }  	
  },

  beforeCreate : function (values, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);

      bcrypt.hash(values.password, salt, function (err, hash) {
          if(err) return next(err);
          values.encryptedPassword = hash;
          next();
      })
    })
  },
  beforeValidate: function(values, cb) {
        User.findOne({email: values.email}).exec(function (err, record) {
            uniqueEmail = !err && !record;
            cb();
        });
  },  
  comparePassword : function (password, user, cb) {
    bcrypt.compare(password, user.encryptedPassword, function (err, match) {

      if(err) cb(err);
      if(match) {
        cb(null, true);
      } else {
        cb(err);
      }
    })
  }  

};