angular.module('App', [])
    .controller('wanz', ['$scope', '$http',function ($scope,$http) {
        var DIR = '';
    //获取系统时
        var getCurrentDate = function () {
            var date = new Date();
            var year = date.getFullYear(); // 年
            var month = date.getMonth() + 1; // 月
            var day = date.getDate(); // 日
            var hour = date.getHours(); // 时
            var minutes = date.getMinutes(); // 分
            var seconds = date.getSeconds();//秒
            var weekArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            var week = weekArr[date.getDay()];
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (day >= 0 && day <= 9) {
                day = '0' + day;
            }
            if (hour >= 0 && hour <= 9) {
                hour = '0' + hour;
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = '0' + minutes;
            }
            if (seconds >= 0 && seconds <= 9) {
                seconds = '0' + seconds;
            }
            //组装时间
            var currentDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds + ' ' + week;
            $('#nowTime').html(currentDate);
        };
        getCurrentDate();
        setInterval(function () {
            getCurrentDate();
        }, 1000);

    layui.use(['form', 'element', 'layer', 'jquery'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        element = layui.element;
    $ = layui.jquery;
    //上次登录时间【此处应该从接口获取，实际使用中请自行更换】

    //icon动画
    $(".panel a").hover(function () {
        $(this).find(".layui-anim").addClass("layui-anim-scaleSpring");
    }, function () {
        $(this).find(".layui-anim").removeClass("layui-anim-scaleSpring");
    });
    $(".panel a").click(function () {
        parent.addTab($(this));
    });
    //系统基本参数
    $http.get(DIR + '/api/admin/index/get-basic-info').success(function (res) {
        $scope.basicData = res;
    });
    //获取模块总条数
    $http.get(DIR + '/api/admin/index/get-gather').success(function (res) {
        $scope.gatherData = res;
    });
    //最新文章列表 top5
    $.get(DIR + '/api/admin/index/article-top5', function (data) {
        var hotNewsHtml = '';
        for (var i = 0; i < data.length; i++) {
            hotNewsHtml += '<tr>'
                + '<td align="left"><a href="javascript:;"> ' + data[i].title + '</a></td>'
                + '<td width="140px">' + data[i].time + '</td>'
                + '</tr>';
        }
        $(".hot_news").html(hotNewsHtml);
        $(".userAll span").text(data.length);
    });

    //用户数量
    // $.get("../json/userList.json", function (data) {
    //     $(".userAll span").text(data.count);
    // })
    //
    // //外部图标
    // $.get(iconUrl, function (data) {
    //     $(".outIcons span").text(data.split(".icon-").length - 1);
    // })

});

}]);