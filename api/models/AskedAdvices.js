/**
 * AskedAdvices.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema : false,
  attributes: {
  	bookStart : {
  		model : 'book'
  	},
  	replayAdvices : {
      collection: 'replybookend'

  	},
  	user : {
  		model : 'user',
      required : true
  	},
    text : {
      type : "text"
    }
    // toJSON: function() {
    //   var obj = this.toObject();
    //   delete obj.user.encryptedPassword;
    //   return obj;
    // } 
  }
};

