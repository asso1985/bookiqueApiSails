/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var FB = require('fb');

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
	findFacebookFriends: function(req, res) {
			

		var limit = 10;
		var page = req.body.page;
		var skip = page*10;

		FB.setAccessToken(req.body.token);

		async.auto({
			getFacebookUsers : function(cb) {

				var fbUserIds = []; 

				FB.api('me/friends?fields=id,name,installed', function (response) {
				  	if(!response || response.error) {
				    	return cb(response.error, null);				    
				  	} else {
				  		_.each(response.data, function(item, i){
				  			fbUserIds.push(parseInt(item.id));
				  		})

						fbUserIds = _.uniq(fbUserIds);

						return cb(null, fbUserIds);

				  	}
					
				});	
				
			},
			getBookiqueUsers : ["getFacebookUsers", function(cb, results) {
				User.find({fbId:results.getFacebookUsers}).exec(cb);
			}]


		}, function allTasksDone(err, results) {
			
			if (err) {return res.json(401, {err:err})};


			var fbUsers = results.getBookiqueUsers;

			

			return res.json(200, fbUsers);

		})

	},
	getUser : function(req, res) {
			var userId = req.param("id");
			var userSessionId = req.param("userSessionId");

					
			var queryUser = User.find({where : {id : userId}});
			var queryFollowersCount = Follower.count({followee : userId});
			var queryFolloweesCount = Follower.count({follower : userId});
			var queryAdvicesCount = Advice.count({user : userId});

			if (userSessionId) {
				var queryIsFollowee = Follower.find({where : {follower : userSessionId, followee:userId}});	
			};
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

											if (userSessionId) {
												queryIsFollowee.exec(function callBack(err, isFollowee){
													
													if (isFollowee.length > 0) {
														result.following = true;
													} else {
														result.following = false;
													}

													if (!err) {
														return res.json(200, {result : result})	
													} else {
														return res.json(401, {err : err})
													}
													
												})
											} else {
												return res.json(200, {result : result})
											}

																						
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

