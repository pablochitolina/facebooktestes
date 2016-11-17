// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ngRoute', 'duScroll', 'angularModalService']);

app.service('User', function () {

  var user = {
    name: '',
    lastName: '',
    idUserFB: '',
    email: '',
    birthday: '',
    gender: '',
    picture: '/images/desconhecido.jpg'
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

window.app.directive('googleAdsenseUm', [//banner 1 resp
  '$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        return $timeout(function() {
          var adsbygoogle, html, rand1;
          rand1 = Math.random();
          html = "<ins class='adsbygoogle' style='display:block' data-ad-client='ca-pub-8832799678197868' data-ad-slot='5421662634' data-ad-region='page-" + rand1 + "'></ins>";
          $(element).append(html);
          console.log("googleAdsenseUm loaded")
          return (adsbygoogle = window.adsbygoogle || []).push({});
        });
      }
    };
  }
]);


window.app.directive('googleAdsenseDois', [ // com tam fixo
  '$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        return $timeout(function() {
          var adsbygoogle, html, rand2;
          rand2 = Math.random();
          html = "<ins class='adsbygoogle' style='display:inline-block;width:300px;height:250px' data-ad-client='ca-pub-8832799678197868' data-ad-slot='9123505437' data-ad-region='page-" + rand2 + "'></ins>";
          $(element).append(html);
          console.log("googleAdsenseDois loaded")
          return (adsbygoogle = window.adsbygoogle || []).push({});
        });
      }
    };
  }
]);

window.app.directive('googleAd', [ //do cara
  '$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        return $timeout(function() {
          var adsbygoogle, html, rand;
          rand = Math.random();
          html = "<ins class='adsbygoogle' style='display:inline-block;width:300px;height:250px' data-ad-client='ca-pub-3199660652950290' data-ad-slot='6259591966' data-ad-region='page-" + rand + "'></ins>";
          $(element).append(html);
          return (adsbygoogle = window.adsbygoogle || []).push({});
        });
      }
    };
  }
]);
