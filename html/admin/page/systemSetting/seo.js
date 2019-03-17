layui.use(['form','layer','layedit','laydate','upload'],function(){
    var form = layui.form;
    layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;
    //上传缩略图
    upload.render({
        elem: '.thumbBox',
        url: '/api/admin/seo/upload-image',
        method : 'post',  //此处是为了演示之用，实际使用中请将此删除，默认用post方式提交
        done: function(res, index, upload){
            $('.thumbImg').attr('src',res.data.src);
            $('.thumbBox').css("background","#fff");
        }
    });
    //获取seo信息
    $.get('/api/admin/seo/info', function (res) {
        $('#title').val(res.title);
        $('#keywords').val(res.keywords);
        $('#description').val(res.description);
    });

    //重置
    $('#reset').click(function () {
        $('#title').val('');
        $('#keywords').val('');
        $('#description').val('');
    });

    //修改seo
    $('#set').click(function () {
        var changeData = {
            id:1,
            title: $('#title').val(),
            keywords: $('#keywords').val(),
            description: $('#description').val(),
        };
        $.post('/api/admin/seo/seo-edit', changeData, function (res) {
            layer.msg('seo设置成功！');
        }).error(function (msg) {
            layer.msg(eval(msg.responseText)[0].message, {icon: 2, time: 2500});
        });
    });

    //获取公司logo、电话
    var getInfo = function () {
        $.get('/api/admin/seo/get-basic',function (res) {
            $('#tel').val(res.tel);
            $('.thumbImg').attr('src', res.logo);
        });
    };
    getInfo();
    //修改信息
    $('#setLogo').click(function () {
        var basicData = {
            id: 1,
            logo: $('.thumbImg').attr('src'),
            tel: $('#tel').val()
        };
        $.post('/api/admin/seo/basic-edit', basicData, function (res) {
            getInfo();
            layer.msg('公司信息设置成功！');
        }).error(function (msg) {
            layer.msg(eval(msg.responseText)[0].message, {icon: 2, time: 2500});
        });


    });


});