'use strict';

import app from '../SpotMateApp.es6';

import './ForecastService.es6';

class UserService {

    constructor($rootScope, $resource, $q, $cookies, $base64, $location, config) {
        this.$rootScope = $rootScope;
        this.$resource = $resource;
        this.$q = $q;
        this.$cookies = $cookies;
        this.$base64 = $base64;
        this.$location = $location;
        this.config = config;
    }

    login(loginname, password) {
        // put given login in root scope and access root resource to query current user
        // if we retrieve here something else than "anonymous" we are logged in
        this.$rootScope.user = loginname;
        if (this.$rootScope.user) {
            this.$rootScope.user = this.$rootScope.user.toLowerCase(); // login name should be case insensitiv
        }
        this.$rootScope.password = password;

        var loginDefer = this.$q.defer();

        var self = this;
        this.$resource("resources").get(function(result) {
            if (self.$rootScope.user != result._embedded.account.username) {
                delete self.$rootScope.user;
                delete self.$rootScope.password;
                delete self.$rootScope.profile;
                loginDefer.reject("Login failed");
            } else {
                var loginInfo = {
                    user: self.$rootScope.user,
                    password: self.$rootScope.password
                }

                var authToken = self.$rootScope.user + ":" + self.$rootScope.password;
                var authorization = "BasicCustom " + self.$base64.encode(authToken);
                var cookieOptions = {
                        secure: true
                };

                if (self.config.isDevMode) {
                    cookieOptions.secure=false;
                }

                self.$cookies.putObject("loginInfo", loginInfo, cookieOptions);
                self.$cookies.put("Authorization", authorization, cookieOptions);

                self.$rootScope.profile = result._embedded.account;
                loginDefer.resolve("Login successfull");
            }
        });

        return loginDefer.promise;
    }

    isLoggedIn() {
        return this.getUserInfo() != null;
    }

    logout() {
        delete this.$rootScope.user;
        delete this.$rootScope.password;
        delete this.$rootScope.profile;
        this.$cookies.remove("loginInfo");
        this.$cookies.remove("Authorization");
    }

    getUserInfo() {
        var self = this;
        if (angular.isDefined(this.$rootScope.user) && angular.isDefined(this.$rootScope.password)) {
            return {
                user: function() {
                    return self.$rootScope.user
                },
                password: function() {
                    return self.$rootScope.password
                }
            }
        } else {
            return null;
        }
    }

    getProfile() {
        var profileDefer = this.$q.defer();
        var self = this;
        this.$resource("resources").get(function(result) {
            if (self.$rootScope.user != result._embedded.account.username) {
                profileDefer.reject();
            } else {
                profileDefer.resolve(result._embedded.account);
            }
        });
        return profileDefer.promise;
    }


    startup() {
        var userInfo = this.$cookies.getObject("loginInfo");
        if (userInfo) {
            this.$rootScope.user = userInfo.user;
            this.$rootScope.password = userInfo.password;
        }
    }
}


app.service('UserService', ['$rootScope', '$resource', '$q', '$cookies', '$base64',
    '$location', 'Config', UserService]);
