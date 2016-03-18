'use strict';

import 'angular';
import 'angular-resource';
import 'angular-route';

import 'angular-chart.js';
import 'angular-chart.js/dist/angular-chart.css';

import 'angular-filter';
import 'angular-base64';
import 'angular-animate';
import 'angular-cookies';
import 'angular-bootstrap';
import 'angular-messages';
import 'ng-fab-form';
import 'angular-busy';
import 'angular-busy/dist/angular-busy.css';
import 'ng-file-upload';

import 'jquery-lcn-circle-range-select';
import 'jquery-lcn-circle-range-select/dist/jquery.lcnCircleRangeSelect.min.css';
import './css/spotmate.css';

export default angular.module('SpotMate', [ 'ngResource', 'ngRoute', 'chart.js', 'angular.filter', 'base64',
        'ngAnimate', 'ngCookies', 'ui.bootstrap', 'ngMessages', 'ngFabForm', 'cgBusy', 'ngFileUpload' ])
    .config( ['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl : 'partials/home.html',
            name : "Home"
        }).when('/login', {
            templateUrl : 'partials/login.html',
            controller : 'LoginController',
        }).when('/registration', {
            templateUrl : 'partials/registration.html',
            controller : 'RegistrationController',
        }).when('/confirmRegistration', {
            templateUrl : 'partials/confirmRegistration.html',
            controller : 'ConfirmRegistrationController',
        }).when('/search-locations', {
            templateUrl : 'partials/search-locations.html',
            controller : 'LocationSearchController',
            name : "Search locations"
        }).when('/weatherforecast/:providerId/:locationId', {
            templateUrl : 'partials/weatherforecast.html',
            controller : 'WeatherForecastController',
        }).when('/spots', {
            templateUrl : 'partials/spots.html',
            controller : 'SpotsController',
            name : "Spots"
        }).when('/createSpot', {
            templateUrl : 'partials/spot/create.html'
        }).when('/spot/:spotId', {
            templateUrl : 'partials/spot/view.html',
            controller : 'SpotController'
        }).when('/spot/:spotId/edit', {
            templateUrl : 'partials/spot/edit.html',
            controller : 'EditSpotController'
        }).when('/about', {
            templateUrl : 'partials/about.html',
            name : "About"
        }).otherwise({
            redirectTo : '/home'
        });
    }])
    .config([ '$locationProvider', '$httpProvider', '$base64',
        function ($locationProvider, $httpProvider, $base64) {

            /* Register error provider that shows message on failed requests or redirects to login page on
             * unauthenticated requests */
            $httpProvider.interceptors.push(function($q, $rootScope, $location) {
                return {
                    'responseError' : function(rejection) {
                        var status = rejection.status;
                        var config = rejection.config;
                        var method = null;
                        var url = null;
                        if (config) {
                            method = config.method;
                            url = config.url;
                        }

                        if (status == 401) {
                            $location.path("/login");
                        } else {
                            $rootScope.error = method + " on " + url + " failed with status " + status;
                        }

                        return $q.reject(rejection);
                    }
                };
            });

            /* Registers auth token interceptor, auth token is either passed by header or by query parameter
             * as soon as there is an authenticated user */
            $httpProvider.interceptors.push(function($q, $rootScope, $location) {
                return {
                    'request' : function(config) {
                        var user = $rootScope.user;
                        var password = $rootScope.password;
                        if (angular.isDefined($rootScope.user) && angular.isDefined($rootScope.password)) {
                            var authToken = $rootScope.user + ":" + $rootScope.password;
                            config.headers['Authorization'] = "BasicCustom " + $base64.encode(authToken);
                        }
                        return config || $q.when(config);
                    }
                }
            });
        }
    ])
    .run(function($rootScope, $location, UserService) {

        $rootScope.globalVM = {}

        UserService.startup();

        $rootScope.logout = function() {
            UserService.logout();
        };

        $rootScope.isLoggedIn = function() {
            return UserService.isLoggedIn();
        }

    });
