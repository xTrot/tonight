(function() {
    var app = angular.module('profileApp', []);

    app.controller('profileController', ['$http',function($http){
        var profile = this;
   
        
        $http.get('/query/profile').success(function (data) {
            console.log("\n\n*** Data: " + data);
            profile.items=data;
        });
    }]);
})();