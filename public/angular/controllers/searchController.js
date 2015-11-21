(function() {
    var app = angular.module('searchApp', ['search-directive']);

    app.controller('searchController', ['$http',function($http){
        var searchContent = this;
        searchContent.list = {};

        $http.get('/query/search').success(function (data) {
            console.log("\n\n*** Data: " + data);
            searchContent.list=data;
        });
    }]);
})();
