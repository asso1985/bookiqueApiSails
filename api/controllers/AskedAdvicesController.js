/**
 * AskedAdvicesController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create : function(req, res) {
		if (req.body) {
			var data = req.body;
			AskedAdvices.create(data)
				.exec(function(err, askedAdvice) {
					if (!err) {
						AskedAdvices.find({id:askedAdvice.id})
							.populate('bookStart')
							.populate('user')
							.populate('replayAdvices')
							.exec(function callBack(err, askedAdvicePopulated) {
								if (!err) {
									
									sails.sockets.blast("addedAskedAdvice", askedAdvicePopulated);
									
									return res.json(200, askedAdvice)		
								};
								
							})
					} else {
						return res.json(401, err)
					}
				});
		};
	},
	addReply : function(req, res) {
		var askedAdviceId = req.body.askedAdviceId;
		var reply = req.body.reply;


		var queryFindAskedAdvice = AskedAdvices.findOne(askedAdviceId).populate("replayAdvices").exec(function callBack(err, r){
			console.log(r[0]);
			var queryReplyBookEnd = ReplyBookEnd.create(reply).exec(function createCB(err, created){
				
				r.replayAdvices.add(created.id);
				r.save(function(err,saved){
				    if (!err) {
				    	return res.json(200, {reply: created});
				    } else {
				    	return res.json(401, {err:err});
				    }
				})				

				
			})


		})
	},	
	getAskedAdvices : function(req, res) {

		var queryAskedAdvices = AskedAdvices.find()
			.sort("createdAt DESC")
			.limit(3)
			.populate("replayAdvices.bookEnd")
			.populate("replayAdvices.user")
			.populate("user")
			.populate("bookStart")


		queryAskedAdvices.exec(function callBack(err,askedAdvices){
			if (!err) {				
				return res.json(200, askedAdvices)
			} else {
				return res.json(401, {err:err})
			}

		})
	}

};

