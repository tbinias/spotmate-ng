'use strict';

import app from '../SpotMateApp.es6';
import angular from 'angular';

class SpotFormController {

    constructor($rootScope, $scope, $http, $resource, $location, fileReaderService) {
		$scope.vm = {
				mode: "create",
				spot: {
						locations: {},
						windDirections: []
				},
				upload: {}
		};

		$scope.$watch('vm.spot.mapImage', function (value) {
			if (value != null && angular.isDefined(value)) {
				fileReaderService.readAsDataUrl(value, $scope)
                    .then(function(result) {
                	       $scope.vm.mapImagePreview = result;
                    });
			}
	    });

		if (angular.isDefined($scope.model)) {
			$scope.vm.mode = "edit"
			$rootScope.globalVM.promise = $scope.model.then(function(spot) {
				$scope.vm.spot.name = spot.name;
				$scope.vm.spot.id = spot.id;
				$scope.vm.mapImagePreview = spot._links['map'].href.replace("https://", "//");

				var locations = spot._embedded.locations;
				if (locations) {
					for (var i=0; i < locations.length; i++) {
						var location = locations[i];
						$scope.vm.spot.locations[location.id] = location;
					}
				}
				var windDirections = spot.windDirections;
				if (windDirections) {
					for (var i=0; i < windDirections.length; i++) {
						var windDir = windDirections[i];
						$scope.vm.spot.windDirections.push({
							value: windDir.start + ";" + windDir.end,
							scoringFactor: windDir.scoringFactor
						});
					}
				}
			});
		}

		// Any function returning a promise object can be used to load values asynchronously
		$scope.searchLocations = function(val) {
			return $resource("resources/locations/search/:query").get({query: val}).$promise.then(function(result) {
				return result._embedded.locations;
			});
		};

		$scope.addLocation = function($model) {
			if ($model) {
				$scope.vm.spot.locations[$model.id] = $model;
				$scope.vm.selectLocation = null;
			}
		}

		$scope.removeLocation = function(location) {
			if (location) {
				delete($scope.vm.spot.locations[location.id]);
			}
		}

		$scope.addWindDirection = function() {
			$scope.vm.spot.windDirections.push( {
				value: "0;360",
				scoringFactor: 0.5
			});
		}

		$scope.removeWindDirection = function(index) {
			if ($scope.vm.spot.windDirections) {
				$scope.vm.spot.windDirections.splice(index, 1);
			}
		}

		$scope.save = function() {

			var spot = $scope.vm.spot;

			if (spot && spot.name) {
				var spotDTO = {
						name: spot.name,
						locations: []
				}
				if (spot.id) {
					spotDTO.id = spot.id;
				}
				for (var key in spot.locations) {
					if (spot.locations.hasOwnProperty(key)) {
						spotDTO.locations.push(spot.locations[key]);
					}
				}

				if (spot.windDirections && spot.windDirections.length > 0) {
					spotDTO.windDirections = [];
					for (var i=0; i < spot.windDirections.length; i++) {
						var windDir = spot.windDirections[i];
						spotDTO.windDirections.push({
								start: parseInt(windDir.value.split(";")[0]),
								end: parseInt(windDir.value.split(";")[1]),
								scoringFactor: parseFloat(windDir.scoringFactor)
						});
					}
				}

				if (spotDTO.id) {
					$rootScope.globalVM.promise = $resource("resources/spots/:spotId", null, { update: {method: 'PUT'} }).update({ spotId: spotDTO.id }, spotDTO, function(spot) {

						if ($scope.vm.spot.mapImage) {
							var fd = new FormData();
					        fd.append('file', $scope.vm.spot.mapImage);
					        $http.put("resources/spots/" + spot.id + "/images/map", fd, {
					            transformRequest: angular.identity,
					            headers: {'Content-Type': undefined}
					        })
					        .success(function(response){
					        	$location.path("/spot/" + spot.id);
					        });
						} else {
							$location.path("/spot/" + spot.id);
						}
					});
				} else {
					$rootScope.globalVM.promise = $resource("resources/spots").save(spotDTO, function(spot) {
						if ($scope.vm.spot.mapImage) {
							var fd = new FormData();
					        fd.append('file', $scope.vm.spot.mapImage);
					        $http.post("resources/spots/" + spot.id + "/images/map", fd, {
					            transformRequest: angular.identity,
					            headers: {'Content-Type': undefined}
					        })
					        .success(function(response){
					        	$location.path("/spot/" + spot.id);
					        });
						} else {
							$location.path("/spot/" + spot.id);
						}
					});
				}

			}

		}

		$scope.remove = function() {

			var spot = $scope.vm.spot;

			if (spot && spot.id) {
				$rootScope.globalVM.promise = $resource("resources/spots/:spotId").remove({ spotId: spot.id }, function() {
					$location.path("/spots");
				});
			}

		}

		$scope.cancel = function() {
			if ($scope.vm.spot.id) {
				$location.path("/spot/" + $scope.vm.spot.id);
			} else {
				$location.path("/spots");
			}
		}

	}
}

app.controller("SpotFormController", [ '$rootScope', '$scope', '$http', '$resource',
    '$location', 'FileReaderService', SpotFormController]);
