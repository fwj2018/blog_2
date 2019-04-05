var jhlfs = angular.module('Fxw', []);
jhlfs.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});
jhlfs.controller('mailCtl', ['$scope', '$http', '$location',  function ($scope, $http, $location) {
    layui.use(['form', 'layer', 'laydate', 'table', 'element'], function () {
        var form = layui.form,
            layer = parent.layer === undefined ? layui.layer : top.layer,
            $ = layui.jquery,
            laydate = layui.laydate,
            laytpl = layui.laytpl,
            table = layui.table;
        //获取seo信息
        $http.get('/api/home/mail/get-seo').success(function (res) {
            $scope.seo = res;
        });
		var date=new Date; $scope.year=date.getFullYear();
		//清Redis缓存
		$scope.del = function(){
			$http.get('/api/home/mail/delredis').success(function (res) {
            if(res){
				layer.msg('缓存已清理，请刷新页面！');
			}
        });
		}

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
        //查看文文章
        $scope.read = function (id) {
            window.open("/art_info.html#/" + id);
        };
		
		//获取公告
		$http.get('/api/admin/recruit/lists').success(function (res) {
            $scope.notice = res.data;
        });
		
		//查看文文章
        $scope.notice1 = function (id) {
            window.open("/html/home/notice.html#/" + id);
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
		
		/* //获取banner图信息
		$http.get('/api/home/mail/banner').success(function (res) {
            $scope.ban = res;
        }); */
		
        $scope.top = function () {
            $("html,body").animate({scrollTop:0}, 500);
        }

    });
}]);