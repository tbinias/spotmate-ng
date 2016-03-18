(function() {
	'use strict';

	angular.module('SpotMate')
		   .service('UserService', ['$rootScope', '$resource', '$q', '$cookies', '$base64', '$location', 'Config',

		function($rootScope, $resource, $q, $cookies, $base64, $location, Config) {
			return {
				login: function(loginname, password) {
					// put given login in root scope and access root resource to query current user
					// if we retrieve here something else than "anonymous" we are logged in
					$rootScope.user = loginname;
					if ($rootScope.user) {
						$rootScope.user = $rootScope.user.toLowerCase(); // login name should be case insensitiv
					}
					$rootScope.password = password;

					var loginDefer = $q.defer();

					var rootResource = $resource("resources");
					rootResource.get(function(result) {
						if ($rootScope.user != result._embedded.account.username) {
							delete $rootScope.user;
							delete $rootScope.password;
							delete $rootScope.profile;
							loginDefer.reject("Login failed");
						} else {
							var loginInfo = {
								user: $rootScope.user,
								password: $rootScope.password
							}
							var authToken = $rootScope.user + ":" + $rootScope.password;
		        			var authorization = "BasicCustom " + $base64.encode(authToken);
		        			var cookieOptions = {
		        					secure: true
		        			};
							if (Config.isDevMode) {
								cookieOptions.secure=false;
							}
							console.log($location.protocol());
							$cookies.putObject("loginInfo", loginInfo, cookieOptions);
							$cookies.put("Authorization", authorization, cookieOptions);

							$rootScope.profile = result._embedded.account;
							loginDefer.resolve("Login successfull");
						}
					});

					return loginDefer.promise;
				},

				isLoggedIn: function() {
					return this.getUserInfo() != null;
				},

				logout: function() {
					delete $rootScope.user;
					delete $rootScope.password;
					delete $rootScope.profile;
					$cookies.remove("loginInfo");
					$cookies.remove("Authorization");
				},

				getUserInfo: function() {
					if (angular.isDefined($rootScope.user) && angular.isDefined($rootScope.password)) {
						return {
							user: function() {
								return $rootScope.user
							},
							password: function() {
								return $rootScope.password
							}
						}
					} else {
						return null;
					}
				},

				getProfile: function() {
					var profileDefer = $q.defer();

					var rootResource = $resource("resources");
					rootResource.get(function(result) {
						if ($rootScope.user != result._embedded.account.username) {
							profileDefer.reject();
						} else {
							profileDefer.resolve(result._embedded.account);
						}
					});
					return profileDefer.promise;
				},


				startup: function() {
					var userInfo = $cookies.getObject("loginInfo");
					if (userInfo) {
						$rootScope.user = userInfo.user;
						$rootScope.password = userInfo.password;
					}
				}
			}
		}
	]);

})();
