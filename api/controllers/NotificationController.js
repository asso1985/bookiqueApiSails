/**
 * NotificationController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUserNotifications : function(req, res) {
		Notification.find({where:{receiver : req.body.userId}, limitTo : 5, skip:0})
			.populate('receiver')
			.populate('sender')
			.sort("createdAt DESC")
			.exec(function callback(err, found){	
				var result = {
					data : []
				};
				var unreadCounter = 0;
				found.forEach(function(item ,i){
					if (item.sender) {
						if (!item.read) {
							unreadCounter++;
						};
						result.data.push(item);
					};
				})

				result.unread = unreadCounter;							
				return res.json(200, result);
			})
	},
	setNotificationAsRead : function(req, res) {
		Notification.update(req.body.id, {read:true})
			.exec(function callback(err, done){
				if (!err) {
					return res.json(200, done);
				};
			})
	}
};

