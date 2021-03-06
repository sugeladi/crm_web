'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'ui.utils',
    'ng.ueditor',
    'ngSanitize',
    'xeditable',
    'angularFileUpload',
    'ui.tree',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers'
])
    .constant('CONFIG', {
        limit: 10
    })
    .constant('USER_LEN', {
        MOBILE: 11,
    })
    .constant('AUTH_EVENTS', {
        loginNeeded: 'auth-login-needed',
        loginSuccess: 'auth-login-success',
        httpForbidden: 'auth-http-forbidden'
    })
    .config(['$stateProvider', '$urlRouterProvider', 'CONFIG', function ($stateProvider, $urlRouterProvider, CONFIG) {
        $urlRouterProvider.otherwise("/login");

        var resolveMe = function ($rootScope, Op) {
            if ($rootScope.me) {
                return $rootScope.me;
            } else {
                return Op.me.get().$promise;
            }
        };

        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl: 'views/login.html'
            })
            .state('home', {
                abstract: true,
                resolve: {
                    me: resolveMe
                },
                controller: 'HomeCtrl',
                templateUrl: 'views/home.html'
            })
            .state('home.index', {
                url: '/index',
                templateUrl: 'views/home_index.html'
            })
            .state('home.setting', {
                url: '/setting',
                controller: 'SettingCtrl',
                templateUrl: 'views/setting.html'
            })
            .state('home.listOp', {
                url: '/op/list',
                resolve: {
                    data: function (Op) {
                        return Op.list().$promise;
                    }
                },
                controller: 'ListOpCtrl',
                templateUrl: 'views/op/list.html'
            })
            .state('home.createOp', {
                url: '/op/create',
                controller: 'CreateOpCtrl',
                templateUrl: 'views/op/create.html'
            })
            .state('home.org', {
                resolve: {
                    root: function (Org) {
                        return Org.get({id: 0}).$promise;
                    }
                },
                controller: 'OrgCtrl',
                url: '/org',
                templateUrl: 'views/org.html'
            })
            .state('home.menpaihao', {
                resolve: {
                    data: function (CONFIG, Org) {
                        return Org.menpaihao.get({page: 1, size: CONFIG.limit}).$promise;
                    },
                    orgs: function (Org) {
                        return Org.query().$promise;
                    }
                },
                controller: 'MenPaiHaoCtrl',
                url: '/menpaihao',
                templateUrl: 'views/menpaihao.html'
            })
            .state('home.user', {
                url: '/user',
                resolve: {
                    data: function (User) {
                        return User.get().$promise;
                    }
                },
                controller: 'listUserCtrl',
                templateUrl: 'views/user/list.html'
            })
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name;
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function () {
            $rootScope.transfering = true;
        });
        $rootScope.$on('$stateChangeSuccess', function (event, current) {
            $rootScope.transfering = false;
        });
    }]).run(['editableOptions', function (editableOptions) {
        editableOptions.theme = 'bs3';
    }]);

angular.module('myApp.controllers', ['ui.bootstrap']);
angular.module('myApp.services', []);





