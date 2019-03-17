angular.module('MES', [])
    .controller('message',['$scope', '$http', function ($scope, $http) {
        layui.use(['form', 'layer', 'laydate', 'table', 'laytpl'], function () {
            var DIR = '';
            var form = layui.form,
                layer = parent.layer === undefined ? layui.layer : top.layer,
                $ = layui.jquery,
                laydate = layui.laydate,
                laytpl = layui.laytpl,
                table = layui.table;

            //新闻列表
            var tableIns = table.render({
                elem: '#mesList',
                url: DIR + '/api/admin/message/lists',
                cellMinWidth: 95,
                page: true,
                height: "full-125",
                limit: 15,
                limits: [15, 30, 50],
                id: "mesListTable",
                cols: [[
                    {type: "checkbox", fixed: "left", width: 50},
                    // {field: 'id', title: 'ID', width:60, align:"center"},
                    {field: 'name', title: '姓名', width: 60},
                    {field: 'tel', title: '手机号', align: 'center', width: 130},
                    {field: 'mail', title: '邮箱', align: '', width: 190},
                    {field: 'content', title: '留言内容', align: '', width: 430},
                    {field: 'time', title: '留言时间', align: 'center', minWidth: 160},
                    {title: '操作', width: 120, templet: '#mesListBar', fixed: "right", align: "center"}
                ]]
            });

            //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
            $(".search_btn").on("click", function () {
                if ($(".searchVal").val() != '') {
                    table.reload("mesListTable", {
                        page: {
                            curr: 1 //重新从第 1 页开始
                        },
                        where: {
                            name: $(".searchVal").val()  //搜索的关键字
                        }
                    });
                } else {
                    layer.msg("请输入搜索的内容");
                }
            });

            //批量删除
            $(".delAll_btn").click(function () {
                var checkStatus = table.checkStatus('mesListTable'),
                    data = checkStatus.data,
                    newsId = [];
                if (data.length > 0) {
                    for (var i in data) {
                        newsId.push(data[i].id);
                    }
                    layer.confirm('确定删除选中的留言？', {icon: 3, title: '提示信息'}, function (index) {
                        $.get(DIR + "/api/admin/message/del?ids=" + newsId, function (data) {
                            layer.msg('留言删除成功！');
                            tableIns.reload();
                            layer.close(index);
                        });
                    });
                } else {
                    layer.msg("请选择需要删除的留言");
                }
            })

            //列表操作
            table.on('tool(mesList)', function (obj) {
                var layEvent = obj.event,
                    data = obj.data;

                if (layEvent === 'edit') { //编辑
                    $http.get('/api/admin/message/get-one-mess?id=' + data.id).success(function (res) {
                        $scope.mesData = res;
                    });
                    layui.layer.open({
                        title:'查看留言',
                        type: 1,
                        area: ['620px', '450px'],
                        content: $('.lookMess'),
                        btn: ['取消'],
                        btnAlign: 'c'
                    });
                } else if (layEvent === 'del') { //删除
                    layer.confirm('确定删除此留言？', {icon: 3, title: '提示信息'}, function (index) {
                        $.get(DIR + "/api/admin/message/del?ids=" + data.id, function (data) {
                            layer.msg('留言删除成功！');
                            tableIns.reload();
                            layer.close(index);
                        });
                    });
                } else if (layEvent === 'look') { //预览
                    layer.alert('未开通！');
                }
            });

        });
    }]);
