'use strict';

angular.module('myApp.controllers')
    .controller('listUserCtrl', function ($scope, $modal, $stateParams, ConfirmService, Alert, data, $filter, User, USER_LEN, CONFIG) {
        $scope.data = data;
        $scope.tabset = {
            list: true
        };

        $scope.user = {
            page: 1
        };

        $scope.$watch('user.page', function (newVal, oldVal) {
            if (newVal != oldVal) {
                refresh(newVal);
            }
        });

        var refresh = function (page) {
            var SPEC = {page: page, size: CONFIG.limit};
            if ($scope.user.name) {
                SPEC.name = $scope.user.name;
            }
            if ($scope.user.mobile) {
                SPEC.mobile = $scope.user.mobile;
            }
            if ($scope.user.address) {
                SPEC.address = $scope.user.address;
            }
            console.log("SPEC", SPEC)
            var d = User.list(SPEC, function () {
                $scope.data = d;
            });
        };

        $scope.search = function () {
            refresh($scope.user.page);
        };

        $scope.reset = function () {
            $scope.user = {
                page: 1
            };
            var SPEC = {page: $scope.user.page, size: CONFIG.limit};
            var d = User.list(SPEC, function () {
                $scope.data = d;
            });
        };

        $scope.create = function () {
            $scope.tabset = {create: true};
            $scope.user = {};
        };

        $scope.sub = function () {
            $scope.USER_LEN = USER_LEN;
            $scope.show_user_mobile_err = $scope.user.mobile.length != USER_LEN.MOBILE;
            if ($scope.show_user_mobile_err) {
                return;
            }
            var _copy = angular.copy($scope.user);
            User.save(_copy, function (data) {
                $scope.tabset = {
                    list: true
                };
                if (_copy.id == null) {
                    $scope.data.data.push(data);
                }
                $scope.reset();
            }, function (data) {
                Alert.alert(data.data, true);
            });
        };

        $scope.edit = function (idx) {
            $scope.index = idx;
            $scope.tabset = {create: true};
            $scope.user = $scope.data.data[idx];
        };

        $scope.remove = function (idx) {
            ConfirmService.confirm('确认删除该会员?').then(function () {
                var o = $scope.data.data[idx];
                User.remove({id: o.id}, function () {
                    Alert.alert('删除完成');
                    $scope.data.data.splice(idx, 1);
                }, function (res) {
                    Alert.alert(res.data, true);
                });
            });
        };

    })
;

