<?php
/**
 * 【内容管理-轮播图管理控制器】
 * Created by PhpStorm.
 * User: ZH
 * Date: 2018/12/15
 * Time: 17:20
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Mien;
use Yii;

class MienController extends BaseController
{

    /**
     * 公司风采图片上传
     * @url /api/admin/mien/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES, Mien_PIC_UPLOAD);
    }

    /**
     * 公司风采列表
     * @param $page '当前页'
     * @url /api/admin/mien/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new Mien();
        return $model->lists($page, $limit, $name);
    }

    /**
     * 公司风采新建、编辑操作
     * @url /api/admin/mien/mien-edit
     * @return array|bool|string|void
     */
    public function actionMienEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Mien();
        return $model->mienAddOrEdit($post);
    }

    /**
     * 批量删除
     * @url /api/admin/Mien/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new Mien();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->banDels($id);
        }
    }

    /**
     * 置顶操作
     * @url /api/admin/Mien/set-top
     * @return array|false|null|string
     */
    public function actionSetTop()
    {
        $id = \Yii::$app->request->post('id');
        $model = new Mien();
        return $model->setTop($id);

    }
}