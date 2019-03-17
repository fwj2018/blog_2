<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/13
 * Time: 17:20
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Fwj;
use app\models\admin\changePwd;
use Yii;

class IndexController extends BaseController
{
    public static $log = 'log';
    public function actionLogin()
    {
        $post = Yii::$app->request->post();
        $model = new Fwj();
        return $model->login($post);

    }

    public function actionPut()
    {
        $now = time();
        $data = [
            'name' => 'admin',
            'tel' => '13201872526',
            'code' => mt_rand(0, 9) . mt_rand(0, 9) . mt_rand(0, 9) . mt_rand(0, 9),
            't' => $now + 5 * 60,
            'time' => date('Y-m-d H:i:s', $now)
        ];
//        file_put_contents(CMD_FILE_PATH, json_encode($data));
        $data = file_get_contents(CMD_FILE_PATH);
        var_dump(json_decode($data, true));
    }

    //生成验证码
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => null,
                //背景颜色
                'backColor' => 0xFFFFFF,
                //最大显示个数
                'maxLength' => 4,
                //最少显示个数
                'minLength' => 4,
                //间距
                'padding' => 2,
                //高度
                'height' => 40,
                //宽度
                'width' => 100,
                //字体颜色
//                'foreColor' => 0x2040A0,
                'foreColor' => 0x3e9d98,
                //设置字符偏移量
                'offset' => 4,
            ],
        ];
    }

    public function actionList()
    {
        $pageSize = \Yii::$app->request->get('per-page', 15);
        $model = new Fwj();
        return $model->lists($pageSize);
    }

    public function actionGetdata()
    {
        $model = new Fwj();
        $res = $model->getdata();
        return $res;
    }

    //判断用户是否登录
    public function actionSession()
    {
        $session = Yii::$app->session;
        //$session->remove('username');
        return isset($session['username']) ? $session['username'] : 'null';
    }

    //退出操作
    public function actionExit()
    {
        $model = new Fwj();
        return $model->loginout();
    }

    //查询当前用户登录密码
    public function actionChangePwd()
    {
        $post = Yii::$app->request->post();
        $model = new changePwd();
        return $model->changePwd($post);
    }

    //清缓存 /api/admin/index/clear-cache
    public function actionClearCache()
    {
        if (file_exists(CLEAR_CACHE_PATH)) {
            deldir(CLEAR_CACHE_PATH);
            return true;
        }
    }

    //获取基本信息参数 /api/admin/index/get-basic-info
    public function actionGetBasicInfo()
    {
        $db = require '../config/db.php';
        $db_name = substr(strrchr($db['dsn'], '='), 1);
        $dns = mysqli_connect("localhost", $db['username'], $db['password'], $db_name);
        $data = [];
        $data['version']     = 'v2.0';
        $data['developer']   = '张大海';
        $data['service']     = $_SERVER['SERVER_SOFTWARE'];
        $data['host']        = $_SERVER['SERVER_NAME'];
        $data['php']         = phpversion();
        $data['role']        = $this->getRole();
        $data['upload_max']  = ini_get('upload_max_filesize');
        $data['mysql']       = mysqli_get_server_info($dns);
        return $data;

    }

    //获取后台栏目总数据 /api/admin/index/get-gather
    public function actionGetGather()
    {
        $model = new Fwj();
        return $model->basicGather();
    }
    
    //获取最新的5篇文章 /api/admin/index/article-top5
    public function actionArticleTop5()
    {
        $model = new Fwj();
        return $model->articleTop5();
    }

    //提供数据
    public function actionGetsum()
    {
        $model = new Fwj();
        return $model->getSum();
    }

    //获取用户角色
    public function getRole()
    {
        $session = \Yii::$app->session;
        $name = $session['username'];
        $sql = "SELECT CASE 
            WHEN level =1 THEN '注册会员'
            WHEN level =2 THEN '中级会员'
            WHEN level =3 THEN '高级会员'
            WHEN level =4 THEN '钻石会员'
            WHEN level =5 THEN '超级会员'
            END level FROM admin WHERE name=:name";
        $command = \Yii::$app->db->createCommand($sql);
        $command->bindParam(':name', $name);
        $data = $command->queryOne();
        return $data['level'];
    }

    //获取系统日志列表
    public function actionLogs()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new Fwj();
        return $model->getLog($page, $limit, $name);
    }

    //查询当前用户是否锁屏
    public function actionCheckLock()
    {
        $session = \Yii::$app->session;
        $name = $session['username'];
        $model = new Fwj();
        return $model->getLockStatus($name);
    }

    //锁屏
    public function actionLock()
    {
        $session = \Yii::$app->session;
        $name = $session['username'];
        $model = new Fwj();
        return $model->setLock($name);
    }

    //解锁
    public function actionClearLock()
    {
        $post = Yii::$app->request->post();
        $model = new Fwj();
        return $model->clearLock($post);
    }

}