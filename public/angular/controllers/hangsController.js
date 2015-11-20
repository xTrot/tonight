(function() {
    var app = angular.module('hangsApp', ['hangs-directive']);

    app.controller('hangsController', ['$http',function($http){
        var hangs = this;
        hangs.list = [];
        
        $http.get('/query/hangs').success(function (data) {
            console.log("\n\n*** Data: " + data);
            hangs.list=data;
        });
    }]);
})();