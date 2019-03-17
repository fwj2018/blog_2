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
            var limit = 9;
            $http.get('/api/home/mail/gettot?type=3').success(function (res) {
                laypage.render({ //layui分页
                    elem: 'laypage1',  //分页容器id
                    count: res,//总条数
                    curr: currPage,//当前页
                    limit: limit,//每页的条数
                    limits: [9, 12, 18],//可选择每页数目
                    prev: "<<",//上一页图标
                    next: ">>",//下一页图标
                    theme: "#2a7497",//分页主色
                    // layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],//设置分页组件显示
                    layout: ['prev', 'page', 'next', 'skip'],//设置分页组件显示
                    jump: function (obj, first) {
                        if (!first) { //设置首次渲染分页无需走业务逻辑处理函数，不然会陷入死循环
                            currPage = obj.curr;
                            limit = obj.limit;
                            $http.get('/api/home/mail/getall?type=1&class=1&key=&page=' + currPage + '&limit=' + limit).success(function (res) {
                                $scope.allNews = res;

                            });
                        } else {
                            currPage = obj.curr;
                            limit = obj.limit;
                            $http.get('/api/home/mail/getall?type=1&class=1&key=&page=' + currPage + '&limit=' + limit).success(function (res) {
                                $scope.allNews = res;

                            });
                        }

                    }
                })
            });

        };
        List();

        //查看文文章
        $scope.read = function (id) {
            window.open("/art_info.html#/" + id);
        };

        //按点击量排行
        $http.get('/api/home/mail/click8').success(function (res) {
            $scope.c5 = res;
        });
		
		//查看公告
		$http.get('/api/home/mail/').success(function (res) {
            $scope.link = res;
        });

        //友链
        $http.get('/api/home/mail/link').success(function (res) {
            $scope.link = res;
        });

        //站点信息
        $http.get('/api/home/mail/site-info').success(function (res) {
            $scope.siteInfo = res;
        });
        $scope.top = function () {
            $("html,body").animate({scrollTop:0}, 500);
        }

    });
}]);