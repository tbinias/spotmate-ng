(function() {
	'use strict';
	
	angular
		.module("SpotMate")
		.controller("WeatherForecastController", [ '$rootScope', '$scope', '$routeParams', 'ForecastService', WeatherForecastController]);			
	
	function WeatherForecastController($rootScope, $scope, $routeParams, ForecastService) {
		$scope.vm = {
				locationId: $routeParams.locationId,
				providerId: $routeParams.providerId
		};
		
		
		$rootScope.globalVM.promise = ForecastService.getWeatherForecast($routeParams.providerId, $routeParams.locationId).then(function(forecast) {						
			$scope.vm.location = forecast.location;			
		}, function(errorResult) {
			$scope.vm.location = null;
			$scope.vm.error = "Got '" + errorResult.error.status + "' when retrieving forecast.";				
		});		
	};

})();