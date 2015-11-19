(function(){
    var app = angular.module('hangs-directive', []);

    app.directive("hangsContent", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/hang/hangs-view.html"
      };
    });

  })();