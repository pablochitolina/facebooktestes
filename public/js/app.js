// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ngRoute', 'duScroll', 'angularModalService']);

app.service('User', function () {

  var user = {
    name : '',
    lastName : '',
    idUserFB : '',
    email : '',
    birthday : '',
    gender : '',
    picture : '/images/desconhecido.jpg'
  };

  return {
    getUser: function () {
      return user;
    },
    setUser: function (value) {
      user = value;
    }
  };

});


app.config(function ($routeProvider) {

  $routeProvider
    .when('/principal', {
      templateUrl: '/templates/principal.html',
      controller: 'PrincipalCtrl'
    })
    .when('/principal/:teste', {
      templateUrl: '/templates/principal.html',
      controller: 'PrincipalCtrl'
    })
    
    .otherwise({ redirectTo: '/principal' });

});
