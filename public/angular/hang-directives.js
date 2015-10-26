(function(){
  var app = angular.module('hang-directives', []);

  app.directive("hangInfo", function() {
    return {
      restrict: 'E',
      templateUrl: "/angular/static/hang/hanginfo.html"
    };
  });

  app.directive("hangGoing", function() {
    return {
      restrict: 'E',
      templateUrl: "/angular/static/hang/hanggoing.html"
    };
  });

  app.directive("hangMaybe", function() {
    return {
      restrict: 'E',
      templateUrl: "/angular/static/hang/hangmaybe.html"
    };
  });

  app.directive("hangNo", function() {
    return {
      restrict: 'E',
      templateUrl:"/angular/static/hang/hangno.html"
    };
  });

})();
