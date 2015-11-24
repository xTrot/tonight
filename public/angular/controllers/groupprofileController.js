(function() {
    var app = angular.module('groupprofileApp', []);

    app.controller('groupprofileController', ['$http','$window',function($http,$window){
        var group = this;
   
        var searchFor = '/query/groupprofile?group_id='+
            $window.location.search.split('?')[1].split('=')[1];

        $http.get(searchFor).success(function (data) {
            console.log("SearchFor: " + searchFor);
            console.log("Data: " + data);
            group.profile=data;
        });
    }]);
})();