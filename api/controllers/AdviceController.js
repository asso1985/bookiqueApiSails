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
			.populate('user')
		
		myQuery.sort('createdAt DESC');

		if (req.param('limit')) {
			myQuery.limit(req.param('limit'));	
		};

		myQuery.exec(function callBack(err,results){
			if (!err) {
				return res.json(200, results);		
			} else {
				return res.json(401, {err:err})
			}
			
		});
	},
	getAdviceByBookStart : function(req, res) {
		
		var myQuery = Advice.find({ where: { bookStart : req.body.bookStartId }})
			.populate('bookEnd')
		
		myQuery.exec(function callBack(err,results){
			if (!err) {
				return res.json({
		      		advices: results
		    	});		    
			} else {
				return res.json(results);		
			}

		});			
	},
	getAdviceByBookEnd : function(req, res) {
		
		var myQuery = Advice.find({ where: { bookEnd : req.param('id') }})
			.populate('bookStart')
		
		myQuery.exec(function callBack(err,results){
			if (!err) {
				return res.json({
		      		advices: results
		    	});		    
			} else {
				return res.json(results);	
			}

		});			
	},
	getUserAdvices : function(req, res) {
		var myQuery = Advice.find({ where: { user : req.body.user }})
			.populate('bookStart')
			.populate('bookEnd')
			.sort('createdAt DESC')
			.limit(req.body.limit)
		
		myQuery.exec(function callBack(err,results){
			if (!err) {
				return res.json({
		      		advices: results
		    	});	
			} else {
				return res.json(results);
			}
	    
		});
	},
	mycreate : function(req, res) {


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
					
					Advice.find({id:created.id})
						.populate("bookStart")
						.populate("bookEnd")
						.populate("user")
						.exec(function callBack(err, createdPopulated) {
							sails.sockets.blast("addedAdvice", createdPopulated); 
							return res.json(createdPopulated);
						})

					

				} else {					

					return res.json(401, {err:err});	
				}

			})


		}	
		
		if (req.body.bookStart) {
			addAdvice(req.body.bookStart, req.body.bookEnd);
		};	
			
	}
};

