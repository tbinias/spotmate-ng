(function() {
	'use strict';	
	
	angular
		.module("SpotMate")
		.controller("RegistrationController", [ '$rootScope', '$scope', '$resource', '$location', RegistrationController]);
	
	
	function RegistrationController($rootScope, $scope, $resource, $location) {
		
		$scope.vm = {
				showForm: true
		};

		$scope.register = function() {
			delete($scope.vm.alert);
			var basePathLen = $location.absUrl().length - $location.url().length;
			var basePath = $location.absUrl().substring(0, basePathLen);
			var Registration = $resource("resources/accounts");
			$rootScope.globalVM.promise=Registration.save({
						email: $scope.email,
						password: $scope.password,
						confirmationURL: basePath + "confirmRegistration"
					}, 
					function() {
						$scope.vm.showForm = false;
						$scope.vm.alert = {
								type: "INFO",
								title: "Thanks for your registration",
								message: "You will recieve an email to confirm your account soon."
						};										
					},
					function(result) {			
						$scope.vm.showForm = true;
						$scope.vm.alert = {
								type: "ERROR",
								title: "Registration request failed"								
						};
						if (result && result.data && result.data.message) {
							$scope.vm.alert.message = result.data.message;
						}
					});
		}	
	}

})();
