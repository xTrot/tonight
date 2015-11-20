(function() {
    var app = angular.module('hang-friendsApp', ['hang-friend-directive']);

    app.controller('hang-friendsController', ['$http',function($http){
        var friendsObj = this;
        friendsObj.friends = {};

        $http.get('/query/friends').success(function (data) {
            console.log("\n\n*** Data: " + data);
            friendsObj.friends=data;
        });
    }]);
})();