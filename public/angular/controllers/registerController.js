angular.module('registerApp', []).

controller('registerController', function($scope, $http){

        $scope.regData = {};
        $scope.userID = -1; //very important for the app to know who is logged in
        $scope.user_exists = null;

        $scope.createUser = function() {
            $http.post('/query/register', $scope.regData)
                .success(function(data) {
                    //after registration
                    //$scope.userID = data[0].user_id;
                    //if(data[0].user_id == -1){
                    //    $scope.user_exists = "User already exist.";
                        //console.log("User already exist");
                    //}
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        };

    });
