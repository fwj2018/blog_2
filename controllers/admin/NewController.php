<?php
/**
 * 【2019留言列表】
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/13
 * Time: 17:20
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\New1;
use Yii;
class NewController extends BaseController
{
    //留言添加
    public function actionAdd()
    {
        $post = Yii::$app->request->post();
        $model = new New1();
        return $model->saveData($post);

    }

    //获取留言TOP50
    public function actionLists()
    {
        $sql = "SELECT id as href,concat(name,' : ',content) as text  FROM `2019_zf` ORDER BY id DESC LIMIT 0,50";

        return \Yii::$app->db->createCommand($sql)->queryAll();
    }

    //列表全部all
    public function actionListall()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new New1();
        return $model->listall($page, $limit, $name);
    }



}