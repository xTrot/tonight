(function(){
    var app = angular.module('friend-directive', []);

    app.directive("friendsContent", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/friends/friends-view.html"
      };
    });

  })();