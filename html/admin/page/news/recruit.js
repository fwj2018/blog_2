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
        elem: '#recruitList',
        url : DIR + '/api/admin/recruit/lists',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limit : 15,
        limits : [15,30,50],
        id : "recruitListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            // {field: 'id', title: 'ID', width:60, align:"center"},
            {type: 'numbers', title: '序号', width:60, align:"center"},
            {field: 'name', title: '岗位名称', width:300},
            {field: 'num', title: '人数', align:'center',width:80},
            {field: 'edu', title: '学历要求', align:'center',templet:function(d){
                    return d.edu == 1 ? '高中、初中' : (d.edu == 2 ? '大专学历' : '本科学历以上');
                }},
            {field: 'status', title: '状态', align:'center',width:80,templet:function(d){
					return d.status == "1" ? "<span style='color:green'>显示</span>" : "<span style='color:red'>隐藏</span>";
                }},
            {field: 'money', title: '工资',  align:'center',width:120},
            {field: 'time', title: '发布时间', align:'center', minWidth:140},
            {title: '操作', width:120, templet:'#recruitListBar',fixed:"right",align:"center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("recruitListTable",{
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
            content : "recruitAdd.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(edit){
                    body.find("#id").val(edit.id);
                    body.find(".name").val(edit.name);
                    body.find(".num").val(edit.num);
                    body.find(".money").val(edit.money);
                    body.find("#content").val(edit.content);
                    body.find(".newsStatus select").val(edit.status);
                    body.find(".classify input[name='class'][value='"+edit.edu+"']").prop("checked","checked");
                    form.render();
                }
                setTimeout(function(){
                    layui.layer.tips('点击此处返回招聘信息列表', '.layui-layer-setwin .layui-layer-close', {
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
        var checkStatus = table.checkStatus('recruitListTable'),
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
    table.on('tool(recruitList)', function(obj){
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