(function() {	
	'use strict';
	
	angular.module('SpotMate')
		   .directive('spotmateFormSpot',function() {
			  return {
			    restrict: 'E',			    
			    templateUrl: 'partials/spot/form.html',
			    controller: 'SpotFormController',
			    scope: {
			        model: '='
			    },
			  }
			});
})();