<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/13
 * Time: 17:20
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Images;
use Yii;

class ImagesController extends BaseController
{

    /**
     * 图片上传
     * @url /api/admin/images/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES, IMAGES_PIC_UPLOAD);
    }

    /**
     * 产品列表
     * @param $page '当前页'
     * @url /api/admin/images/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new Images();
        return $model->lists($page, $limit, $name);
    }

    /**
     * 产品新建、编辑操作
     * @url /api/admin/images/images-edit
     * @return array|bool|string|void
     */
    public function actionImagesEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Images();
        return $model->imgAddOrEdit($post);
    }

    /**
     * 批量删除
     * @url /api/admin/images/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new Images();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->imgDels($id);
        }
    }

    /**
     * 置顶操作
     * @url /api/admin/Images/set-top
     * @return array|false|null|string
     */
    public function actionSetTop()
    {
        $id = \Yii::$app->request->post('id');
        $model = new Images();
        return $model->setTop($id);

    }
}