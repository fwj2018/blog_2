layui.use(['form','layer','laydate','table','laytpl'],function(){
    var DIR = '';
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;

    //新闻列表
    var tableIns = table.render({
        elem: '#newsList',
        url : DIR + '/api/admin/article/lists',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 15,
        limits : [15,30,50],
        id : "newsListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {type: 'numbers', title: '序号', width:60, align:"center"},
            {field: 'title', title: '文章标题', width:350},
            {field: 'classify', title: '文章类别', align:'center',templet:function(d){
                    // return d.classify == 1 ? '公司新闻' : (d.classify == 2 ? '行业新闻' : '政府新闻');
                    return d.classify == 1 ? '真实情感' : 'Code笔记';
                }},
            {field: 'status', title: '状态',  align:'center',width:80,templet:function (d) {
					// return d.status == "1" ? "<span style='color:green'>显示</span>" : "<span style='color:red'>隐藏</span>";
                    return '<input type="checkbox" name="status" value=' + d.id + ' lay-filter="status" lay-skin="switch" lay-text="在线|隐藏" ' + d.status + '>'
                }},
            {field: 'top', title: '是否置顶', align:'center',width:100, templet:function(d){
                    return '<input type="checkbox" name="newsTop" value=' + d.id + ' lay-filter="newsTop" lay-skin="switch" lay-text="是|否" ' + d.top + '>'
            }},
            {field: 'time', title: '发布时间', align:'center', minWidth:150},
            {title: '操作', width:200, templet:'#newsListBar',fixed:"right",align:"center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        //if($(".searchVal").val() != ''){
            table.reload("newsListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    name: $(".searchVal").val(),
                    type: $('.type select').val()
                }
            });
        //}else{
            //layer.msg("请输入搜索的内容");
        //}
    });

    //监听状态开关按钮
    form.on('switch(status)', function (data) {
        var statusData = {
            id: data.value,
            status: this.checked ? 'checked' : ''
        };
        $.post('/api/admin/article/set-status', statusData, function (res) {
            if (res) {
                layer.msg(statusData.status == 'checked' ? '文章在线设置成功！' : '文章隐藏设置成功！', {icon: 1, time: 2500});
                tableIns.reload();
            }
        });
    });

    //监听指定开关按钮
    form.on('switch(newsTop)', function (data) {
        var topData = {
            id:data.value,
            top:this.checked ? 'checked' : ''
        };
        $.post('/api/admin/article/set-top', topData, function (res) {
            if (res) {
                layer.msg(topData.top == 'checked' ? '置顶成功！' : '取消置顶成功！', {icon: 1, time: 2500});
                tableIns.reload();
            }
        });
    });

    //编辑文章
    function addNews(edit){
        var index = layui.layer.open({
            title: edit == undefined ? '添加文章' : '编辑文章',
            type : 2,
            content : "newsAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find("#id").val(edit.id);
                    body.find(".title").val(edit.title);
                    body.find(".abstract").val(edit.description);
                    body.find(".thumbImg").attr("src",edit.thum);
                    body.find("#content").val(edit.content);
                    // body.find(".newsStatus select").val(edit.status);
                    body.find(".newsStatus input[name='status']").prop("checked",edit.status);
                    body.find(".classify input[name='class'][value='"+edit.classify+"']").prop("checked","checked");
                    body.find(".openness input[name='openness'][title='"+edit.newsLook+"']").prop("checked","checked");
                    body.find(".newsTop input[name='newsTop']").prop("checked",edit.top);
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500);
            }
        })
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize",function(){
            layui.layer.full(index);
        });
    }
    $(".addNews_btn").click(function(){
        addNews();
    });

    //批量删除
    $(".delAll_btn").click(function(){
        var checkStatus = table.checkStatus('newsListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的文章？', {icon: 3, title: '提示信息'}, function (index) {
                $.get(DIR + "/api/admin/article/del?ids=" + newsId, function (data) {
                    layer.msg('文章删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        }else{
            layer.msg("请选择需要删除的文章");
        }
    })

    //列表操作
    table.on('tool(newsList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addNews(data);
        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此文章？',{icon:3, title:'提示信息'},function(index){
                $.get(DIR + "/api/admin/article/del?ids=" + data.id, function (data) {
                    layer.msg('文章删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        } else if(layEvent === 'look'){ //置顶操作
           layer.open({
                type: 1,
                title: data.title,
                area: ['65%', '80%'],
                fixed: false, //不固定
                maxmin: false,
                resize: false,
                content: data.content
            })
        }
    });

});