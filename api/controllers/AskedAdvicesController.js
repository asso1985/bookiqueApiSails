/**
 * AskedAdvicesController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addReply : function(req, res) {
		console.log('ciao')
		var askedAdviceId = req.body.askedAdviceId;
		var reply = req.body.reply;


		var queryFindAskedAdvice = AskedAdvices.findOne(askedAdviceId).populate("replayAdvices").exec(function callBack(err, r){
			console.log(r[0]);
			var queryReplyBookEnd = ReplyBookEnd.create(reply).exec(function createCB(err, created){
				
				r.replayAdvices.add(created.id);
				r.save(function(err,saved){
				    if (!err) {
				    	return res.json(200, {reply: saved})
				    };
				})				

				
			})


		})
	},	
	getAskedAdvices : function(req, res) {

		




		var queryAskedAdvices = AskedAdvices.find()
			.populate("replayAdvices.bookEnd")
			.populate("replayAdvices.user")
			.populate("user")
			.populate("bookStart")

		queryAskedAdvices.exec(function callBack(err,askedAdvices){
			if (!err) {
				return res.json(200, {askedAdvices})
			} else {
				return res.json(401, {err:err})
			}

		})
	}

};

