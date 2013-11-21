var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var settings = require('./settings');

module.exports = function(app) {
	app.configure(function() {
		app.use(express.logger('dev'));
		app.use(express.bodyParser());


		app.use(express.cookieParser('some secret'));
		app.use(express.session());
		
		app.use(express.methodOverride());
	    app.use(passport.initialize());
        app.use(passport.session());

		app.use(express.static(__dirname + '/../../web_apps/'));
	    app.use(app.router);
		
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));	

		var Account = require('../models/account'); 
	    passport.use(new LocalStrategy(Account.authenticate()));
	    passport.serializeUser(Account.serializeUser());
	    passport.deserializeUser(Account.deserializeUser());		
	});

	// Connect to the database
	mongoose.connect(settings.values.db)
};
