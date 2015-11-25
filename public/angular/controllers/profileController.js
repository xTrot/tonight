(function() {
    var app = angular.module('profileApp', []);

    app.controller('profileController', ['$http','$window','$scope',function($http,$window,$scope,
            transformRequestAsFormPost){
        var profile = this;
        profile.status = 'Add Friend'; 
        profile.user = $window.location.search.split('?')[1].split('=')[1];
        var searchFor = '/query/profile?user=' + profile.user;
        
        $http.get('/query/relationship?user='+profile.user).success(function (data) {
            profile.status=data[0].relation; //data to populate the button
        });

        $http.get(searchFor).success(function (data) {
            console.log("SearchFor: " + searchFor);
            console.log("Data: " + data);
            profile.items=data; //data to populate the view
        });
        
        $scope.status = function () {
            var data = {
                        status: profile.status,
                    };
            $http.post('/query/relationship?user='+profile.user,data);
        };
        
    }]);
})();