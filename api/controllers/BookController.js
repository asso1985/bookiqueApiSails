/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//var googleBooks = require('google-books-search');
var googleBooks = require('../services/google-books-search');

var groupArray = require('group-array');
var _ = require('underscore');

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

				var queryGetAdvices = Advice.find({ where: { bookStart : result[0].id }})					
					.limit(5)
					.sort('createdAt DESC')
					.populate('bookEnd')
					.populate('user')					
					
				


				queryGetAdvices.exec(function callBack(err,advices){
					if (!err) {
						
						
						var advicesGrouped = groupArray(advices, "bookEnd.id", "user.id");	
						var advResults = [];			
						_.map(advicesGrouped, function(advice, key) {
							var advObj = {}
							advObj.users = [];
							var test = Object.keys(advice).map(function (key) {
							  //console.log(advice[key][0].user)
							  advObj.book = advice[key][0];
							  advObj.users.push(advice[key][0].user)
							  return advice[key][0];
							});




							advResults.push(advObj);


						})
						response.advices = advResults;	
						


						return res.json(response);
					} else {
						return res.json(401, {err:err})
					}
			    	
				});	

				
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
							var queryGetAdvices = Advice.find({ where: { bookStart : created.id }})
								.populate('bookEnd')
								.limit(4);
							


							queryGetAdvices.exec(function callBack(err,advices){
								if (!err) {
									response.advices = advices;

									return res.json(response);
								};
						    	
							});								
							
						})
					};

					if (err) {
						return res.json(401, {err:err})
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
	},
	getMostAdvised : function(re, res) {
		var mostAdvisedBooks;

	} 
};


