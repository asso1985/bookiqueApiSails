/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var FB = require('fb');

var randtoken = require('rand-token');

var secret = "khjfkhzkghkzhnyuyiaubtiyt7845673487qvtbcnybyw879";

module.exports = {
	create : function(req, res) {
	
		if (!req.body.fbId) {
			if (req.body.password !== req.body.confirm_password) {
				return res.json(401, {error:"Password doesn\'t match, What a shame!'"})
			};
		}

		User.create(req.params.all()).exec(function (err, user) {
			if (err) {
				return res.json(401, {err: err});
			}
			// If user created successfuly we return user and token as response
			if (user) {

				var userId=user.id;

				var token = randtoken.generate(16);

				token = token+":"+userId;

				Activation.create({token:token, user:userId})
					.exec(function(err, activation){
						if (!err) {
							if (!req.body.fbId) {
								postmarkservice.sendActivationEmail(token, user);	
							};
							return res.json({user: user}); 			
						} else {
							return res.json(401, err);
						}
					})					



				
			}
		});
	},
	findFacebookFriends: function(req, res) {
			
		var currentUserId = req.body.userId;
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
				results.getFacebookUsers.push(1278447152184423);
				User.find({fbId:results.getFacebookUsers}).exec(cb);
			}],
			checkIfIsFollowing : ["getBookiqueUsers", function(cb, resultsBookiqueUsers){
				// console.log("resultsBookiqueUsers")
				console.log(resultsBookiqueUsers.getBookiqueUsers);
				//resultsBookiqueUsers.getBookiqueUsers.push()
				// resultsBookiqueUsers.getBookiqueUsers.push({
				// 	fbId: 1278447152184423,
				//     username: 'Gianni Break 2',
				//     email: 'assadi.omar.1985@gmail.com',
				//     name: 'Gianni',
				//     surname: 'Break 2',
				//     thumb: 'http://graph.facebook.com/1278447152184443/picture?type=large',
				//     registered: '1463691028230',
				//     status: 'pending',
				//     createdAt: '2016-05-19T20:50:28.250Z',
				//     updatedAt: '2016-05-19T20:50:28.250Z',
				//     id: '573e27140cc6c211364c02b6'					
				// })
				async.eachSeries(resultsBookiqueUsers.getBookiqueUsers, function(bookiqueUser, next){
					// console.log(bookiqueUser)
					Follower.find({where : {followee:bookiqueUser.id, follower:currentUserId}})
						.exec(function(err, isFollowee){
							// console.log("isFollowee")
							if (!err) {
								if (isFollowee.length > 0) {
									bookiqueUser.following = true;
								} else {
									bookiqueUser.following = false;
								}

								next();
							};
							
						})
				}, function(err) {
					if (!err) {
						// console.log(resultsBookiqueUsers.getBookiqueUsers);

						var fbUsers = resultsBookiqueUsers.getBookiqueUsers;
				
						return res.json(200, fbUsers);			

					} else {
						return res.json(401, {err:err})
					}
				})
			}]
			


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

