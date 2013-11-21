var loginApp = angular.module('loginApp', ['ngCookies']);

loginApp.config(function ($routeProvider) {
	$routeProvider.
	when('/auth/register', {
		controller: AuthController,
		templateUrl: '/app/templates/auth/register.html'
	}).
	when('/validate/email/:token', {
		controller: AuthController,
		templateUrl: '/app/templates/auth/email_validated.html'
	}).
	when('/auth/forgot', {
		controller: AuthController,
		templateUrl: '/app/templates/auth/forgot.html'
	}).
	when('/auth/reset/:token', {
		controller: AuthController,
		templateUrl: '/app/templates/auth/reset.html'
	}).
	otherwise({
		redirectTo: '/error'
	});
});
