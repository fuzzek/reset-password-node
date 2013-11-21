var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
var LocalStrategy = require('passport-local').Strategy;

var Account = new Schema({
    email: String,
    role: String,
    company: String,
    address: String,
    contact_person: String,
    phone: String,
    website: String,
    parent: String, //The logged in user which creates the restricted users
    reset_passwoed_token: String,
    validated: {
        role_validated: Boolean,
        email_validated: {
            status: {type: Boolean, default: false},
            token: String
        }
    }
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);	
