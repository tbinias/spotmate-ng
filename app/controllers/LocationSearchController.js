(function() {
	'use strict';	
	
	angular
		.module("SpotMate")
		.controller("LocationSearchController", [ '$rootScope',  '$scope', '$resource', LocationSearchController]);
	
	
	function LocationSearchController($rootScope, $scope, $resource) {
		$scope.search = {};
		$scope.doSearch = function() {
			var LocationSearch = $resource("resources/locations/search/:query", {query: $scope.search.query})
			$rootScope.globalVM.promise = LocationSearch.get(function(result) {
				$scope.search.result = result._embedded.locations;						
			});			
		}	
	}

})();
