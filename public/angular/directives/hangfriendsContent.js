(function(){
    var app = angular.module('hang-friend-directive', []);

    app.directive("hangfriendsContent", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/friends/hang-friends-view.html"
      };
    });

  })();