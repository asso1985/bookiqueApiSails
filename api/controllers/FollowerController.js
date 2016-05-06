/**
 * FollowerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	check  : function(req, res) {

	},
	followUser : function(req, res) {
		if (req.body.follower && req.body.followee) {
			var queryCheckFollowing = Follower.find({where : {follower:req.body.follower, followee: req.body.followee}});
			
			queryCheckFollowing.exec(function callBack(err, check){
				if (!err) {
					if (check.length==0) {
						Follower.create(req.body)
							.exec(function callBack(err, following){
								if (!err) {
									return res.json(200, following);
								} else {
									return res.json(401, {err:err});
								}
							})
					} else {
						return res.json(200, check);
					}
				};
			})
		} else {
			return res.json(401, {err:{message:"params missing"}});
		}
	},
	getFollowers : function(req, res) {
		var followeeId = req.param('followeeId');


		var queryFollowers = Follower.find({where : {followee:followeeId}})
			.limit(9)
			.sort('createdAt DESC')
			.populate('follower')
			
		


		queryFollowers.exec(function callBack(err,followers){
			if (!err) {
				var followersResponse = [];
				_.map(followers, function(follower, key){
					var followerObj = {
						username : follower.follower.username,
						email : follower.follower.email,
						id : follower.follower.id,
						thumb : follower.follower.thumb
					}
					followersResponse.push({follower : followerObj, createdAt : follower.createdAt, updatedAt:follower.updatedAt})
				})
				return res.json(followersResponse);	
			}
			
		})
		
	},
	getFollowees : function(req, res) {
		var followerId = req.param('followerId');


		var queryFollowers = Follower.find({where : {follower:followerId}})
			.limit(9)
			.sort('createdAt DESC')
			.populate('followee')
			
		


		queryFollowers.exec(function callBack(err,followees){
			if (!err) {
				var followeesResponse = [];
				_.map(followees, function(follower, key){
					if (follower.followee && follower.follower) {
						var followerObj = {
							username : follower.followee.username,
							email : follower.followee.email,
							id : follower.followee.id,
							thumb : follower.followee.thumb
						}
						followeesResponse.push({follower : followerObj, createdAt : follower.createdAt, updatedAt:follower.updatedAt})						
					};
					
				})
				return res.json(followeesResponse);	
			} else {
				return res.json(401, {err:err})
			}
			
		})
	}

};

