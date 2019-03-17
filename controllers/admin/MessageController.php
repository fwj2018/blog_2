<?php
/**
 * 【Message模块控制器】
 * Created by PhpStorm.
 * User: ZH
 * Date: 2018/11/24
 * Time: 22:35
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Message;
use Yii;

class MessageController extends BaseController
{

    /**
     * 获取Message信息
     * @url /api/admin/Message/info
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new Message();
        return $model->lists($page, $limit, $name);
    }
    /**
     * 编辑Message操作
     * @url /api/admin/Message/Message-edit
     * @return array|bool|string|void
     */
    public function actionMessageEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Message();
        if ($model->load(['Message' => $post]) && $model->validate()) {
            $res = $model->MessageAddOrEdit($post);
            if ($res !== true) {
                return $model->getFirstErrors();
            } else {
                return $res;
            }
        } else {
            return $model->getFirstErrors();
        }
    }

    /**
     * 批量删除
     * @url /api/admin/Message/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new Message();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->Dels($id);
        }
    }

    /**
     * 获取单条信息
     * @url /api/admin/message/get-one-mess
     * @return array|false|null|string
     * @throws \yii\db\Exception
     */
    public function actionGetOneMess()
    {
        $id = \Yii::$app->request->get('id');
        $model = new Message();
        return $model->getOne($id);
    }

}