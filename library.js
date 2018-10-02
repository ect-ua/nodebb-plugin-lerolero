(function(module) {
	"use strict";
	var path = module.parent.require('path');
	var nconf = module.parent.require('nconf');
	var topics = module.parent.require('../src/topics');
	var user = module.parent.require('../src/user');
	var lerolero = require('lerolero');
	// var topics = require(path.join(nconf.get('base_dir'), 'src/topics'));
	// var controllers = require('./lib/controllers');
	var winston = module.parent.require('winston');
	// var async = module.parent.require('async');
	// var db = module.parent.require('../src/database');
	// var Groups = module.parent.require('./groups');

	
	/*var constants = Object.freeze({
		type: 'oauth2',	// Either 'oauth' or 'oauth2'
		userRoute: 'https://idp.ect-ua.com/auth/realms/master/protocol/openid-connect/userinfo'	// This is the address to your app's "user profile" API endpoint (expects JSON)
	});*/

	var LeroLeroPlugin = {};

	/*if (!constants.name) {
		winston.error('[sso-oauth] Please specify a name for your OAuth provider (library.js:32)');
	} else if (!constants.type || (constants.type !== 'oauth' && constants.type !== 'oauth2')) {
		winston.error('[sso-oauth] Please specify an OAuth strategy to utilise (library.js:31)');
	} else if (!constants.userRoute) {
		winston.error('[sso-oauth] User Route required (library.js:31)');
	} else {
		configOk = true;
	}*/

  // If this filter is not there, the deleteUserData function will fail when getting the oauthId for deletion.
  LeroLeroPlugin.invokeBot = function(params) {
	var notification = params.notification;
	var uids = params.uids;
	var lerolerobotId = nconf.get('bots:lerolero');
	if (!lerolerobotId) {
		winston.error('[lerolero] Falta configurar lerlero');
	}

	if (notification.type === 'mention' && uids.includes(lerolerobotId)) {
		var nid = notification.nid;
		var pid = notification.pid;
		var tid = notification.tid;
		var from = notification.from;
		var bodyLong = notification.bodyLong;

		user.getUserField(from, 'username', function(err, username) {
			if (err) {
				winston.error('[lerolero] Não encontrei uid');
				return;
			}
			
			var content = lerolero();

			var data = {
				tid,
				content,
				uid: lerolerobotId
			};
			topics.reply(data);	

		});
		
	}
  };
	module.exports = LeroLeroPlugin;
}(module));
