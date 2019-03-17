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

    form.on("submit(addAbout)",function(data){
        //截取文章内容中的一部分文字放入文章摘要
        //弹出loading
        //实际使用时的提交信息
        $.post('/api/admin/about/about-edit',{
            id: $('#id').val(),
            title : $(".title").val(),  //岗位名称
            content: ue.getContent()
        },function(res){
            $('#id').val() != '' ? top.layer.msg("内容编辑成功！") : top.layer.msg("内容添加成功！");
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
        height : 500,
        uploadImage: {
            url: '/api/admin/about/upload-image', //接口url
            type: 'post' //默认post
        }
    });

});