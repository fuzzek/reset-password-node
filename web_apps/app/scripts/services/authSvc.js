loginApp.factory('authService', function($rootScope, $cookieStore) {
	
	var authSvc = {};

	var _authStatus = {
		logged_in: false,
		errors: false,
		messages: null,
		user: null,
		role: null,
		parent: null
	};

	if ($cookieStore.get('logged_in') == true) {
		var user = $cookieStore.get('user');
		_authStatus.logged_in = true;
		_authStatus.user = user;
		//setAuthStatus(true,false,null,user);
	}

	var setAuthStatus = function(logged_in, errors, messages, user, role, parent) {
		_authStatus = {
			logged_in: logged_in,
			errors: errors,
			messages: messages,
			user: user,
			role: role,
			parent: parent
		};
		authSvc.broadcastChange();
	}

	authSvc.getAuthStatus = function() {
		return _authStatus;
	}

	authSvc.isLoggedIn = function() {
		return _authStatus.logged_in && _authStatus.user;
	}

	authSvc.login = function($scope, $http, $location) {
		var request = $http.post('/api/v1/auth/login', {username: $scope.user.name, password: $scope.user.pass});
    	return request.then(
    		function (response) {
    			console.log(response.data.info);
    			if(response.data.info.role === "root") {
					if ($scope.user.remember_me) {
						$cookieStore.put('logged_in', true);
						$cookieStore.put('user', response.data.info.username);
					}

					setAuthStatus(true,false,null, response.data.info.username, response.data.info.role, response.data.info.parent);
    			}
    			else if ((response.data.info.validated.role_validated !== true) && (response.data.info.validated.email_validated.status !== true)) {
    				setAuthStatus(false,false,"Sorry, your account has not yet been validated", null);
    			} else {
					if ($scope.user.remember_me) {
						$cookieStore.put('logged_in', true);
						$cookieStore.put('user', response.data.info.username);
					}

					setAuthStatus(true,false,null, response.data.info.username, response.data.info.role, response.data.info.parent);
    			}

				$location.path('/dashboard/home');   		
    		},
    		function (response) {
	    		$cookieStore.remove('logged_in'); 
	    		$cookieStore.remove('user');  			    		
	    		
	    		setAuthStatus(false,true,response.data, null, null, null); 			
    			this.user = null;
    		});			
	}

	authSvc.logout = function($scope, $http, $location) {
		var request = $http.get('/api/v1/auth/logout');
	    return request.then(
	    	function (response) {
	    		$cookieStore.remove('logged_in');  		
	    		$cookieStore.remove('user');  			    		

				setAuthStatus(false, false, null, null, null, null);    			
    			$location.path('/');
	    	},
	    	function(response) {
	    		//Handle Error Case
	    	});
	}

	authSvc.register = function($scope, $http, $location) {
	    var request = $http.post('/api/v1/auth/register', {username: $scope.user.name, password: $scope.user.pass1, email: $scope.user.email});
	    return request.then(function (response) {
	    	if (response.data.status === "success") {
	    		$location.path('/');
	    		setAuthStatus(false,false, "Created a login", response.data.info.username);
	    	} else {
				setAuthStatus(false, true, response.data, null);
	    	}

		}, function(response) {
			setAuthStatus(false, true, response.data, null);
		});
	}

	authSvc.createUser = function($scope, $http, $location) {
		console.log($scope.auth.user);
	    var request = $http.post('/api/v1/auth/register', {username: $scope.user.name, password: $scope.user.pass1, parent: $scope.auth.user});
	    return request.then(function (response) {
	    	if (response.data.status === "success") {
	    		$location.path('/users');
	    		setAuthStatus(false,false, "Created a user", response.data.info.username);
	    	} else {
				setAuthStatus(false, true, response.data, null);
	    	}

		}, function(response) {
			setAuthStatus(false, true, response.data, null);
		});
	}

	authSvc.broadcastChange = function() {
		$rootScope.$broadcast('handleChangedAuthStatus');
	}

	return authSvc;
});