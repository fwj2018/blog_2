layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#userList',
        url : '/api/admin/user/lists',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [5,10,15],
        limit : 5,
        id : "userListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'name', title: '用户名', minWidth:100, align:"center"},
            {field: 'email', title: '用户邮箱', minWidth:180, align:'center'},
            {field: 'sex', title: '性别', align:'center',width:80,templet:function(d){
                    return d.sex == "1" ? "男" : (d.sex == "0" ? "女" : "保密");
                }},
            {field: 'status', title: '状态',  align:'center',width:80,templet:function(d){
				// return d.status == "1" ? "<span style='color:green'>正常</span>" : "<span style='color:red'>禁用</span>";
                    return '<input type="checkbox" name="status" value=' + d.id + ' lay-filter="status" lay-skin="switch" lay-text="正常|禁用" ' + d.status + '>'
            }},
            {field: 'level', title: '用户等级', align:'center',templet:function(d){
                if(d.level == "1"){
                    return "注册会员";
                }else if(d.level == "2"){
                    return "中级会员";
                }else if(d.level == "3"){
                    return "高级会员";
                }else if(d.level == "4"){
                    return "钻石会员";
                }else if(d.level == "5"){
                    return "超级会员";
                }
            }},
            {field: 'last_time', title: '最后登录时间', align:'center',minWidth:150},
            {title: '操作', minWidth:110, templet:'#userListBar',fixed:"right",align:"center"}
        ]]
    });

    //监听指定开关按钮
    form.on('switch(status)', function (data) {
        var topData = {
            id: data.value,
            status: this.checked ? 'checked' : ''
        };
        $.post('/api/admin/user/set-status', topData, function (res) {
            if (res) {
                layer.msg(topData.status == 'checked' ? '用户取消禁用成功！' : '用户禁用成功！', {icon: 1, time: 2500});
                tableIns.reload();
            }
        });
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("userListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    name: $(".searchVal").val()  //搜索的关键字
                }
            });
        }else{
            layer.msg("请输入搜索的内容");
        }
    });

    //添加用户
    function addUser(edit){
        var index = layui.layer.open({
            title: edit == undefined ? '添加用户' : '编辑用户',
            type : 2,
            content : "userAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find(".userName").attr('disabled',true);
                    body.find("#password").css('display','none');
                    body.find("#id").val(edit.id);
                    body.find(".userName").val(edit.name);  //登录名
                    body.find(".userPass").val(edit.pass);  //密码
                    body.find(".userEmail").val(edit.email);  //邮箱
                    body.find(".userSex input[value="+edit.sex+"]").prop("checked","checked");  //性别
                    body.find(".userGrade").val(edit.level);  //会员等级
                    // body.find(".userStatus").val(edit.status);    //用户状态
                    body.find(".userStatus input[name='status']").prop("checked",edit.status);
                    body.find(".userDesc").text(edit.brief);    //用户简介
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回用户列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)
            }
        })
        layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    $(".addNews_btn").click(function(){
        addUser();
    })

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的用户？', {icon: 3, title: '提示信息'}, function (index) {
                $.get('/api/admin/user/del?ids='+ newsId,function (data) {
                    layer.msg('用户删除成功！');
                    tableIns.reload();
                    layer.close(index);
                })
            })
        }else{
            layer.msg("请选择需要删除的用户");
        }
    })

    //列表操作
    table.on('tool(userList)', function(obj){

        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){ //编辑
            addUser(data);
        }else if(layEvent === 'usable'){ //启用禁用
            var _this = $(this),
                usableText = "是否确定禁用此用户？",
                btnText = "已禁用";
            if(_this.text()=="已禁用"){
                usableText = "是否确定启用此用户？",
                btnText = "已启用11";
            }
            layer.confirm(usableText,{
                icon: 3,
                title:'系统提示',
                cancel : function(index){
                    layer.close(index);
                }
            },function(index){
                _this.text(btnText);
                layer.close(index);
            },function(index){
                layer.close(index);
            });
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此用户？',{icon:3, title:'提示信息'},function(index){
                $.get("/api/admin/user/del?ids=" + data.id, function (data) {
                    layer.msg('用户删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        }
    });

});
