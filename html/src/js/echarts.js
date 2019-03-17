angular.module('APP1', [])
    .controller('echarts', ['$scope', '$http', function ($scope, $http) {
        var DIR = '';
        var initMail = function () {
            $scope.mailData = {
                to: '1157336129@qq.com',
                subject: '',
                sign: '小丸子科技'
            };
        };
        initMail();
        layui.use(['form', 'layer', 'layedit', 'laydate', 'upload'], function () {
            var form = layui.form,
                layer = parent.layer === undefined ? layui.layer : top.layer,
                laypage = layui.laypage,
                upload = layui.upload,
                layedit = layui.layedit,
                laydate = layui.laydate,
                $ = layui.jquery;
            //弹出公告
            layer.msg('张大海携内人祝福<br><span style="color: red;font-size: 16px;font-weight: bold;">祝贺大家2019年新年快乐！</span><br>谢谢大家！', {
                time: 5000, //20s后自动关闭
                btn: ['嘿嘿', '知道啦', '谢谢你们']
            });
            //用于同步编辑器内容到textarea
            layedit.sync(editIndex);
            //创建一个编辑器
            var editIndex = layedit.build('comment_content', {
                tool: ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "link", "unlink", "face"],
                height: 300
            });
            $scope.submit = function () {
                var index = layer.load(0, {shade: false});
                $scope.mailData.content = layedit.getContent(editIndex).split('<audio controls="controls" style="display: none;"></audio>')[0];
                $http.post(DIR + '/api/admin/mail/mail-edit', $scope.mailData).success(function (res) {
                    if (res) {
                        layui.layedit.clearContent(editIndex);
                        initMail();
                        layer.msg('邮件发送成功！', {icon: 1, time: 2500});
                        layer.close(index);
                    } else {
                        layer.msg('服务器发生异常，请稍后重试！', {icon: 2, time: 2500});
                    }
                }).error(function (msg) {
                    layer.close(index);
                    layer.msg(msg[0].message);
                });
            };
            //清空
            $scope.clear = function () {
                layui.layedit.clearContent(editIndex);
            };
            //提示信息
            $scope.oneEnter = function (event, titName, dir) {
                var someOne = $(event.target);
                dir = dir || 3;
                var onetit = layer.tips(titName, someOne, {tips: [dir, '#0096F7'], time: 50000});
                $scope.oneLeave = function () {
                    layer.close(onetit);
                };
            };
            var chart2 = function () {
                $.get(DIR + '/api/admin/index/getsum', function (res) {
                    if (res.length == '0') {
                        $('#main').html('<div class="nodataMsg">无数据!</div>');
                    } else {
                        var lineup1 = echarts.init(document.getElementById('form'));
                        option = {
                            title: {
                                // text: 'wanz系统用户访问来源',
                                // subtext: '纯属虚构',
                                x: 'center'
                            },
                            tooltip: {
                                trigger: 'item',
                                // formatter: "{a} <br/>{b} : {c} 次<br/> {d}%"
                                formatter: "{b} : {c} 次<br/>比例： {d}%"
                            },
                            legend: {
                                orient: 'vertical',
                                x: 'left',
                                // data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                                data: res.name
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    // mark : {show: true},
                                    // dataView : {show: true, readOnly: false},
                                    magicType: {
                                        show: true,
                                        type: ['pie', 'funnel'],
                                        option: {
                                            funnel: {
                                                x: '25%',
                                                width: '50%',
                                                funnelAlign: 'left',
                                                max: 1548
                                            }
                                        }
                                    },
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80'],
                            series: [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius: '65%',
                                    center: ['50%', '60%'],
                                    data: []
                                }
                            ]
                        };
                        for (var a = 0; a < res.data.length; a++) {
                            option.series[0].data.push({
                                name: res.data[a].name,
                                value: parseInt(res.data[a].value)
                            })
                        }
                        lineup1.setOption(option);
                    }
                });
            };
            chart2();
            setInterval(function () {
                chart2();
            }, 10000)
            //刷新
            $scope.reflesh = function () {
                chart2();
                layer.msg('数据刷新成功！', {icon: 1, time: 2500});
            };
        });
    }]);