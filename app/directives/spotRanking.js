(function() {	
	'use strict';
	
	angular.module('SpotMate')
		   .directive('spotmateSpotRanking',function() {
			  return {
			    restrict: 'E',			    
			    templateUrl: 'partials/spot/ranking.html',			    			    
			    controller: ['$scope', '$resource', '$filter', 'SpotService', '$routeParams', function($scope, $resource, $filter, SpotService, $routeParams) {
			    	$scope.vm = {};
			    	
			    	if ($routeParams.debug  === "true") {
			    		$scope.vm.debug = true;
			    	}
			    	
		    		$scope.getRanking = function(spotId) {
		    			SpotService.getRanking(spotId).then(function(rankings) {
		    				$scope.vm.rankings = rankings;
		    				$scope.vm.rating = {};
		    				$scope.vm.ratingMax = 5;
		    				// compute overall rank for each day
		    				angular.forEach($filter("groupBy")(rankings, "day"), function(value, day) {
		    					var sum = 0;
		    					for (var i=0; i < value.length; i++) {		    						
		    						sum += value[i].score;
		    					}
		    					$scope.vm.rating[day] = Math.round(($scope.vm.ratingMax/100) * sum/value.length); 
		    					console.log(value);
		    				});
		    			})
		    		};
			    }],
			    scope: {
			        spotId: '='
			    },
			    link: function(scope, iElement, iAttrs) {
			        scope.$watch('spotId', function(id) {
			        	if (id) {
			        		scope.getRanking(id);
			        	}
			        })
			    }
			  }
			});
})();