'use strict';

import app from '../../SpotMateApp.es6';
import template from './StarRatingView.html';
import angular from 'angular';

app.directive('spotmateStarRating', function StarRatingDirective() {
    return {
      restrict: 'A',
      template: template,
      scope: {
          ratingValue: '=',
          max: '='
      },
      link: function(scope) {
          scope.$watch('ratingValue', function(value) {
              if (angular.isDefined(value) && value !== null) {
                  scope.stars = [];
                  for (var i = 0; i < scope.max; i++) {
                      scope.stars.push({
                          filled: i < scope.ratingValue
                      });
                  }
              }
          });
      }
    }
});
