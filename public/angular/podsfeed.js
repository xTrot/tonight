(function() {
  var app = angular.module('podsfeed', ['pod-directives']);

  app.controller('podsController', ['$http',function($http){
    var feed = this;
    feed.pods = [];
    $http.get('/query/feed').success(function (data) {
		  feed.pods=data;
	  });
  }]);
})();
