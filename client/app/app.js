'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');


    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "src/views/home.html"
        })


}]);
