angular.module('APP', [])
.controller('login', ['$scope', '$http', function ($scope, $http) {
    var DIR = '';
    layui.use(['layer','form','element'], function () {
        var layer = layui.layer;element = layui.element;
        $scope.postData = {
            name: '',
            passwd: '',
            verify:''
        };
        $scope.submit = function () {
            $.post(DIR + '/api/admin/index/login', $scope.postData, function (res) {
                if (res !== true) {
                    for (var i in res) {
                        if (i == 'verify') {
                            layer.msg(res[i], {icon: 2, time: 2500});
                            creatCode();
                        } else {
                            layer.tips(res[i], '#' + i, {tips: [2, '#FF4E4E'], tipsMore: true, time: 2000});
                        }
                        return false;
                    }
                }
                window.location.href = (DIR + '/html/admin/demo.html');
            });

        };
        //获取验证码
        var creatCode = function () {
            $http.get(DIR + '/api/admin/index/captcha?refresh').success(function (res) {
                // $('#code').attr('src', res.url);
                $scope.img = res.url;
            });
        };
        creatCode();

        $scope.click = function () {
            creatCode();
        };
    });

}]);