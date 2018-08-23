var httpService = angular.module('httpService', []);


httpService.factory("$httpService",function ($http, $q) {
    var $httpService = {};
    $httpService.getData = function (url,method,params) {
        var defer = $q.defer(),
            urls = "http://pc.ticket.glchuxingwang.com" + url,
            headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'};
        if (method === 'GET') {
            $http({
                url: urls,
                method: "GET",
                headers: headers,
                params: params,
                timeout: 5000,
            }).success(function (data) {

                defer.resolve(data);
            }).
            error(function (data, status, headers, config) {
                defer.reject(data);
            });
        } else {
            $http({
                url: urls,
                method: method,
                headers: headers,
                data: params,
                timeout: 5000,
            }).success(function (data) {
                defer.resolve(data);
            }).
            error(function (data, status, headers, config) {
                // defer.resolve(data);
                defer.reject(data);
            });
        }
        return defer.promise;
    };
    return $httpService;
});
