var app = angular.module('APP', []);
app.controller('myCtrol', ['$scope', '$http', function ($scope, $http) {
    var DIR = '';
    layui.use(['layer','form','laypage'], function () {
        var layer = layui.layer;
        $scope.postData = {
            name: '',
            passwd: '',
            verify:''
        };
        $scope.submit = function () {
            $.post(DIR + '/api/admin/index/login', $scope.postData, function (res) {
                if (res !== true) {
                    for (var i in res) {
                        layer.tips(res[i], '#' + i, {tips: [2, '#FF4E4E'], tipsMore: true, time: 2000});
                        creatCode();
                        return false;
                    }
                }
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

        var layuiPage = function () {
            $http.get(DIR + '/api/admin/index/list')
                .success(function (res) {
                    var laypage = layui.laypage;
                    var currPage = 1;
                    var limit = 10
                    var count = eval(res)._meta.totalCount;
                    laypage.render({ //layui分页
                        elem: 'page',  //分页容器id
                        count: count,//总条数
                        curr: currPage,//当前页
                        limit: limit,//每页的条数
                        limits: [10, 30, 50],//可选择每页数目
                        prev: "<",//上一页图标
                        next: ">",//下一页图标
                        // theme: "#2a7497",//分页主色
                        theme: "#428bca",//分页主色
                        layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],//设置分页组件显示
                        jump: function (obj, first) {
                            currPage = obj.curr;
                            limit = obj.limit;
                            $http.get(DIR + '/api/admin/index/list?page=' + currPage + '&per-page=' + limit)
                                .success(function (res) {
                                    $scope.policyItems = eval(res).items;
                                });
                        }
                    });
                });
        };
        layuiPage();
        $scope.reflesh = function () {
            layuiPage();
            layer.msg('列表刷新成功！', {icon: 1, time: 2500});
        };

    });

}]);