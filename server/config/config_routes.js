var mongoose = require('mongoose');
var passport = require('passport');

module.exports = function(app) {   	

	(function mailer_routes() {
		var MailerCtrl = require('../controllers/mailer');
		app.post('/api/v1/pass/forgot/:username', MailerCtrl.forgot);
		app.post('/api/v1/pass/reset/:token', MailerCtrl.reset);
	})();

	(function password_reset_routes() {
		var PasswordResetCtrl = require('../controllers/reset_password');
		app.post('/api/v1/pass/reset/:token', PasswordResetCtrl.resetPassword);
	})();

	(function authentication_routes() {
		var AccountCtrl = require('../controllers/account');
		var MailerCtrl = require('../controllers/mailer');
			app.post('/api/v1/auth/register', AccountCtrl.register, MailerCtrl.validationEmail);
		app.post('/api/v1/auth/login', AccountCtrl.validated, passport.authenticate('local'), AccountCtrl.login);	
		app.get('/api/v1/auth/logout', AccountCtrl.logout);
		app.get('/api/v1/auth/users', AccountCtrl.query);
		app.get('/api/v1/auth/users/:user_id', AccountCtrl.read);
		app.put('/api/v1/auth/users/:user_id', AccountCtrl.update);
		app.put('/api/v1/auth/users/validate/:user_id', AccountCtrl.validateByConsole);
		app.put('/api/v1/auth/validate/email/:token', AccountCtrl.setEmailValidated)
		app.delete('/api/v1/auth/users/:user_id', AccountCtrl.delete);
	})();

	(function handle_defaults() {
		app.use(function (req,res){
			res.end('404 - Page not found');
		});
	})();
};