/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create : function(req, res) {
		console.log(req.body.fbId)
		if (!req.body.fbId) {
			if (req.body.password !== req.body.confirm_password) {
				return res.json(401, {error:"Password doesn\'t match, What a shame!'"})
			};
		} else {
			console.log('CI ARRIVO')
		}




		User.create(req.params.all()).exec(function (err, user) {
			if (err) {
				return res.json(401, {err: err});
			}
			// If user created successfuly we return user and token as response
			if (user) {
			// NOTE: payload is { id: user.id}

				return res.json({user: user, token: jwtservice.issue({id: user.id})}); 
			}
		});
	},
	update : function(req, res) {
		
	},
	getUser : function(req, res) {
			var userId = req.param("id");
				
			var queryUser = User.find({where : {id : userId}});
			var queryFollowersCount = Follower.count({followee : userId});
			var queryFolloweesCount = Follower.count({follower : userId});
			var queryAdvicesCount = Advice.count({user : userId});

			var result = {};

			queryUser.exec(function callBack(err,user){
				if (!err) {
					
					
					queryFollowersCount.exec(function callBack(err,countFollowers){
						if (!err) {
							queryFolloweesCount.exec(function callBack(err,countFollowees){
								if (!err) {
									queryAdvicesCount.exec(function callBack(err,advicesCount){
										if (!err) {
											result.user = user[0];
											result.followersCount = countFollowers;
											result.followeesCount = countFollowees;
											result.advicesCount = advicesCount;
											return res.json(200, {result : result})											
										};
									})



								};
								
							})							
						};

						
					})

				} else {
					return res.json(500, {err: err});
				}
				
			})
				
			
				
			
	}
};

