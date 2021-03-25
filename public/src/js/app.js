var app = angular.module("app-main", []);

app.controller("appCtrl", ($scope, $rootScope) => {
    $rootScope.appName = 'StarCom';
    // data ~ window.data: response from server
    $rootScope.appData = Object.assign({}, window.data);
    $scope.menu = $rootScope.appData.menu;
})