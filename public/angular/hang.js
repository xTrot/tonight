(function(){
	var app = angular.module('hang', ['hang-directives']);
	
	app.controller('hangController', ['$http',function($http){
		var hang = this;
		hang.info = [];
		
		$http.get('/query/hang').success(function (data) {
		  console.log("\n\n*** Data: " + data);
		  hang.info=data;
		});
	}]);
})();