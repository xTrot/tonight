(function() {
  var app = angular.module('podsfeed', ['pod-directives']);

  app.controller('podsController', ['$http',function($http){
    var feed = this;
    feed.pods = [];
    $http.get('/query/feed').success(function (data) {
		  data.forEach(function(element) {
        element.comments=[];
        $http.get('/query/comments?post_id='+element.post_id).success(function (data) {
		      element.comments=data;
	      });
      feed.pods=data;
      });
	  });
  }]);
})();
