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
                url: '/api/admin/index/logs',
                cellMinWidth: 95,
                page: true,
                height: "full-125",
                limit: 15,
                limits: [15, 30, 50],
                id: "mesListTable",
                cols: [[
                    {type: 'numbers', title: '序号', width:'4%', align:"center"},
                    {field: 'user', title: '用户名', width:'10%', align:"center"},
                    {field: 'type', title: '角色', width:'10%', align:"center"},
                    {field: 'ip', title: 'IP', width: '12%'},
                    {field: 'module', title: '操作模块', width: '15%'},
                    {field: 'cmd', title: '操作内容', align: '', width: '17%'},
                    {field: 'action', title: '执行动作', align: '', width: '9%'},
                    {field: 'result', title: '结果', align: 'center', width: '8%',templet:function (d) {
                            return d.result == "成功" ? "<span style='color:green'>成功</span>" : "<span style='color:red'>失败</span>";
                        }},
                    {field: 'time', title: '操作时间', align: 'center', width: '15%'},
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

            //刷新操作
            $scope.reflesh = function () {
                tableIns.reload();
                layer.msg('列表已刷新！', {icon: 1, time: 2500});
            };

        });
    }]);
