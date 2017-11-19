angular.module('OverDB')
    .controller('filmListController', ['$scope', '$http', '$rootScope', '$state', '$stateParams', function($scope, $http, $rootScope, $state, $stateParams) {
        $scope.filmList = [];
        $scope.errorMessage = null;
        $scope.searchActor = function(actor) {
            $http.get("http://localhost:5000/actor/" + actor)
                .success(function(data) {
                    console.log(data);
                    $scope.filmList = data;
                    if (!data.length) {
                        $scope.errorMessage = "Nothing found! :(";
                    } else {
                        $scope.errorMessage = null;
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
