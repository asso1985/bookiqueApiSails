/**
 * AdviceController
 *
 * @description :: Server-side logic for managing advice
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async'); 

module.exports = {
	getLatest : function(req, res) {		

		var myQuery = Advice.find()
			.populate('bookStart')
			.populate('bookEnd')
			.populate('user')
		
		myQuery.sort('createdAt DESC');

		if (req.body.limit) {
			myQuery.limit(req.body.limit);	
		};

		myQuery.exec(function callBack(err,results){

			if (!err) {
				async.eachSeries(results, function(advice, next){
					if (err) return next(err);

					AdviceLike.find({user:req.body.userId, objectLiked: advice.id})
						.exec(function callBack(err,resultsLike){
							if (!err) {
								if (resultsLike[0]) {
									advice.liked = true;
								};
								next();
							} else {
								return res.json(401, err);
							}
						})
				}, function(err){
					if (!err) {
						return res.json(200, results);		
					} else {
						return res.json(401, err);	
					}
				})				
				
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
				async.eachSeries(results, function(advice, next){
					if (err) return next(err);

					AdviceLike.find({user:req.body.loggedUser, objectLiked: advice.id})
						.exec(function callBack(err,resultsLike){
							if (!err) {
								if (resultsLike[0]) {
									advice.liked = true;
								};
								next();
							} else {
								return res.json(401, err);
							}
						})
				}, function(err){
					if (!err) {
						return res.json(200, {
				      		advices: results
				    	});							
					} else {
						return res.json(401, err);	
					}
				})				
				
			} else {
				return res.json(401, {err:err})
			}
	    
		});
	},
	addLike : function(req, res) {
		var userId = req.body.userId;
		var adviceId = req.body.adviceId;

		AdviceLike.findOrCreate({where:{objectLiked:adviceId, user:userId}})
			.exec(function callBack(err, likeObject){
				if (!err) {					

					
						Advice.findOne({id:adviceId}, function foundAdvice(err, advice){
							var likes;

							if (advice.likes) {
								likes = advice.likes+1;
							} else {
								likes = 1;
							}

							console.log(likes);
							
							Advice.update(adviceId, {likes:likes}, function(errUpdate, updated){
								if (!err) {
									console.log(updated);
									return res.json(200, likeObject);			
								} else {
									return res.json(401, errUpdate);
								}
							})
						})
					
					
				} else {
					return res.json(401, err);
				}
			});
	},
	removeLike : function(req, res) {
		AdviceLike.find({where:{objectLiked:req.body.adviceId, user:req.body.userId}})
			.exec(function(err, found){
				console.log(found);
				// AdviceLike.destroy({
				//   id: found.id
				// }).exec(function (err){
				//   if (err) {
				//     return res.negotiate(err);
				//   }
				//   sails.log('Deleted book with `id: 4`, if it existed.');
				//   return res.ok();
				// });				
			})

	},	
	getLikes : function(req, res) {

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

