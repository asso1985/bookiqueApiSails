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
  uniqueFbId : false,
  types: {
      uniqueEmail: function(value) {
        return uniqueEmail;
      },
      uniqueFbId : function(value){
        return uniqueFbId;
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
      unique: true,
      uniqueFbId: true  
  	},
   	registered : { 
   		type: "string",
   		defaultsTo : Date.now
   	},
   	birthdate : { 
   		type: "date"
   	},
   	thumb : {
  		type : "string",
      defaultsTo : "/assets/images/thumb.jpg"
  	},
    status: {
    	type: 'string',
    	enum: ['pending', 'approved', 'denied'],
      defaultsTo : "pending"
    }  	
  },

  beforeCreate : function (values, next) {
    console.log("before create", values.fbId)
    if (!values.fbId) {
      console.log("before create inside", values.fbId)
      bcrypt.genSalt(10, function (err, salt) {
        if(err) return next(err);

        bcrypt.hash(values.password, salt, function (err, hash) {
            if(err) return next(err);
            values.encryptedPassword = hash;
            next();
        })
      })
    } else {
      next();
    }
  },
  beforeValidate: function(values, cb) {
        if (values.fbId) {
          console.log("before validate inside fb", values.fbId)
          User.findOne({fbId: values.fbId, email: values.email}).exec(function (err, record) {
              uniqueFbId = !err && !record;
              uniqueEmail =  !err && !record;
              cb();
          });
        } else {
          User.findOne({email: values.email}).exec(function (err, record) {

              uniqueFbId = !err && !record;
              uniqueEmail = !err && !record;
              
              cb();  
                            
          }); 
        }         
        

  },  
  comparePassword : function (password, user, cb) {
    console.log('calling compare pwd')
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