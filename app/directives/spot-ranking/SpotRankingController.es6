'use strict';

import angular from 'angular';

class SpotRankingController {

    constructor($scope, $resource, $filter, spotService, $routeParams) {
        this.$scope = $scope;
        this.$resource = $resource;
        this.$filter = $filter;
        this.spotService = spotService;

        $scope.vm = {};

        if ($routeParams.debug === 'true') {
            $scope.vm.debug = true;
        }
    }

    getRanking(spotId) {
        let self = this;
        this.spotService.getRanking(spotId).then(function(rankings) {
            self.$scope.vm.rankings = rankings;
            self.$scope.vm.rating = {};
            self.$scope.vm.ratingMax = 5;

            // compute overall rank for each day
            angular.forEach(self.$filter("groupBy")(rankings, "day"), function(value, day) {
                var sum = 0;
                for (var i = 0; i < value.length; i++) {
                    sum += value[i].score;
                }
                self.$scope.vm.rating[day] = Math.round((self.$scope.vm.ratingMax / 100) * sum / value.length);
            });
        });
    }

}

SpotRankingController.$inject = ['$scope', '$resource', '$filter', 'SpotService', '$routeParams'];
export default SpotRankingController;
