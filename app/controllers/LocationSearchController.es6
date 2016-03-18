'use strict';

import app from '../SpotMateApp.es6';

class LocationSearchController {

    constructor($rootScope, $scope, $resource) {
		$scope.search = {};
		$scope.doSearch = function() {
			var LocationSearch = $resource('resources/locations/search/:query', {query: $scope.search.query})
			$rootScope.globalVM.promise = LocationSearch.get(function(result) {
				$scope.search.result = result._embedded.locations;
			});
		}
	}

}

app.controller('LocationSearchController', [ '$rootScope',  '$scope', '$resource', LocationSearchController]);
