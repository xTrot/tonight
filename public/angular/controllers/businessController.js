(function() {
    var app = angular.module('businessApp', ['business-directive']);

    app.controller('businessController', ['$http',function($http){
        var businessObj = this;
        businessObj.business = [];
        
        $http.get('/query/business').success(function (data) {
            console.log("\n\n*** Data: " + data);
            businessObj.business=data;
        });
        
        //$http.get('/jsondata/business.json').success(function (data) {
        //    businessObj.groups=data;
        //});
    }]);
})();