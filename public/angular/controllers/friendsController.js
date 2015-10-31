(function() {
    var app = angular.module('friendsApp', ['friend-directive']);

    app.controller('friendsController', ['$http',function($http){
        var friendsObj = this;
        friendsObj.friends = {};

        $http.get('/query/friends').success(function (data) {
            console.log("\n\n*** Data: " + data);
            friendsObj.friends=data;
        });

        //$http.get('/jsondata/friends.json').success(function (data) {
        //    friendsObj.friends=data;
        //});
    }]);
})();
