var jhlfs = angular.module('Art', []);
jhlfs.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});
jhlfs.controller('info', ['$scope', '$http', '$location',  function ($scope, $http, $location) {
    layui.use(['form', 'layer', 'laydate', 'table', 'element'], function () {
        var form = layui.form,
            layer = parent.layer === undefined ? layui.layer : top.layer,
            $ = layui.jquery,
            laydate = layui.laydate,
            laytpl = layui.laytpl,
            table = layui.table;
        //获取所有文章id
        var url = $location.url().substr(1);
        if (url == '' || url == undefined || url == '/') {
            alert('找不到资源');
            return false;
        }
        $http.post('/api/home/mail/num', {id: url}).success(function (res) {
            if (res === false) {
                alert('找不到资源');
                return false;
            }
        });

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
        //获取tpo6文章
        $http.get('/api/home/mail/top6').success(function (res) {
            $scope.top6List = res;
        });
        var getList = function () {
            $http.get('/api/home/mail/getone?id=' + url).success(function (res) {
                $scope.info = res;
                $http.get('/api/home/mail/getmore?id=' + res.id + '&class=' + res.classify).success(function (res1) {
                    $scope.info_more = res1;
                    $scope.info_more.length == 0 ? $scope.show = true : $scope.show = false;
                });
            });
        };
        getList();
        //查看文文章
        $scope.read = function (id) {
            window.open("/art_info.html#/" + id);
        };

        //点赞
        $scope.dz = function (id) {
            $http.post('/api/home/mail/like', {id: id}).success(function (res) {
                if(res){
                    getList(id);
                }
            });
        };

        //最新文章
        $http.get('/api/home/mail/new5').success(function (res) {
            $scope.news5 = res;
        });

        //按点击量排行
        $http.get('/api/home/mail/click8').success(function (res) {
            $scope.c5 = res;
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