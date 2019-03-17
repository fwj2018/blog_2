var jhlfs = angular.module('App', []);
jhlfs.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});
jhlfs.controller('time1', ['$scope', '$http', '$location',  function ($scope, $http, $location) {
    layui.use(['form', 'layer', 'laydate', 'table', 'element', 'laypage'], function () {
        var form = layui.form,
            layer = parent.layer === undefined ? layui.layer : top.layer,
            $ = layui.jquery,
            laydate = layui.laydate,
            laytpl = layui.laytpl,
            table = layui.table;
            laypage = layui.laypage;
        //获取seo信息
        $http.get('/api/home/mail/get-seo').success(function (res) {
            $scope.seo = res;
        });
        //个人名片
        $scope.p = {
            name: '张大海',
            job: 'WEB开发工程师',
            addr: '中国 | 西安',
            qq: '251630332@qq.com'
        };

        var List = function () {
            var currPage = 1;
            var limit = 10;
            $http.get('/api/home/mail/get-mess-num').success(function (res) {
                laypage.render({ //layui分页
                    elem: 'laypage1',  //分页容器id
                    count: res,//总条数
                    curr: currPage,//当前页
                    limit: limit,//每页的条数
                    limits: [10, 20, 30],//可选择每页数目
                    prev: "<<",//上一页图标
                    next: ">>",//下一页图标
                    theme: "#2a7497",//分页主色
                    // layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],//设置分页组件显示
                    layout: ['prev', 'page', 'next', 'skip'],//设置分页组件显示
                    jump: function (obj, first) {
                        if (!first) { //设置首次渲染分页无需走业务逻辑处理函数，不然会陷入死循环
                            currPage = obj.curr;
                            limit = obj.limit;
                            $http.get('/api/home/mail/mess-list?page=' + currPage + '&limit=' + limit).success(function (res) {
                                $scope.mess = res;

                            });
                        } else {
                            currPage = obj.curr;
                            limit = obj.limit;
                            $http.get('/api/home/mail/mess-list?page=' + currPage + '&limit=' + limit).success(function (res) {
                                $scope.mess = res;

                            });
                        }

                    }
                })
            });

        };
        List();

        $scope.top = function () {
            $("html,body").animate({scrollTop:0}, 500);
        };
        $scope.content = '';
        //留言
        $scope.liuyan = function () {
            if ($scope.content == '') {
                layer.msg('留言内容不能为空。', {icon:2});
                return false;
            }
            $http.post('/api/home/mail/mess', {mess: $scope.content}).success(function (res) {
                if(res){
                    layer.msg('留言成功。', {icon:1});
                    List();
					$scope.content = '';
                }
            });
        }

    });
}]);