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
        elem: '#aboutList',
        url : DIR + '/api/admin/about/lists',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 15,
        limits : [15,30,50],
        id : "aboutListTable",
        cols : [[
            // {type: "checkbox", fixed:"left", width:60},
            // {field: 'id', title: 'ID', width:60, align:"center"},
            {field: 'flag', title: '类别', width:162,style:'font-weight:bold',templet:function(d){
                    return d.flag == 1 ? '公司简介' : (d.flag == 2 ? '企业文化' : '联系我们');
                }},
            {field: 'title', title: '标题', align:'center',width:200},
            {field: 'content', title: '内容', width: 880 ,height:50},
            {title: '操作', width:130, templet:'#aboutListBar',fixed:"right",align:"center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("aboutListTable",{
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

    //编辑招聘信息
    function addNews(edit){
        var index = layui.layer.open({
            title: edit == undefined ? '添加招聘' : '编辑招聘',
            type : 2,
            content : "aboutAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find("#id").val(edit.id);
                    body.find(".title").val(edit.title);
                    body.find("#content").val(edit.content);
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回公司简介列表', '.layui-layer-setwin .layui-layer-close', {
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
        var checkStatus = table.checkStatus('aboutListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的招聘信息？', {icon: 3, title: '提示信息'}, function (index) {
                $.get(DIR + "/api/admin/recruit/del?ids=" + newsId, function (data) {
                    layer.msg('招聘信息删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        }else{
            layer.msg("请选择需要删除的招聘信息");
        }
    })

    //列表操作
    table.on('tool(aboutList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addNews(data);
        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此招聘信息？',{icon:3, title:'提示信息'},function(index){
                $.get(DIR + "/api/admin/recruit/del?ids=" + data.id, function (data) {
                    layer.msg('招聘信息删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        } else if(layEvent === 'settop'){ //置顶操作
            //判断是否为置顶状态
            $.post('/api/admin/article/set-top', {id: data.id}, function (res) {
                if (!res) {
                    layer.msg('招聘信息已置顶！', {icon: 2, time: 2500});
                } else {
                    layer.msg('招聘信息置顶成功！');
                    tableIns.reload();
                }
            });
        }
    });

});