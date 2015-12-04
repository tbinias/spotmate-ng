'use strict';

require("angular");

angular.module("SpotMate").controller("ConfirmRegistrationController",
        [ '$rootScope', '$scope', '$resource', '$routeParams', ConfirmRegistrationController ]);

function ConfirmRegistrationController($rootScope, $scope, $resource, $routeParams) {
    $scope.result = {
        isApproved : false
    }

    var ConfirmRegistration = $resource("resources/accounts/:accountId/approve", null, {
        'update' : {
            method : 'PUT'
        }
    });
    $rootScope.globalVM.promise = ConfirmRegistration.update({
        accountId : $routeParams.accountId
    }, {
        token : $routeParams.token
    }, function() {
        $scope.result.message = "Your account is now active."
        $scope.result.isApproved = true;
    }, function() {
        $scope.result.message = "Aproval failed."
    });
}
