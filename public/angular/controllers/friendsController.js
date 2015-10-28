(function() {
    var app = angular.module('friendsApp', ['friend-directive']);

    app.controller('friendsController', ['$http',function($http){
        var friendsObj = this;
        friendsObj.friends = [];
        $http.get('/jsondata/friends.json').success(function (data) {
            friendsObj.friends=data;
        });
    }]);
})();
