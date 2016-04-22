'use strict';

angular.module('myApp.controllers')
    .controller('UserCtrl', ['$scope', '$log', 'Alert', 'ConfirmService', 'User', 'CONFIG', '$modal', 'data', '$state',
        function ($scope, $log, Alert, ConfirmService, User, CONFIG, $modal, data, $state) {
            $scope.data = data;
            $scope.user = {
                page: 1//todo 这种处理page的方式   不容易设置page
            };

            var refresh = function (page) {
                var SPEC = {page: page, size: CONFIG.limit};
                var d = User.get(SPEC, function () {
                    $scope.data = d;
                });
            };

            $scope.$watch('user.page', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    refresh(newVal);
                }
            });

            $scope.delete = function (idx) {
                var c = $scope.data.users[idx];
                ConfirmService.confirm('确定要删除此会员吗?').then(function () {
                    User.remove({id: c.id}, function (res) {
                        if (res.code == 1) {
                            $scope.data.users.splice(idx, 1);
                            $scope.data.total--;
                            $scope.data.size--;
                            Alert.alert("操作成功");
                        } else {
                            Alert.alert("操作失败：" + res.data, true);
                        }
                    }, function (res) {
                        Alert.alert("操作失败：" + res.data, true);
                    });
                });
            };

            $scope.edit = function (idx) {
                $scope.user = $scope.data.users[idx];
                console.log("update", $scope.user);
                User.update({id: $scope.user.id}, $scope.user, function (res) {
                    if (res.code == 1) {
                        Alert.alert("修改成功", false);
                        $state.go("home.user");
                    } else {
                        Alert.alert("修改失败：" + res.data, true);
                    }
                }, function (res) {
                    Alert.alert("修改失败：" + res, true);
                });
            };

        }
    ])
    .controller('CreateUserCtrl', ['$scope', '$log', '$state', 'Alert', 'User',
        function ($scope, $log, $state, Alert, User) {

            $scope.create = function () {
                User.save($scope.user, function (res) {
                    if (res.code == 1) {
                        Alert.alert("添加成功", false);
                        $state.go("home.user");
                    } else {
                        Alert.alert("添加失败：" + res.data, true);
                    }
                }, function (res) {
                    Alert.alert("添加失败：" + res, true);
                });
            };
        }])
;

