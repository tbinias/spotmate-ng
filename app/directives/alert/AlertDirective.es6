'use strict';

import app from '../../SpotMateApp.es6';
import template from './AlertView.html';
import angular from 'angular';

app.directive('spotmateAlert', function AlertDirective() {
    return {
        restrict: 'E',
        template: template,
        scope: {
            model: '='
        },
        link: function(scope) {
            scope.$watch('model', function(alert) {
                if (angular.isDefined(alert)) {
                    scope.vm = {
                        show: true,
                        title: alert.title,
                        message: alert.message
                    }
                    if (alert.type === "INFO") {
                        scope.vm.cssClass = "alert alert-info"
                    } else if (alert.type === "ERROR") {
                        scope.vm.cssClass = "alert alert-danger"
                    }
                } else {
                    scope.vm = {
                        show: false
                    }
                }
            });
        }
    }
});
