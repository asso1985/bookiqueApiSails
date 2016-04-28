/**
 * Book.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema : false,
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    googleId : {
    	type : 'string',
    	required : true
    },
    isbn : {
    	type : 'string' 
    },
    thumb : {
      type : 'string'
    },
    publishedDate : {
      type : 'date'
    },
    publisher : {
      type : 'string'
    },
    description : {
      type : 'text'
    },
    embeddable : {
      type : 'boolean'
    },
    pageCount : {
      type : 'integer'
    },
    categories : {
      type : 'array'
    },
    authors : {
      type : 'array'
    }
  }
};

  
  