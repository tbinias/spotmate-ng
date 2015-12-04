'use strict';

require("angular");
require("angular-resource");
require("angular-route");
require("angular-chart.js");
require("angular-filter");
require("angular-base64");
require("angular-animate");
require("angular-cookies");
require("angular-bootstrap");
require("angular-messages");
require("ng-fab-form");
require("angular-busy");
require("angular-busy/dist/angular-busy.css");
require("ng-file-upload");

require("jquery-lcn-circle-range-select");
require("jquery-lcn-circle-range-select/dist/jquery.lcnCircleRangeSelect.min.css");
require("./css/spotmate.css");

var app = angular.module("SpotMate", [ 'ngResource', 'ngRoute', 'chart.js', 'angular.filter', 'base64',
        'ngAnimate', 'ngCookies', 'ui.bootstrap', 'ngMessages', 'ngFabForm', 'cgBusy', 'ngFileUpload' ]);


require("./config/config.js");
require("./factories");
require("./services");
require("./directives");
require("./controllers");

app.run(function($rootScope, $location, UserService) {

    $rootScope.globalVM = {}

    UserService.startup();

    $rootScope.logout = function() {
        UserService.logout();
    };

    $rootScope.isLoggedIn = function() {
        return UserService.isLoggedIn();
    }

});

app.config([ '$routeProvider', '$locationProvider', '$httpProvider', '$base64', Config ]);
function Config($routeProvider, $locationProvider, $httpProvider, $base64) {
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
        templateUrl : 'partials/spot/create.html',
        controller : 'CreateSpotController',
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
};