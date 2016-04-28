/**
 * AdviceController
 *
 * @description :: Server-side logic for managing advice
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getLatest : function(req, res) {
		var myQuery = Advice.find()
			.populate('bookStart')
			.populate('bookEnd')
		
		myQuery.sort('createdAt DESC');

		myQuery.limit(12);

		myQuery.exec(function callBack(err,results){
			return res.json(results);		    
		});
	},
	getAdviceByBookStart : function(req, res) {
		
		var myQuery = Advice.find({ where: { bookStart : req.param('id') }})
			.populate('bookStart')
			.populate('bookEnd')
		
		myQuery.exec(function callBack(err,results){
			return res.json({
	      		advices: results
	    	});		    
		});			
	},
	getAdviceByBookEnd : function(req, res) {
		
		var myQuery = Advice.find({ where: { bookEnd : req.param('id') }})
			.populate('bookStart')
			.populate('bookEnd')
		
		myQuery.exec(function callBack(err,results){
			return res.json({
	      		advices: results
	    	});		    
		});			
	},
	create : function(req, res) {

		var text;

		text = req.body.text || '';

		var response = {};
		
		var addAdvice = function(bookStart, bookEnd) {

			var adv = {
				bookStart : bookStart,
				bookEnd : bookEnd,
				user : req.body.user,
				text : text 
			}

			Advice.create(adv).exec(function createCB(err, created){
				if (!err) {
					response.advice = created;
					return res.json(response);					
				};				

			})
		}	
		
		if (req.body.bookStart) {
			addAdvice(req.body.bookStart, req.body.bookEnd);
		};	
			
	}
};

