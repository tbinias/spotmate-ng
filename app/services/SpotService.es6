'use strict';

import app from '../SpotMateApp.es6';

import './ForecastService.es6';

class SpotService {

    constructor($resource, $q, $filter, forecastService) {
        this.$resource = $resource;
        this.$q = $q;
        this.$filter = $filter;
        this.forecastService = forecastService;
    }

    findAll() {
        var defer = this.$q.defer();
        this.$resource("resources/spots").get().$promise.then(function(result) {
            defer.resolve(result._embedded.spots);
        });
        return defer.promise;
    }

    findById(spotId) {
        var defer = this.$q.defer();
        this.$resource("resources/spots/:spotId").get({spotId: spotId}).$promise.then(function(result) {
            defer.resolve(result);
        });
        return defer.promise;
    }

    create(spot) {

        var defer = this.$q.defer();

        if (spot && spot.name) {
            var spotDTO = {
                    name: spot.name,
                    locations: []
            }
            for (var key in spot.locations) {
                if (spot.locations.hasOwnProperty(key)) {
                    spotDTO.locations.push(spot.locations[key]);
                }
            }
            this.$resource("resources/spots").save(spotDTO).$promise.then(function(result) {
                defer.resolve();
            }).error(function(result) {
                defer.reject();
            });
        } else {
            defer.reject("Spot cannot be null and needs a name");
        }

        return defer.promise;
    }

    getTideForecast(spot, preferedLocation) {

        function makeIterator(array){
            var nextIndex = 0;
            return {
               next: function(){
                   return nextIndex < array.length ?
                       {value: array[nextIndex++], done: false} :
                       {done: true};
               }
            }
        }

        function findTideForecast(forecastService, locationsIterator, defer) {
            var nextValue = locationsIterator.next();
            if (!nextValue.done) {
                forecastService.getTideForecast(nextValue.value.providerId, nextValue.value.locationId).then(function(tideForecast) {
                    console.log("retrieved tideForecast from '" + nextValue.value.providerId + "' - '" + nextValue.value.locationId);
                    defer.resolve(tideForecast);
                }, function(errorResult) {
                    findTideForecast(forecastService, locationsIterator, defer);
                });
            } else {
                defer.reject("No spot location can provide a tide forecast");
            }
        }

        var defer = this.$q.defer();

        if (preferedLocation) {
            let self = this;
            this.forecastService.getTideForecast(preferedLocation.providerId, preferedLocation.locationId).then(function(tideForecast) {
                console.log("retrieved tideForecast from prefered location '" + preferedLocation.providerId + "' - '" + preferedLocation.locationId);
                defer.resolve(tideForecast);
            },
            function(errorResult) {
                var locationsIterator = makeIterator(spot._embedded.locations);
                findTideForecast(self.forecastService, locationsIterator, defer);
            });
        }

        return defer.promise;
    }

    getRanking(spotId) {
        var self = this;
        var defer = this.$q.defer();

        this.$resource("resources/spots/:spotId/ranking").get({spotId: spotId}, function(result) {
            var rankings = [];
            for (var key in result.ranks) {
                if (result.ranks.hasOwnProperty(key)) {
                    var day = self.$filter('date')(key,"EEE dd.MM");
                    var rank = result.ranks[key];
                    rank.day = day;
                    rankings.push(rank);
                }
            }
            defer.resolve(rankings);
        }, function(errorResult) {
            defer.reject(errorResult);
        });

        return defer.promise;
    }

}

app.service('SpotService', ['$resource', '$q', '$filter', 'ForecastService', SpotService]);
