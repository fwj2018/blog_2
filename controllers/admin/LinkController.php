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
use app\models\admin\Link;
use Yii;

class LinkController extends BaseController
{

    /**
     * 友链图片上传
     * @url /api/admin/link/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES, LINK_PIC_UPLOAD);
    }

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
     * @url /api/admin/link/link-edit
     * @return array|bool|string|void
     */
    public function actionLinkEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Link();
        return $model->linkAddOrEdit($post);
    }

    /**
     * 批量删除
     * @url /api/admin/link/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new Link();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->linkDel($id);
        }
    }

    /**
     * 状态操作
     * @url /api/admin/link/set-status
     * @return array|false|null|string
     */
    public function actionSetStatus()
    {
        $post = \Yii::$app->request->post();
        $model = new Link();
        return $model->setStatus($post);

    }

}