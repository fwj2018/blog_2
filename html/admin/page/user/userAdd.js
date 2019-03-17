layui.use(['form','layer'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    form.on("submit(addUser)",function(data){
        //弹出loading
        //var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        //实际使用时的提交信息
        $.post('/api/admin/user/add-or-edit', {
            id: $('#id').val(),
            name: $(".userName").val(),  //登录名
            pass: $(".userPass").val(),  //密码
            email: $(".userEmail").val(),  //邮箱
            sex: data.field.sex,  //性别
            level: data.field.userGrade,  //会员等级
            // status: data.field.userStatus,    //用户状态
            status : data.field.status == 'on' ? 'checked' : '',   //是否置顶
            date: submitTime,    //添加时间
            brief: $(".userDesc").val(),    //用户简介
        }, function (res) {
            $('#id').val() != '' ? top.layer.msg("用户编辑成功！") : top.layer.msg("用户添加成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        }).error(function (msg) {
            layer.msg(eval(msg.responseText)[0].message, {icon: 2, time: 2500});
        });
        return false;
    });

    //格式化时间
    function filterTime(val){
        if(val < 10){
            return "0" + val;
        }else{
            return val;
        }
    }
    //定时发布
    var time = new Date();
    var submitTime = time.getFullYear()+'-'+filterTime(time.getMonth()+1)+'-'+filterTime(time.getDate())+' '+filterTime(time.getHours())+':'+filterTime(time.getMinutes())+':'+filterTime(time.getSeconds());

})