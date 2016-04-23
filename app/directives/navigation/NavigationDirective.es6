'use strict';

import app from '../../SpotMateApp.es6';
import controller from './NavigationController.es6';
import template from './NavigationView.html';

app.directive('spotmateNavigation', ['$route', function NavigationDirective($route) {
    return {
        restrict: 'E',
        template: template,
        controller: controller,
        controllerAs: 'navigationController',
        link: function(scope) {
            scope.nav = [];
            angular.forEach($route.routes, function(route, path) {
                if (route.name) {
                    scope.nav.push({
                        path: path,
                        name: route.name
                    });
                }
            });
        }
    }
}]);
