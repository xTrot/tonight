(function(){
	var app = angular.module('hang', ['hang-directives']);
	
	app.controller('hangController', ['$http',function($http){
		var hang = this;
		hang.info = [];
		$http.get('/jsondata/hang.json').success(function (data) {
		  hang.info=data;
		});
	}]);
})();