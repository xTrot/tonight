(function() {
    var app = angular.module('groupsApp', ['group-directive']);

    app.controller('groupsController', ['$http',function($http){
        var groupsObj = this;
        groupsObj.groups = [];
        
        $http.get('/query/groups').success(function (data) {
            console.log("\n\n*** Data: " + data);
            groupsObj.groups=data;
        });
        
        //$http.get('/jsondata/groups.json').success(function (data) {
        //    groupsObj.groups=data;
        //});
    }]);
})();