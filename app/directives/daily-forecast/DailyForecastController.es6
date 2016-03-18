'use strict';

import angular from 'angular';

var self = null;

class DailyForecastController {

    constructor($rootScope, $scope, $filter, $timeout, forecastService, spotService) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.forecastService = forecastService;
        this.spotService = spotService;
        self = this;

        this.initScope($scope);
    }

    initScope(scope) {
        scope.vm = {
            issued: "n.a",
            weatherForecast: null,
            tideChart: {
                show: false,
                data: {},
                series: ["Tide"],
                labels: {},
                options: {
                    animation: false,
                    maintainAspectRatio: false,
                }
            },
            error: null
        }
    }

    retrieveForecast(location, spot) {
        self.$rootScope.globalVM.promise =
            self.forecastService.getWeatherForecast(location.providerId, location.locationId)
            .then(function(forecast) {
                self.$scope.vm.weatherForecast = forecast;
                if (forecast.issueTime) {
                    self.$scope.vm.issued = self.$filter('date')(forecast.issueTime, "dd.MM.yyyy HH:mm");
                } else {
                    self.$scope.vm.issued = "n.a.";
                }
            }, function(errorResult) {
                self.$scope.vm.weatherForecast = null;
                self.$scope.vm.error = "Got '" + errorResult.error.status + "' when retrieving forecast.";
            });

        var tideProvider = null;
        if (angular.isDefined(spot)) {
            tideProvider = self.spotService.getTideForecast(spot, location);
        } else {
            tideProvider = self.forecastService.getTideForecast(location.providerId, location.locationId);
        }

        self.$scope.vm.tideChart.show = true;
        self.$timeout(function() {
            tideProvider.then(function(tideForecast) {
                self.$scope.vm.tideChart.labels = {};
                self.$scope.vm.tideChart.data = {};
                for (var day in tideForecast) {
                    if (tideForecast.hasOwnProperty(day)) {
                        self.$scope.vm.tideChart.labels[day] = tideForecast[day].x;
                        self.$scope.vm.tideChart.data[day] = [tideForecast[day].y];
                    }
                }
            }, function(errorResult) {
                self.clearTideChart();
            });
        });
    }

    clearTideChart() {
        self.$scope.vm.tideChart.show = false;
        self.$scope.vm.tideChart.data = {};
        self.$scope.vm.tideChart.labels = {};
    }

    getWeatherIconURL(weatherForecast) {
        return self.forecastService.getWeatherIconURL(weatherForecast);
    }

    getPrecipitationBackgroundColor(forecast) {
        var precipitation = forecast.precipitation;
        if (precipitation > 0) {
            var percent = 100 / 5 * precipitation;
            if (percent > 100) {
                percent = 100;
            }
            var value = 200 + (100 / 50 * (percent / 100));
            var value2 = 100 - (percent / 2);
            return "hsl(" + value + ",100%," + value2 + "%)";
        }
        return "#fff";
    }
}

DailyForecastController.$inject = ['$rootScope', '$scope', '$filter', '$timeout', 'ForecastService', 'SpotService'];
export default DailyForecastController;
