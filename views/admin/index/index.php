<?php
use yii\helpers\Url;
use yii\helpers\Html;
?>
<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>分页显示</title>
</head>
<body>
<form action="<?php echo Url::toRoute('/admin/index/index'); ?>" method="post">
    验证码：<input type="text" name="verify"><br>
    <img id="verifyImg" src="<?php echo Url::toRoute('/admin/index/captcha'); ?>"><br>
    <input type="submit" value="提交">
    <input name="_csrf" type="hidden" value="<?php echo \Yii::$app->request->csrfToken; ?>">
</form>

<?php echo Html::jsFile('@web/../html/src/jquery-1.8.3.min.js'); ?>
<script type="text/javascript">
    $(function () {
        //处理点击刷新验证码
        $("#verifyImg").on("click", function () {
            $.get("<?php echo Url::toRoute('/admin/index/captcha') ?>?refresh", function (data) {
                $("#verifyImg").attr("src", data["url"]);
            }, "json");
        });
        $.get("<?php echo Url::toRoute('/admin/index/captcha') ?>?refresh", function (data) {
            $("#verifyImg").attr("src", data["url"]);
        }, "json");
    });
</script>
</body>
</html>