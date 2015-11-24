(function() {
    var app = angular.module('groupsApp', ['group-directive']);

    app.controller('groupsController', ['$http',function($http){
        var groupsObj = this;
        groupsObj.groups = [];
        groupsObj.othergroups=[];
        
        $http.get('/query/groups').success(function (data) {
            console.log("\n\n*** Data: " + data);
            groupsObj.groups=data;
        });
        
        $http.get('/query/othergroup').success(function (data){
           console.log("\n\n*** Data: " + data);
           groupsObj.belonggroups=data;
        });
    }]);
})();