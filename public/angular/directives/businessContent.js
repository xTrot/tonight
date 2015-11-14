(function(){
    var app = angular.module('business-directive', []);

    app.directive("businessContent", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/business/business-view.html"
      };
    });

  })();