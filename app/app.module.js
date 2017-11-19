angular.module('OverDB', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $stateProvider.state('filmList', {
            url: '/filmList/:actor',
            templateUrl: 'app/filmList/filmListView.html',
            controller: 'filmListController'
        });
        
        $urlRouterProvider.otherwise('/');
    }])
    .run(function () {
        console.log('Done loading dependencies and configuring module!');
    })
;