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
use app\models\admin\Banner;
use Yii;

class BannerController extends BaseController
{

    /**
     * 轮播图图片上传
     * @url /api/admin/banner/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES, Banner_PIC_UPLOAD);
    }

    /**
     * 轮播图列表
     * @param $page '当前页'
     * @url /api/admin/banner/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new Banner();
        return $model->lists($page, $limit, $name);
    }

    /**
     * 轮播图新建、编辑操作
     * @url /api/admin/banner/Banner-edit
     * @return array|bool|string|void
     */
    public function actionBannerEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Banner();
        return $model->banAddOrEdit($post);
    }

    /**
     * 批量删除
     * @url /api/admin/Banner/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new Banner();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->banDels($id);
        }
    }

    /**
     * 置顶操作
     * @url /api/admin/Banner/set-top
     * @return array|false|null|string
     */
    public function actionSetTop()
    {
        $id = \Yii::$app->request->post('id');
        $model = new Banner();
        return $model->setTop($id);

    }
}