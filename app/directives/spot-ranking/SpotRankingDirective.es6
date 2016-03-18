'use strict';

import app from '../../SpotMateApp.es6';
import controller from './SpotRankingController.es6';
import template from './SpotRankingView.html';
import angular from 'angular';

app.directive('spotmateSpotRanking', function SpotRankingDirective() {
    return {
        restrict: 'E',
        template: template,
        controller: controller,
        scope: {
            spotId: '='
        },
        link: function(scope, element, attrs, controller) {
            scope.$watch('spotId', function(id) {
                if (angular.isDefined(id) && id !== null) {
                    controller.getRanking(id);
                }
            });
        }
    }
});
