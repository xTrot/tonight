(function(){
	var app = angular.module('hang', ['hang-directives']);
	
	app.controller('hangController', ['$scope', '$http','$window',function($scope, $http, $window){
		var hang = this;
		hang.info = [];
        var hang_id = $window.location.search.split('?')[1].split('=')[1];
        hang.going = [];
        hang.maybe = [];
        hang.not = [];
        
		
		$http.get('/query/hang?hang_id='+hang_id).success(function (data) {
		  hang.info=data;
		});
        $http.get('/query/hang/going?hang_id='+hang_id).success(function (data) {
		  hang.going=data;
		});
        $http.get('/query/hang/maybe?hang_id='+hang_id).success(function (data) {
		  hang.maybe=data;
		});
        $http.get('/query/hang/not?hang_id='+hang_id).success(function (data) {
		  hang.not=data;
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
        $scope.going = function(){
           $http.post('/query/hang/going?hang_id='+hang.info[0].hang_id)
               .success(function (data) {
            });
        };
        $scope.maybe = function(){
           $http.post('/query/hang/maybe?hang_id='+hang.info[0].hang_id)
               .success(function (data) {
            });
        };
        $scope.not = function(){
           $http.post('/query/hang/not?hang_id='+hang.info[0].hang_id)
               .success(function (data) {
            });
        };

	}]);
})();