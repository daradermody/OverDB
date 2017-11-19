angular.module('OverDB')
    .controller('filmListController', ['$scope', '$http', '$rootScope', '$state', '$stateParams', function($scope, $http, $rootScope, $state, $stateParams) {
        $scope.filmList = [];
        $scope.errorMessage = null;
        $scope.searchActor = function(actor) {
            $scope.errorMessage = null;
            $http.get("/actor/" + actor)
                .success(function(data) {
                    console.log(data);
                    $scope.filmList = data;
                    if (!data.length) {
                        $scope.errorMessage = "Nothing found! :(";
                    }
                })
                .error(function(data) {
                    $scope.errorMessage = "Had trouble connecting to the server"
                    console.log(data)
                })
            ;
        }
        $scope.searchActor($stateParams.actor);
    }])
;
