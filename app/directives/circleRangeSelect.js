'use strict';

angular
        .module('SpotMate')
        .directive(
                'spotmateCircleRangeSelect',
                [
                        '$timeout',
                        function($timeout) {
                            var uniqueId = 0;
                            return {
                                restrict : 'E',
                                template : '<input type="text" class="circle-range-select" data-min="0" data-max="360" data-width=".5" ng-model="model" ng-model-options="{ debounce: 100 }">',
                                scope : {
                                    model : '=',
                                    readonly : '=',
                                    bgImage : '='
                                },
                                link : function(scope, iElement, iAttrs) {
                                    iElement.find('input').lcnCircleRangeSelect();
                                    scope.$watch('model', function(value) {
                                        if (angular.isDefined(value)) {
                                            iElement.find('input').trigger("configure", {
                                                value : value
                                            });
                                        }
                                    });
                                    scope.$watch('readonly', function(value) {
                                        if (angular.isDefined(value)) {
                                            iElement.find('input').trigger("configure", {
                                                readonly : value
                                            });
                                        }
                                    });
                                    scope.$watch('bgImage', function(value) {
                                        if (angular.isDefined(value)) {
                                            iElement.find('input').trigger("configure", {
                                                bgImage : value.replace("https://", "//")
                                            });
                                        }
                                    });
                                }
                            }
                        } ]);