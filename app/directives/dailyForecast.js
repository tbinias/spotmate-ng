(function() {	
	'use strict';
	
	angular
		.module("SpotMate")
		.controller("DailyForecastController", [ '$rootScope', '$scope', '$filter', '$timeout', 'ForecastService', 'SpotService', DailyForecastController]);
	
	function DailyForecastController($rootScope, $scope, $filter, $timeout, ForecastService, SpotService) {
		$scope.vm = {
    			issued: "n.a",
				weatherForecast: null,							
				tideChart: {
					show: false,
					data: {},
					series: ["Tide"],
					labels: {},
					options: {
						animation: false,
						maintainAspectRatio: false,
					}					
				},
				error: null
		};
    	
    	$scope.retrieveForecast = function(location, spot) {
    		if (angular.isDefined(location)) {
				$rootScope.globalVM.promise = ForecastService.getWeatherForecast(location.providerId, location.locationId).then(function(forecast) {
					$scope.vm.weatherForecast = forecast;
					if (forecast.issueTime) {
						$scope.vm.issued = $filter('date')(forecast.issueTime,"dd.MM.yyyy HH:mm");
					} else {
						$scope.vm.issued = "n.a.";
					}							
				}, function(errorResult) {
					$scope.vm.weatherForecast = null;
					$scope.vm.error = "Got '" + errorResult.error.status + "' when retrieving forecast.";				
				});
				
				var tideProvider = null;
				if (angular.isDefined(spot)) {
					tideProvider = SpotService.getTideForecast(spot, location);
				} else {
					tideProvider = ForecastService.getTideForecast(location.providerId, location.locationId);
				}
	
				
				$scope.vm.tideChart.show = true;
				$timeout(function () {
					tideProvider.then(function(tideForecast) {
						$scope.vm.tideChart.labels = {};
						$scope.vm.tideChart.data = {};
						for (var day in tideForecast) {
							if (tideForecast.hasOwnProperty(day)) {
								$scope.vm.tideChart.labels[day] = tideForecast[day].x;
								$scope.vm.tideChart.data[day] = [tideForecast[day].y];
							}
						}
					}, function(errorResult) {
						$scope.vm.tideChart.show = false;
						$scope.vm.tideChart.data = {};
						$scope.vm.tideChart.labels = {};						
					});
				});
				
    		}
		}	
		
		$scope.getWeatherIconURL = ForecastService.getWeatherIconURL;
		
		$scope.getPrecipitationBackgroundColor = function(forecast) {
			var precipitation = forecast.precipitation;
			if (precipitation > 0) {
				var percent = 100/5 * precipitation;
				if (percent > 100) {
					percent = 100;
				}
				var value = 200 + (100/50 * (percent / 100));
				var value2 = 100 - (percent / 2);
				return "hsl(" + value + ",100%," + value2 + "%)";
			}
			return "#fff";			
		}
	};
	
	angular.module('SpotMate')
		   .directive('spotmateDailyForecast',function() {
			  return {
			    restrict: 'E',			    
			    templateUrl: 'partials/forecasts/daily.html',
			    controller: 'DailyForecastController',
			    scope: {
			        location: '=',
			        spot: '='
			    },
			    link: function(scope, iElement, iAttrs) {
			    	scope.$watch('location', function(value) {
			        	scope.retrieveForecast(scope.location, scope.spot);
			        });
			    	scope.$watch('spot', function(value) {
			        	scope.retrieveForecast(scope.location, scope.spot);
			        });			    	
			    }
			  }
			});
})();