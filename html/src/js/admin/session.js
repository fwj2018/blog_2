layui.use(['element', 'layer'], function () {
    var layer = layui.layer, element = layer.element;
    var DIR = '';
    var ifSession = function () {
        $.get(DIR + '/api/admin/index/session', function (res) {
            if (res === 'null') {
                window.location.href = (DIR + '/html/admin/page/login/login.html');
                return false;
            }
            $('#username').html(res);
            $('#username1').html(res);
            $('#name').val(res);
        });
    };
    ifSession();
    setInterval(function () {
        ifSession();
    }, 3000);
    //清除缓存
    $('.clearCache').click(function () {
        var index = layer.msg('清除缓存中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.get(DIR + '/api/admin/index/clear-cache', function (res) {
            if (res) {
                setTimeout(function () {
                    layer.close(index);
                    layer.msg('缓存清除成功！');
                }, 1000);
            }
        });

    });

    //用户退出
    $('#loginout').click(function () {
        layer.confirm('确定要退出登录吗？', {
            btn: ['确定', '取消'],
            btnAlign: 'c'
        }, function () {
            $.get(DIR + '/api/admin/index/exit', function (res) {
                if (res) {
                    window.location.href = (DIR + '/html/admin/page/login/login.html');
                }
            });
        }, function () {
        });
    });

    //修改密码
    $('#changePwd').click(function () {
        var index = layer.load(0, {shade: false});
        var changeData = {
            name: $('#name').val(),
            repasswd: $('#repasswd').val(),
            newpass: $('#newpass').val(),
            surepass: $('#surepass').val()
        };
        $.post(DIR + '/api/admin/index/change-pwd', changeData, function () {
            $('#repasswd').val(''),
            $('#newpass').val(''),
            $('#surepass').val('')
            layer.msg('密码修改成功！');
            layer.close(index);
        }).error(function (msg) {
            layer.msg(eval(msg.responseText)[0].message, {icon: 2, time: 2500});
            layer.close(index);
        });
    });

    //获取上册登录时间
    $.get(DIR + '/api/admin/index/get-gather', function (res) {
        $('.lastTime').html(res.last_time);
    });
});
