'use strict';

import app from '../SpotMateApp.es6';

class ForecastService {

    constructor($resource, $q, $filter) {
        this.$resource = $resource;
        this.$q = $q;
        this.$filter = $filter;
    }

    getWeatherForecast(providerId, locationId) {
            var self = this;
            var defer = self.$q.defer();
            self.$resource("resources/forecasts/weather/:providerId/:locationId", {providerId: providerId, locationId: locationId}).get(function(result) {
                var weatherForecast = {
                        forecasts: [],
                        hasCloudCoverageInfo: false
                };
                var forecasts = self.$filter('orderBy')(result.forecasts, "time");
                for (var i=0; i < forecasts.length; i++) {
                    var forecast = forecasts[i];
                    forecast.day = self.$filter('date')(forecast.time,"EEE dd.MM", "UTC");
                    weatherForecast.forecasts.push(forecast);
                    if (forecast.cloudCoverage != null && !weatherForecast.hasCloudCoverageInfo) {
                        weatherForecast.hasCloudCoverageInfo = true;
                    }
                }
                weatherForecast.issueTime = result.issueTime;
                weatherForecast.expires = result.expires;
                weatherForecast.location = result._embedded.location;
                defer.resolve(weatherForecast);
            }, function(result) {
                var error = {
                        message: "Failed to retrieve weather forecast from '" + providerId + "' - '" + locationId + "'",
                        error: result
                }
                defer.reject(error);
            });
            return defer.promise;
    }

    getTideForecast(providerId, locationId) {
        var self = this;
        var defer = self.$q.defer();
        self.$resource("resources/forecasts/tide/:providerId/:locationId",{providerId: providerId,locationId: locationId}).get(function(result) {
            var tideForecast = {};
            var forecasts = self.$filter('orderBy')(result.forecasts, "time");
            var tide = null;
            for (var i=0; i < forecasts.length; i++) {
                var forecast = forecasts[i];
                var day = self.$filter('date')(forecast.time,"EEE dd.MM", "UTC");
                if (!tideForecast[day]) {
                    tideForecast[day] = {
                        x: [],
                        y: []
                    };
                }
                tideForecast[day].x.push(self.$filter('date')(forecast.time,"HH:mm", "UTC"));
                tideForecast[day].y.push(forecast.tide);
            }
            defer.resolve(tideForecast);
        }, function(result) {
            var error = {
                    message: "Failed to retrieve tide forecast from '" + providerId + "' - '" + locationId + "'",
                    error: result
            }
            defer.reject(error);
        });
        return defer.promise;
    }

    getWeatherIconURL(weatherForecast) {
        var base = "icons/weather/";
        var cloudCoverage = weatherForecast.cloudCoverage;
        if (cloudCoverage != null) {
            if (cloudCoverage >= 0 && cloudCoverage <= 25) {
                return base + "weather-clear.png";
            } else if (cloudCoverage > 25 && cloudCoverage <= 50) {
                return base + "weather-few-clouds.png";
            } else if (cloudCoverage > 50 && cloudCoverage <= 75) {
                return base + "weather-clouds.png";
            } else if (cloudCoverage > 75) {
                return base + "weather-many-clouds.png";
            }
        }
        return null;
    }

}
app.service('ForecastService', ['$resource', '$q', '$filter', ForecastService]);
