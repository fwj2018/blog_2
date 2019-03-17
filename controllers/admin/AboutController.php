<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/13
 * Time: 17:20
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\About;
use Yii;

class AboutController extends BaseController
{

    /**
     * 图片上传
     * @url /api/admin/about/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES, ABOUT_PIC_UPLOAD);
    }

    /**
     * 文章列表
     * @param $page '当前页'
     * @url /api/admin/About/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new About();
        return $model->lists($page, $limit, $name);
    }

    /**
     * 图片新建、编辑操作
     * @url /api/admin/about/about-edit
     * @return array|bool|string|void
     */
    public function actionAboutEdit()
    {
        $post = Yii::$app->request->post();
        $model = new About();
        return $model->aboutAddOrEdit($post);
    }

    /**
     * 置顶操作
     * @url /api/admin/About/set-top
     * @return array|false|null|string
     */
    public function actionSetTop()
    {
        $id = \Yii::$app->request->post('id');
        $model = new About();
        return $model->setTop($id);

    }
}