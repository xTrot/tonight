(function() {
  var app = angular.module('podsfeed', ['pod-directives']);

  app.controller('podsController', ['$http',function($http){
    var feed = this;
    feed.pods = [];
    $http.get('/jsondata/posts.json').success(function (data) {
		  feed.pods=data;
	  });
  }]);
})();
