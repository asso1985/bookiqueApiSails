/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create : function(req, res) {
		if (req.body.password !== req.body.confirm_password) {
			return res.json(401, {error:"Password doesn\'t match, What a shame!'"})
		};

		

		User.create(req.params.all()).exec(function (err, user) {
		
			if (err) {
				return res.json({err: err});
			}
			// If user created successfuly we return user and token as response
			if (user) {
			// NOTE: payload is { id: user.id}

				res.json({user: user, token: jwtservice.issue({id: user.id})}); 
				//res.json({user: user, token: "jldzsfhsyvbiuys38w5v893b7vwshfwhjh"});
			}
		});
	}, 
	update : function(req, res) {
		
	}
};

