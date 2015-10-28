(function() {
    var app = angular.module('groupsApp', ['group-directive']);

    app.controller('groupsController', ['$http',function($http){
        var groupsObj = this;
        groupsObj.groups = [];
        $http.get('/jsondata/groups.json').success(function (data) {
            groupsObj.groups=data;
        });
    }]);
})();
