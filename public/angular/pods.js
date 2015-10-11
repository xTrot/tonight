(function(){
    var app = angular.module('pod-directives', []);

    app.directive("podHeader", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/pods/header.html"
      };
    });
  })();
