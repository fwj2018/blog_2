var jhlfs = angular.module('Fxw', ['ui.router', 'oc.lazyLoad'])
    .config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
        function ($provide, $compileProvider, $controllerProvider, $filterProvider) {
            jhlfs.controller = $controllerProvider.register;
            jhlfs.directive = $compileProvider.register;
            jhlfs.filter = $filterProvider.register;
            jhlfs.factory = $provide.factory;
            jhlfs.service = $provide.service;
            jhlfs.constant = $provide.constant;
        }])
    .constant("Module_Config")
    .config(["$ocLazyLoadProvider", 'Module_Config', function ($ocLazyLoadProvider, Module_Config) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false,
            modules: Module_Config
        });
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('index/2018');
        $stateProvider
            .state('/', {
                url: '/index',
                templateUrl: 'html/partial/index/index.html',
                controller: '2018Ctl',
                resolve: {
                    deps: ["$ocLazyLoad", function ($oclazyLoad) {
                        return $oclazyLoad.load(["/html/src/controller/index/2018Ctl.js"]);
                    }]
                }
            })

    }])

    //公共部分内容
    .controller('MailCtl', ['$scope', '$http', '$state', '$interval', function ($scope, $http, $state, $interval) {
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

            //个人名片
            $scope.personal = {
                name: '张大海',
                job: 'WEB开发工程师',
                addr: '中国|西安',
                qq: '251630332@qq.com'
            };

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
                $('#copyright').html('版权所有 © ' + date.getFullYear() + ' 技术支持：大海子&小丸子     当前时间：' + currentDate);
            };
            getCurrentDate();
            $interval(function () {
                getCurrentDate();
            }, 1000);
            //退出操作
            $scope.logonout = function () {
                layer.confirm("是否退出当前帐户？", {
                    icon: 1,
                    time: 0, //不自动关闭,
                    btn: ['是', '否'],
                    btn1: function (index) {
                        layer.close(index);
                        $http.get('/api/admin/index/exit').success(function (res) {
                            if (res) {
                                window.location.href = 'index.html';
                            } else {
                                layer.msg('退出失败', {icon: 2, time: 1500});
                            }
                        });
                        layer.msg('退出成功！', {icon: 1, time: 1500});
                    },
                    btn2: function (index) {
                        layer.close(index);
                    }
                })
            };
            //开启登录
            // var isOn = function () {
            //     $http.get('/api/admin/index/session').success(function (res) {
            //         if (res === 'null') {
            //             window.location.href = 'index.html';
            //             return false;
            //         } else {
            //             $scope.username = res;
            //         }
            //     });
            // };
            // isOn();
            // $interval(function () {
            //     isOn();
            // }, 3000);

        });
    }]);