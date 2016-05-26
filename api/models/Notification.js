/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema : false,
  attributes: {
  	receiver : {
  		model : 'user',
      required : true
  	},
    sender : {
      model : 'user'
    },
  	objectId : {
  		type : 'string',
      required : true
  	},
    type : {
      type : 'string',
      enum: ['likeAdvice', 'replyAskedAdvice', 'newFollower'],
      required : true
    },
    read : {
      type : 'boolean',
      defaultsTo : false
    }
  }
};

