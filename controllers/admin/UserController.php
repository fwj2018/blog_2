<?php
/**
 * 【用户管理】
 * Created by PhpStorm.
 * User: ZH
 * Date: 2018/11/24
 * Time: 9:46
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\User;
use Yii;

class UserController extends BaseController
{
    /**
     * 文章列表
     * @param $page '当前页'
     * @url /api/admin/user/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new User();
        return $model->lists($page, $limit, $name);
    }

    /**
     * 用户新建和编辑
     * @url /api/admin/user/add-or-edit
     * @return array|bool|string|void
     */
    public function actionAddOrEdit()
    {
        $post = Yii::$app->request->post();
        $model = new User();
        return $model->userEdit($post);
    }

    /**
     * 批量删除
     * @url /api/admin/user/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new User();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->userDel($id);
        }
    }

    /**
     * 状态操作
     * @url /api/admin/user/set-status
     * @return array|false|null|string
     */
    public function actionSetStatus()
    {
        $post = \Yii::$app->request->post();
        $model = new User();
        return $model->setStatus($post);

    }
}