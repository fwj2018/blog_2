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
        elem: '#mienList',
        url : DIR + '/api/admin/mien/lists',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 5,
        limits : [5,10,15],
        id : "mienListTable",
        cols : [[
            {type: "checkbox", width:50},
            {type: 'numbers', title: '序号', width:60, align:"center"},
            {field: 'name', title: '标题', width:200},
            {field: 'thum', title: '缩略图',align:'center',height:80, width:200,templet:function (d) {
                    return '<img src="' + d.thum + '" height:100 />';
                }},
            {field: 'classify', title: '图片类型', align:'center',templet:function(d){
                    return d.classify == 1 ? '公司产品' : (d.classify == 2 ? '轮播图' : '公司风采');
                }},
            {field: 'status', title: '发布状态',  align:'center',templet:function (d) {
					return d.status == "1" ? "<span style='color:green'>显示</span>" : "<span style='color:red'>隐藏</span>";
                }},
            {field: 'time', title: '发布时间', align:'center', minWidth:150},
            {title: '操作', width:130, templet:'#mienListBar',fixed:"right",align:"center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("mienListTable",{
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

    //编辑图片
    function addNews(edit){
        var index = layui.layer.open({
            title: edit == undefined ? '添加风采' : '编辑风采',
            type : 2,
            content : "mienAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find("#id").val(edit.id);
                    body.find(".name").val(edit.name);
                    body.find(".abstract").val(edit.description);
                    body.find(".thumbImg").attr("src",edit.thum);
                    body.find("#content").val(edit.content);
                    body.find(".newsStatus select").val(edit.status);
                    body.find(".classify input[name='class'][value='"+edit.classify+"']").prop("checked","checked");
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回公司风采列表', '.layui-layer-setwin .layui-layer-close', {
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
        var checkStatus = table.checkStatus('mienListTable'),
            data = checkStatus.data,
            newsId = [];
        if(data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            layer.confirm('确定删除选中的图片？', {icon: 3, title: '提示信息'}, function (index) {
                $.get(DIR + "/api/admin/mien/del?ids=" + newsId, function (data) {
                    layer.msg('图片删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        }else{
            layer.msg("请选择需要删除的图片");
        }
    })

    //列表操作
    table.on('tool(mienList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;

        if(layEvent === 'edit'){ //编辑
            addNews(data);
        } else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此图片？',{icon:3, title:'提示信息'},function(index){
                $.get(DIR + "/api/admin/mien/del?ids=" + data.id, function (data) {
                    layer.msg('图片删除成功！');
                    tableIns.reload();
                    layer.close(index);
                });
            });
        } else if(layEvent === 'settop'){ //置顶操作
            //判断是否为置顶状态
            $.post('/api/admin/mien/set-top', {id: data.id}, function (res) {
                if (!res) {
                    layer.msg('产品已置顶！', {icon: 2, time: 2500});
                } else {
                    layer.msg('产品置顶成功！');
                    tableIns.reload();
                }
            });
        }
    });

});