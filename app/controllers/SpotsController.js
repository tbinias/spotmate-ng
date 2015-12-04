(function() {
	'use strict';	
	
	angular
		.module("SpotMate")
		.controller("SpotsController", [ '$rootScope', '$scope', 'SpotService', SpotsController]);
	
	
	function SpotsController($rootScope, $scope, SpotService) {			
		$rootScope.globalVM.promise = SpotService.findAll().then(function(spots) {
			$scope.spots = spots;
		});
	}

})();
