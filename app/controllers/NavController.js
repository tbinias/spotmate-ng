(function() {
	'use strict';	
		
	angular
		.module("SpotMate")
		.controller("NavController", [ '$scope', '$location', 'UserService', "$route", NavController]);		
	
	
	function NavController($scope, $location, UserService, $route) {
		$scope.getClass = function(path) {
		    if ($location.path().substr(0, path.length) == path) {
		      return "active"
		    } else {
		      return ""
		    }
		}
				
		$scope.nav = [];
		angular.forEach($route.routes, function(route, path) {
		    if (route.name) {
		    	$scope.nav.push({
		    		path: path,
		    		name: route.name
		    	});
		    }
		 });
		
		$scope.activeNav = function(navEntry) {
		      return navEntry.path === $location.path();
		}
		
		$scope.isPermitted = function(navEntry) {
			 if (navEntry.name === "Search locations") {
				 return UserService.isLoggedIn();
			 }
			 if (navEntry.name === "Spots") {
				 return UserService.isLoggedIn();
			 }
			 return true;
		}
		
//		$scope.logout = function() {
//			UserService.logout();
//		}
		
	};

})();