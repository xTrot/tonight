(function(){
    var app = angular.module('group-directive', []);

    app.directive("groupsContent", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/friends/groups-view.html"
      };
    });

  })();