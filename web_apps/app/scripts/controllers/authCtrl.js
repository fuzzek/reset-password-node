function AuthController($scope, $route, $http, $location, $routeParams, $cookieStore, authService) {

	// Private functions
	var update_auth = function() {
		$scope.auth = authService.getAuthStatus();
		if ($scope.auth.logged_in == true) {
			$scope.auth.status = 'in';
		} else {
			$scope.auth.status = 'out';
		}	
	};

	$scope.user = null;
	$scope.passwords_same = true;
	update_auth();

	$scope.$on('handleChangedAuthStatus', function() {
		update_auth();
	});

	$scope.login = function() {
		authService.login($scope, $http, $location);		
	}

	$scope.logout = function() {
		console.log("loggin out!")
		$scope.user = null;
		authService.logout($scope, $http, $location)
	}

	$scope.register = function() {
		authService.register($scope, $http, $location);
	}

	$scope.createUser = function() {
		authService.createUser($scope, $http, $location);
	}

	$scope.checkPassword = function() {
		$scope.passwords_same = ($scope.user.pass1 === $scope.user.pass2);
	}

	$scope.addInfo = function(user) {
		$scope.auth = authService.getAuthStatus();
		username = $scope.auth.user;
		$http({
			url: '/api/v1/auth/users/' + username,
			method: "PUT",
			data: user
		}).success(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/manage/user')
		}).error(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/manage/user')
		});			
	}

	$scope.query = function() {
		$scope.auth = authService.getAuthStatus();
		username = $scope.auth.user;
		var request = $http.get('/api/v1/valid/users/' + username);
		return request.then(function(response) {
			$scope.users = eval(eval(response).data.info);
		}, function(response) {

		});
	}
	$scope.user = {};
	$scope.edit = function() {
		var username = $routeParams.username;

		var request = $http.get('/api/v1/auth/users/' + username);
		return request.then(function(response) {
			var user = eval(eval(response).data.info)[0];
			console.log(user);
			$scope.user.name = user.username;
			$scope.user.pass1 = user.password;
			$scope.user.pass2 = user.password;
			console.log($scope.user);

		}, function(response) {
			console.log(response);
		})
	}

	$scope.update = function(user) {
		$http({
			url: '/api/v1/auth/users/' + user.name,
			method: "PUT",
			data: user
		}).success(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users')
		}).error(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users')
		});			
	}

	$scope.changePassword = function(user) {
		var username = $scope.auth.user;
		$http({
			url: 'api/v1/auth/users/' + username,
			method: "PUT",
			data: {password: user.pass1}
		}).success(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/')
		}).error(function (data, status, headers, config) {
			$scope.message = data.message;
			
		});
	}

	$scope.delete = function(user) {
		console.log("here");
		$http({
			url: '/api/v1/auth/users/' + user.username,
			method: 'DELETE',
			data: user
		}).success(function(data, status, headers, config) {
			$scope.message = data.message;

			$route.reload();
		}).error(function(data,status,headers,config) {
			$scope.message = data.message;
			$location.path('/users')			
		})
	}

	$scope.getResetPasswordEmail = function (user) {
		console.log(user.username);
		$http({
			url: '/api/v1/pass/forgot/' + user.username,
			method: 'POST'
		}).success(function (data, status, header, config) {
			$scope.message = data.message;
		}).error(function (data, status, header, config) {
			$scope.message = data.message;
		})
	}

	$scope.resetPassword = function () {
		var token = $routeParams.token;
		console.log(token);
		$http({
			url: '/api/v1/pass/reset/' + token,
			method: 'PUT',
			data: {password: $scope.user.pass1}
		}).success(function (data, status, header, config) {
			$scope.message = data.message;
		}).error(function (data, status, header, config) {
			$scope.message = data.message;
		})
	}

	$scope.setEmailValidated = function () {
		var token = $routeParams.token;
		$http({
			url: '/api/v1/auth/validate/email/' + token,
			method: 'PUT'
		}).success(function (data, status, header, config) {
			$scope.message = data.message;
		}).error(function (data, status, header, config) {
			$scope.message = data.message;
		})
	}

	$scope.addMerchant = function() {
		if(($scope.merchant.establishment_name !== "") || ($scope.merchant.person_name !== "") || ($scope.merchant.phone_number !== ""))
		{
			$http.post('/api/v1/beta/merchants', {establishment_name: $scope.merchant.establishment_name, 
												    person_name: $scope.merchant.person_name,
													phone_number: $scope.merchant.phone_number,
													email: $scope.merchant.email}).success(function(data, status, header, config){
				$scope.merchant.thank_you = true;
				console.log("success");
			}).error(function(data, status, header, config){
				$scope.merchant.error = true;
				console.log("Error");
			});
		}

	}

	$scope.generatePassword = function () {
		if($scope.user.password === "") {
			console.log("Password not specified");
		}
		else {
			$http.put('/api/v1/user/gen/password', {password: $scope.user.password
			}).success(function (data, status, header, config) {
				console.log("Password generated successfully");
			}).error(function (data, status, header, config) {
				console.log("Error generating password");
			})
		}
	}

	$scope.registerUserManually = function () {
		if($scope.user.name === '') {
			console.log("Missing username");
		}
		if($scope.user.password === '') {
			console.log("Missing password");
		}
		if($scope.user.email === '') {
			console.log("Missing email");
		}
		$http.post('/api/v1/register/manually', {username: $scope.user.name,
												password: $scope.user.password,
												email: $scope.user.email
		}).success(function (data, status, header, config) {
			console.log("User created");
		}).error(function (data, status, header, config) {
			console.log("Error creating user")
		})
	}

}