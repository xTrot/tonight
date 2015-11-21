(function(){
	var app = angular.module('hang', ['hang-directives']);
	
	app.controller('hangController', ['$scope', '$http',function($scope, $http){
		var hang = this;
		hang.info = [];
		
		$http.get('/query/hang').success(function (data) {
		  //console.log("\n\n*** Data: " + data);
		  hang.info=data;
		});



        $scope.deleteHang = function(){
            var ok = confirm("Are you sure you want to delete this hang?");
            if (ok == true) {
                //perform deletion
               $http.delete('/query/deleteHang?hang_id='+hang.info[0].hang_id)
                   .success(function (data) {
                    //console.log("\n\n*** Data: " + data);
                    //hang.info=data;
                    //res.redirect('/');
                });
                //console.log(hang.info[0].hang_id);
            }else {
                //do nothing
            }
            //console.log(r);
        };

	}]);
})();