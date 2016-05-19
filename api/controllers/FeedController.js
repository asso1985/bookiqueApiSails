 /**
 * FeedController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getHomeFeed : function(req, res) {


		var feedResponse = [];


		var queryAdvices = Advice.find()
			.populate('bookStart')
			.populate('bookEnd')
			.populate('user');


		
		queryAdvices.sort('createdAt DESC');

		// if (req.body.limit) {
		// 	myQuery.limit(req.body.limit);	
		// };

		queryAdvices.exec(function callBack(err,results){

			if (!err) {
				async.eachSeries(results, function(advice, next){
					if (err) return next(err);
					advice.type = "advice"; 
					AdviceLike.find({user:req.body.userId, objectLiked: advice.id})
						.exec(function callBack(err,resultsLike){
							if (!err) {
								if (resultsLike[0]) {
									advice.liked = true;
								};
								feedResponse.push(advice);											
								next();
							} else {
								return res.json(401, err);
							}
						})
				}, function(err){
					if (!err) {

						var queryAskedAdvices = AskedAdvices.find()
							.sort("createdAt DESC")
							.populate("replayAdvices.bookEnd")
							.populate("replayAdvices.user")
							.populate("user")
							.populate("bookStart");

						queryAskedAdvices.exec(function callBack(err,askedAdvices){
							if (!err) {			
								
								askedAdvices.forEach(function(item, i){
									item.type = "askedAdvice";									
									feedResponse.push(item);
								})	

								return res.json(200, feedResponse);
							} else {
								return res.json(401, {err:err})
							}

						}) 
						//return res.json(200, results);		
					} else {
						return res.json(401, err);	
					}
				})				
				
			} else {
				return res.json(401, {err:err})
			}
			
		});		
	}

};

