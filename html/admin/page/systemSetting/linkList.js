layui.use(['form','layer','laydate','table','upload'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        upload = layui.upload,
        table = layui.table;

    //友链列表
    var tableIns = table.render({
        elem: '#linkList',
        url : '/api/admin/link/lists',
        page : true,
        cellMinWidth : 95,
        height : "full-104",
        limit : 5,
        limits : [5,10,15],
        id : "linkListTab",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'pic', title: 'LOGO', width:100, align:"center",templet:function(d){
                return '<a href="'+d.websiteUrl+'" target="_blank"><img src="'+d.pic+'" height="26" /></a>';
            }},
            {field: 'url_name', title: '网站名称', minWidth:100},
            {field: 'url', title: '网站地址',width:180,templet:function(d){
                return '<a class="layui-blue" href="'+d.url+'" target="_blank">'+d.url+'</a>';
            }},
            {field: 'mail', title: '站长邮箱',minWidth:200, align:'center'},
            {
                field: 'status', title: '状态', align: 'center', width: 80, templet: function (d) {
                    // return d.status == "checked" ? "<span style='color:green'>显示</span>" : "<span style='color:red'>隐藏</span>";
                    return '<input type="checkbox" name="showAddress" value=' + d.id + ' lay-filter="status" lay-skin="switch" lay-text="显示|隐藏" ' + d.status + '>'

                }
            },
            {field: 'time', title: '添加时间', align:'center',minWidth:100},
            {title: '操作', width:130,fixed:"right",align:"center", templet:function(){
                return '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>';
            }}
        ]]
    });

    //监听指定开关按钮
    form.on('switch(status)', function (data) {
        var topData = {
            id: data.value,
            status: this.checked ? 'checked' : ''
        };
        $.post('/api/admin/link/set-status', topData, function (res) {
            if (res) {
                layer.msg(topData.status == 'checked' ? '友链显示成功！' : '友链隐藏成功！', {icon: 1, time: 2500});
                tableIns.reload();
            }
        });
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("linkListTab",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    name: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            layer.msg("请输入搜索的内容");
        }
    });

    //添加友链
    function addLink(edit){
        var index = layer.open({
            title: edit == undefined ? '添加友链' : '编辑友链',
            type : 2,
            area : ["300px","385px"],
            content : "page/systemSetting/linksAdd.html",
            success : function(layero, index){
                var body = $($(".layui-layer-iframe",parent.document).find("iframe")[0].contentWindow.document.body);
                if(edit){
                    body.find("#id").val(edit.id);
                    body.find(".linkLogo").css("background","#fff");
                    body.find(".linkLogoImg").attr("src",edit.pic);
                    body.find(".linkName").val(edit.url_name);
                    body.find(".linkUrl").val(edit.url);
                    body.find(".masterEmail").val(edit.mail);
                    body.find(".showAddress").prop("checked",edit.status);
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回友链列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500);
            }
        });
    }
    $(".addLink_btn").click(function(){
        addLink();
    });

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('linkListTab'),
            data = checkStatus.data,
            linkId = [];
        if(data.length > 0) {
            for (var i in data) {
                linkId.push(data[i].id);
            }
            layer.confirm('确定删除选中的友链？', {icon: 3, title: '提示信息'}, function (index) {
                $.get('/api/admin/link/del?ids=' + linkId, function (data) {
                    layer.msg('友情链接删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        }else{
            layer.msg("请选择需要删除的友链");
        }
    });

    //列表操作
    table.on('tool(linkList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addLink(data);
        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此友链？',{icon:3, title:'提示信息'},function(index){
                $.get('/api/admin/link/del?ids=' + data.id, function (data) {
                    layer.msg('友情链接删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        }
    });

    //上传logo
    upload.render({
        elem: '.linkLogo',
        url: '/api/admin/link/upload-image',
        method : "post",  //此处是为了演示之用，实际使用中请将此删除，默认用post方式提交
        done: function(res, index, upload){
            $('.linkLogoImg').attr('src', res.data.src);
            $('.linkLogo').css("background", "#fff");
        }
    });

    //格式化时间
    function filterTime(val){
        if(val < 10){
            return "0" + val;
        }else{
            return val;
        }
    }
    //添加时间
    var time = new Date();
    var submitTime = time.getFullYear()+'-'+filterTime(time.getMonth()+1)+'-'+filterTime(time.getDate())+' '+filterTime(time.getHours())+':'+filterTime(time.getMinutes())+':'+filterTime(time.getSeconds());

    form.on("submit(addLink)",function(data){
        //弹出loading
        //var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        // 实际使用时的提交信息
        $.post('/api/admin/link/link-edit',{
            id: $('#id').val(),
            pic : $(".linkLogoImg").attr("src"),  //logo
            url_name : $(".linkName").val(),  //网站名称
            url : $(".linkUrl").val(),    //网址
            mail : $('.masterEmail').val(),    //站长邮箱
            status : data.field.showAddress == "on" ? "checked" : "",    //展示位置
            time : submitTime,    //发布时间
        },function(res){
            // top.layer.close(index);
            $('#id').val() != '' ? top.layer.msg("友链编辑成功！") : top.layer.msg("友链添加成功！");
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show",parent.document).find("iframe")[0].contentWindow.location.reload();
        }).error(function (msg) {
            layer.msg(eval(msg.responseText)[0].message, {icon: 2, time: 2500});
        });
        return false;
    });

});