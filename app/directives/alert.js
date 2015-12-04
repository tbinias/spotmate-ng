(function() {	
	'use strict';
	
	angular.module('SpotMate')
		   .directive('spotmateAlert',function() {
			  var uniqueId = 0;
			  return {
			    restrict: 'E',			    
			    template: '<div ng-show="vm.show" ng-class="vm.cssClass">' +
			    			'<h4>{{vm.title}}</h4>' +
			    			'<div ng-show="vm.message">{{vm.message}}</div>' +
			    		  '</div>',
			    controller: ['$scope', function($scope) {
			    	
			    	$scope.vm = {};
			    	
			    	$scope.update = function(alert) {
			    		if (alert) {
			    			$scope.vm = {
			    					show: true,
			    					title: alert.title,
			    					message: alert.message
			    			}			    			
			    			if (alert.type === "INFO") {
				    			$scope.vm.cssClass = "alert alert-info"
				    		} else if (alert.type === "ERROR") {
				    			$scope.vm.cssClass = "alert alert-danger"
				    		}			    			
			    		} else {
			    			$scope.vm = {
			    					show: false
			    			}
			    		}
			    		
			    	}
			    	
			    }],
	            scope: {
	                model: '='
	            },
			    link: function(scope, iElement, iAttrs) {
			        scope.$watch('model', function(value) {
			        	scope.update(value);
			        });			        
			    }
			  }
			});
})();