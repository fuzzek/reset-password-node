var mongoose = require('mongoose');
var Account = mongoose.model('Account');
var _ = require('underscore');
var keygen = require("keygenerator");
var crypto = require('crypto')

var email   = require("../node_modules/emailjs/email");

var server  = email.server.connect({
									    user:       "username", 
									    password:   "password", 
									    host:       "smtp.gmail.com", 
									    ssl:        true
			});

module.exports.validationEmail = function(req, res) {
	Account.find({username: req.body.username}, function (err, user) {
		if(err) {
			res.send(400, { 'status': 'error',
							'message': 'Account not found',
							'info': JSON.stringify(err)
			});
		}
		else {
			user = eval(user)[0];
			var token = keygen._();
			var validation_link = "http://localhost:3000/#/validate/email/" + token;
			Account.findOneAndUpdate(
							{username: user.username}, 
							{$set: {'validated.email_validated.token': token} }, 
							{upsert:true},
							function(err,user) {
								if (err) {
									res.send(400, {	'status': 'error',
												'message': 'Error updating user ' + req.params.user_id,
												'info': JSON.stringify(err)
									});
									console.log(err);
								} 
								else {
									res.send(200, {'status': 'success',
													'message': 'Successfully generated account validation token',
													'info': JSON.stringify(user)
									});

									var message = {
											   	text:    "", 
											   	from:    "Admin <jayram@twyst.in>", 
											   	to:      'Hey'+' '+'<'+	user.email +'>',
											   	subject: "Account validation email",
											   	attachment: 
											   		[{data: "Click here to validate your account " + validation_link, alternative:true}]
									}
									// send the message and get a callback with an error or details of the message that was sent
									server.send(message, function(err, message) { console.log(err || message); });
		
								}
							});

		}
	})
}

module.exports.forgot = function(req, res) {
	Account.find({'username': req.params.username}, function(err, user) {
		if(err) {
			console.log("err");
			res.send(400, { 'status': 'error',
							'message': 'Not a valid user?',
							'info': JSON.stringify(err)
			});
		}
		else {
			user = eval(user)[0];
			var token = keygen._();
			var reset_link = "http://localhost:3000/#/auth/reset/" + token;
			Account.findOneAndUpdate(
							{username: user.username}, 
							{$set: {reset_password_token: token} }, 
							{upsert:true},
							function(err,user) {
								if (err) {
									res.send(400, {	'status': 'error',
												'message': 'Error updating user ' + req.params.user_id,
												'info': JSON.stringify(err)
									});
									console.log(err);
								} 
								else {
									res.send(200, {'status': 'success',
													'message': 'Successfully generated token',
													'info': JSON.stringify(user)
									});

									var message = {
											   	text:    "i hope this works", 
											   	from:    "Admin <jayram@twyst.in>", 
											   	to:      'Hey'+' '+'<'+	user.email +'>',
											   	subject: "Reset password test",
											   	attachment: 
											   		[{data: "Click here to reset your password " + reset_link, alternative:true}]
									}
									// send the message and get a callback with an error or details of the message that was sent
									server.send(message, function(err, message) { console.log(err || message); });
		
								}
							});
			}
	})
}

module.exports.reset = function(req, res) {
	var password = req.body.password;
	crypto.randomBytes(32, function(err, buf) {
            if (err) {
                res.send(400, {'status': 'error','info': JSON.stringify(err)});
            }
            console.log(err);

            var salt = buf.toString('hex');

            crypto.pbkdf2(password, salt, 25000, 512, function(err, hashRaw) {
                if (err) {
                     res.send(400, {'status': 'error','info': JSON.stringify(err)});
                }

                self.set('hash', new Buffer(hashRaw, 'binary').toString('hex'));
                self.set('salt', salt);

				console.log(self);                
            });
    });

	Account.findOneAndUpdate(
							{reset_token: req.params.token}, 
							{$set: {hash: self.hash, salt: self.salt} }, 
							{upsert:true},
							function(err,user) {
								console.log(user.hash);
								if (err) {
									res.send(400, {	'status': 'error',
												'message': 'Error updating user ' + req.params.user_id,
												'info': JSON.stringify(err)
									});
								} else {
									res.send(200, {	'status': 'success',
												'message': 'Successfully updated user',
												'info': JSON.stringify(user)
									});
								}
							});	
}

module.exports.remember = function(req, res) {
	Account.findOneAndUpdate( 	{username: req.params.username},
							 	{$set: {secret: req.body.secret}},
								{upsert: false}, 
								function(err, user) {
									if(err) {
										res.send(400, {'status': 'error',
														'message': 'Error in remember',
														'info': JSON.stringify(err)
										});
									} else {
										res.send(200, {'status': 'success',
														'message': 'Remember set for user',
														'info': JSON.stringify(user)
										});
									}
								});
}