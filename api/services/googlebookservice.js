/**
 * get google book by id
 *
 * @description :: Get single google book by id
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */

var googleBooks = require('api/services/google-books-search.js');

module.exports.getGoogleBook = function(id, callback) {
  var book;

  googleBooks.getBook(id, function(error, results) {
      
      if (!error) {
        if (results) {
          book = results; 
        };        
        callback(null, book);
      } else {
        callback(error);
      }
      
  });  
  
};


module.exports.searchGoogleBook = function(q, options, callback) {
 
  
};