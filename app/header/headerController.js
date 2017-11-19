angular.module('OverDB')
    .controller('headerController', ['$scope', '$state', '$stateParams','$rootScope', function ($scope, $state, $stateParams, $rootScope) {
        $scope.searchActor=function(){
            $state.transitionTo('filmList', {actor: $scope.actor});
        };
    }]);