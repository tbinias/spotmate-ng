(function() {	
	'use strict';	
	
	angular
		.module("SpotMate")
		.controller("LoginController", [ '$rootScope', '$scope', '$location', 'UserService', LoginController]);		
	
	function LoginController($rootScope, $scope, $location, UserService) {
		
		$scope.vm = {};
		$scope.login = function() {
			$rootScope.globalVM.promise = UserService.login($scope.username, $scope.password).then(function(msg) {
				delete($scope.vm.alert);
				$location.path("/");
			}, function(msg) {				
				$scope.vm.alert = {
						type: "ERROR",
						title: "Login error",
						message: "Invalid user or password"
				};
			});
		};
	};
	
})();