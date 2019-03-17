<?php
/**
 * 【友情链接模块控制器】
 * Created by PhpStorm.
 * User: ZH
 * Date: 2018/11/24
 * Time: 15:32
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Mail;
use Yii;

class MailController extends BaseController
{


    /**
     * url列表
     * @param $page '当前页'
     * @url /api/admin/link/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new Link();
        return $model->lists($page, $limit, $name);
    }

    /**
     * 友链新建、编辑操作
     * @url /api/admin/mail/mail-edit
     * @return array|bool|string|void
     */
    public function actionMailEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Mail();
        return $model->sendMail($post);
    }


}