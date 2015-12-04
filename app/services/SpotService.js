(function() {	
	'use strict';
	
	angular.module('SpotMate')
		   .service('SpotService', ['$resource', '$q', '$filter', 'ForecastService',
	
		function($resource, $q, $filter, ForecastService) {
			return {
				findAll: function() {
					var defer = $q.defer();
					$resource("resources/spots").get().$promise.then(function(result) {
						defer.resolve(result._embedded.spots);	
					});
					return defer.promise;
				},
				
				findById: function(spotId) {
					var defer = $q.defer();
					$resource("resources/spots/:spotId").get({spotId: spotId}).$promise.then(function(result) {
						defer.resolve(result);						
					});
					return defer.promise;
				}, 

				create: function(spot) {
					
					var defer = $q.defer();
					
					if (spot && spot.name) {
						var spotDTO = {
								name: spot.name,
								locations: []
						}
						for (var key in spot.locations) {
							if (spot.locations.hasOwnProperty(key)) {
								spotDTO.locations.push(spot.locations[key]);
							}
						}
						$resource("resources/spots").save(spotDTO).$promise.then(function(result) {
							defer.resolve();
						}).error(function(result) {
							defer.reject();
						}); 											
					} else {
						defer.reject("Spot cannot be null and needs a name");
					}
					
					return defer.promise;
				},
				
				getTideForecast: function(spot, preferedLocation) {
					
					function makeIterator(array){
					    var nextIndex = 0;
					    
					    return {
					       next: function(){
					           return nextIndex < array.length ?
					               {value: array[nextIndex++], done: false} :
					               {done: true};
					       }
					    }
					}
					
					function findTideForecast(locationsIterator, defer) {
						var nextValue = locationsIterator.next();
						if (!nextValue.done) {
							ForecastService.getTideForecast(nextValue.value.providerId, nextValue.value.locationId).then(function(tideForecast) {
								console.log("retrieved tideForecast from '" + nextValue.value.providerId + "' - '" + nextValue.value.locationId);
								defer.resolve(tideForecast);
							}, function(errorResult) {
								findTideForecast(locationsIterator, defer);
							});
						} else {
							defer.reject("No spot location can provide a tide forecast");
						}
					}
					
					var defer = $q.defer();
					
					if (preferedLocation) {
						ForecastService.getTideForecast(preferedLocation.providerId, preferedLocation.locationId).then(function(tideForecast) {
							console.log("retrieved tideForecast from prefered location '" + preferedLocation.providerId + "' - '" + preferedLocation.locationId);
							defer.resolve(tideForecast);
						},
						function(errorResult) {
							var locationsIterator = makeIterator(spot._embedded.locations);
							findTideForecast(locationsIterator, defer);
						});
					}
					
					return defer.promise;
				},
				
				getRanking: function(spotId) {
					var defer = $q.defer();
					
					$resource("resources/spots/:spotId/ranking").get({spotId: spotId}, function(result) {
	    				var rankings = [];
	    				for (var key in result.ranks) {
							if (result.ranks.hasOwnProperty(key)) {
								var day = $filter('date')(key,"EEE dd.MM");
								var rank = result.ranks[key];
								rank.day = day;
								rankings.push(rank);
							}
						}
	    				defer.resolve(rankings);
	    			}, function(errorResult) {
	    				defer.reject(errorResult);
	    			});
					
					return defer.promise;
				}
				
			}
		}
	]);
	
})();
