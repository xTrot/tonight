(function(){
    var app = angular.module('pod-directives', []);

    app.directive("podHeader", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/pods/header.html"
      };
    });
    
    app.directive("podContent", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/pods/content-text.html"
      };
    });
    
    app.directive("postPod", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/pods/post-pod.html"
      };
    });
    
    app.directive("podComment", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/pods/post-comment.html"
      };
    });
    
    app.directive("commentForm", function() {
      return {
        restrict: 'E',
        templateUrl: "/angular/static/pods/comment-form.html"
      };
    });
    
  })();
