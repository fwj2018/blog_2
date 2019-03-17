layui.use(['form','layer','layedit','laydate','upload'],function(){
    var DIR = '';
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery;
    var ue = UE.getEditor('content');

    //用于同步编辑器内容到textarea
    layedit.sync(editIndex);

    form.on("submit(addRecruit)",function(data){
        //截取文章内容中的一部分文字放入文章摘要
        // var abstract = layedit.getText(editIndex).substring(0,50);
        //弹出loading
        // var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        //实际使用时的提交信息
        $.post('/api/admin/recruit/recruit-edit',{
            id: $('#id').val(),
            name : $(".name").val(),  //岗位名称
            num : $(".num").val(),  //招聘人数
            money : $(".money").val(),  //工资
            // content : layedit.getContent(editIndex).split('<audio controls="controls" style="display: none;"></audio>')[0],  //文章内容
            content: ue.getContent(),
            edu :data.field.class,    //学历要求
            status : $('.newsStatus select').val(),    //发布状态
        },function(){
            // top.layer.close(index);
            $('#id').val() != '' ? top.layer.msg("招聘编辑成功！") : top.layer.msg("招聘添加成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        }).error(function (msg) {
            layer.msg(eval(msg.responseText)[0].message, {icon: 2, time: 2500});
        });
        return false;
    });

    //创建一个编辑器
    var editIndex = layedit.build('news_content',{
        height : 350,
        uploadImage: {
            url: DIR + '/api/admin/recruit/upload-image', //接口url
            type: 'post' //默认post
        }
    });

});