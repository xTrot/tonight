(function() {
    var app = angular.module('businessprofileApp', []);

    app.controller('businessprofileController', ['$http','$window',function($http,$window){
        var business = this;
   
        var searchFor = '/query/businessprofile?b_id='+
            $window.location.search.split('?')[1].split('=')[1];

        $http.get(searchFor).success(function (data) {
            console.log("SearchFor: " + searchFor);
            console.log("Data: " + data);
            business.profile=data;
        });
    }]);
})();