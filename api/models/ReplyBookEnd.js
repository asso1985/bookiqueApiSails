/**
 * ReplyBookEnd.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema : false,
  attributes: {
  	bookEnd : {
  		model : 'book'
  	},
  	user : {
  		model : 'user',
      	required : true
  	},
    text : {
      type : "text"
    }
  }
};

