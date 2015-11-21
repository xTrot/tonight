(function(){
    var app = angular.module('search-directive', []);

    app.directive("searchContent", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/friends/search-result.html"
      };
    });

  })();