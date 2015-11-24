(function() {
    var app = angular.module('profileApp', []);

    app.controller('profileController', ['$http','$window',function($http,$window){
        var profile = this;
   
        var searchFor = '/query/profile?user='+
            $window.location.search.split('?')[1].split('=')[1];

        $http.get(searchFor).success(function (data) {
            console.log("SearchFor: " + searchFor);
            console.log("Data: " + data);
            profile.items=data;
        });
    }]);
})();