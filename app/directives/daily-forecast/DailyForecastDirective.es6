'use strict';

import app from '../../SpotMateApp.es6';
import controller from './DailyForecastController.es6';
import template from './DailyForecastView.html';

app.directive('spotmateDailyForecast', function DailyForecastDirective() {
    return {
        restrict: 'E',
        template: template,
        controller: controller,
        controllerAs: 'dailyForecastController',
        scope: {
            location: '=',
            spot: '='
        },
        link: function(scope, element, attrs, controller) {
            scope.$watch('location', function() {
                if (angular.isDefined(location) && location !== null) {
                    controller.retrieveForecast(scope.location, scope.spot);
                }
            });
        }
    }
});
