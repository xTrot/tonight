(function() {
    var app = angular.module('searchApp', ['search-directive']);

    app.controller('searchController', ['$http','$window',function($http,$window){
        
        var searchContent = this;
        searchContent.list = {};
        
        var searchFor = '/query/search?search='+
            $window.location.search.split('?')[1].split('=')[1];

        $http.get(searchFor).success(function (data) {
            console.log("SearchFor: " + searchFor);
            console.log("Data: " + data);
            searchContent.list=data;
        });
    }]);
})();
