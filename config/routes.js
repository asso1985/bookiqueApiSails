/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },
  '/auth/login' : 'AuthController.login',
  '/auth/register' : 'UserController.create',
  '/auth/check' : 'AuthController.check',
  '/auth/checkfbUser' : 'AuthController.checkfbUser',
  '/auth/activate' : 'AuthController.activateUser',
  '/advice/latest' : 'AdviceController.getLatest',
  '/advice/create' : 'AdviceController.mycreate',
  '/advice/getAdviceByBookStart' : 'AdviceController.getAdviceByBookStart',
  '/advice/getAdviceByBookEnd' : 'AdviceController.getAdviceByBookEnd',
  '/advice/getUserAdvices' : 'AdviceController.getUserAdvices',
  '/advice/addLike' : 'AdviceController.addLike',
  '/advice/removeLike' : 'AdviceController.removeLike',
  '/advice/getLikes/:id' : 'AdviceController.getLikes',
  '/askedAdvice/create' : 'AskedAdviceController.create',
  '/askedAdvice/addReply' : 'AskedAdviceController.addReply',
  '/askedAdvice/getAskedAdvices' : 'AskedAdviceController.getAskedAdvices',  
  '/book/get/:id' : 'BookController.get',
  '/follower/check' : 'FollowerController.check',
  '/follower/getFollowers/:followeeId' : 'FollowerController.getFollowers',
  '/follower/getFollowees/:followerId' : 'FollowerController.getFollowees',
  '/followUser' : 'FollowerController.followUser',
  '/unFollowUser' : 'FollowerController.unFollowUser',
  '/user/getUser/:id/:userSessionId' : 'UserController.getUser',
  '/findFacebookFriends' : 'UserController.findFacebookFriends',
  '/feed/getHomeFeed' : 'FeedController.getHomeFeed',
  '/feed/getProfileFeed' : 'FeedController.getProfileFeed',
  '/feed/getFeedDetail/:type:/id' : 'FeedController.getFeedDetail',
  '/notifications/getUserNotifications' : 'NotificationController.getUserNotifications',
  '/notifications/setNotificationAsRead' : 'NotificationController.setNotificationAsRead'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
