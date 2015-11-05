angular.module('registerApp', []).

controller('registerController', function($scope, $http){

        $scope.regData = {};
        $scope.userID = -1; //very important for the app to know who is logged in

        $scope.createUser = function() {
            $http.post('/query/register', $scope.regData)
                .success(function(data) {
                    //after registration
                    $scope.userID = data[0].user_id;

                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        };

    });
