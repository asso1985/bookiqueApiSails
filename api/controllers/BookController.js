/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var googleBooks = require('google-books-search');
var googleBooks = require('../services/google-books-search');
// var _getGoogleBook = function(id, callback) {
// 	googleBooks.getBook(id, function(error, results) {
// 		var book = null;		
// 	    if (!error) {
// 	    	if (results) {
// 	    		book = results;	
// 	    	};	    	

// 	    	callback(book);
// 	    } else {
// 	    	console.log(error);
// 	    }
	    
// 	});
// }
 
module.exports = {
	get : function(req, res) {
		var id = parseInt(req.param('id'));
		if (!isNaN(id)) {
			var id = req.param('id');
			var myQuery = Book.find({ where: { id : id }});
		} else if (req.param('id')) {
			var googleId = req.param('id');
			var myQuery = Book.find({ where: { googleId : googleId }});
		}
		
		
		myQuery.exec(function callBack(err,result){
			var response = {};
			if (result.length > 0) {
				response.book = result[0];
				console.log(response.book.id);
				return res.json(response);
			} else {
				// _getGoogleBook(req.param('id'), function(book){
				// 	if (book) {

				// 		Book.create(book).exec(function createCB(err, created){
				// 			response.book = book;
				// 			return res.json(response);
				// 		})
				// 	};
				// })
				googlebookservice.getGoogleBook(req.param('id'), function(err, book){

					if (book) {

						Book.create(book).exec(function createCB(err, created){
							response.book = created;
							console.log(response.book.id);
							return res.json(response);
						})
					};
				})		
			}    
		});
	},
	search : function(req, res) {

		var searchResults;

		googleBooks.search(req.param('q'), {limit:req.param('limit')}, function(error, googleResults){
			if (!error) {
				Book.find({where: {title : {startsWith : req.param('q')}}}).exec(function callBack(err, results){
					googleResults.forEach(function(googleItem, i){
						results.forEach(function(mongoItem, i2){
							
							if (mongoItem.googleId == googleItem.id) { // Removing the duplicated result									
								googleResults.splice(i,1);
							};
							
						})
					})
					searchResults = results.concat(googleResults)
					return res.json({
						results : searchResults
					})
				})
			} else {
				console.log('Error', error);
			}
		})
	}
};


