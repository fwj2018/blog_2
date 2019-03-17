angular.module('APP', [])
    .controller('login', ['$scope', '$http', function ($scope, $http) {
        var DIR = '';
        $scope.postData = {
            name: '',
            passwd: '',
            verify: ''
        };
        layui.use(['form', 'layer', 'jquery'], function () {
            var form = layui.form,
                layer = parent.layer === undefined ? layui.layer : top.layer
            $ = layui.jquery;

            $(".loginBody .seraph").click(function () {
                layer.msg("这只是做个样式，至于功能，你见过哪个后台能这样登录的？还是老老实实的找管理员去注册吧", {
                    time: 5000
                });
            });

            //登录按钮
            form.on("submit(login)", function () {
                $.post(DIR + '/api/admin/index/login', $scope.postData, function () {
                    window.location.href = (DIR + '/html/admin/index.html');
                }).error(function (msg) {
                    // if (eval(msg.responseText)[0].field == 'verify') {
                    //     creatCode();
                    // }
                    creatCode();//刷新验证码
                    layer.msg(eval(msg.responseText)[0].message, {icon: 2, time: 2500});
                });
            });
            //获取验证码
            var creatCode = function () {
                $http.get(DIR + '/api/admin/index/captcha?refresh').success(function (res) {
                    $scope.img = res.url;
                });
            };
            creatCode();

            $scope.click = function () {
                creatCode();
            };

            //表单输入效果
            $(".loginBody .input-item").click(function (e) {
                e.stopPropagation();
                $(this).addClass("layui-input-focus").find(".layui-input").focus();
            })
            $(".loginBody .layui-form-item .layui-input").focus(function () {
                $(this).parent().addClass("layui-input-focus");
            })
            $(".loginBody .layui-form-item .layui-input").blur(function () {
                $(this).parent().removeClass("layui-input-focus");
                if ($(this).val() != '') {
                    $(this).parent().addClass("layui-input-active");
                } else {
                    $(this).parent().removeClass("layui-input-active");
                }
            });
        });
    }]);
