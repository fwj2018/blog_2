<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/13
 * Time: 17:20
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Article;
use Yii;

class ArticleController extends BaseController
{

    /**
     * 图片上传
     * @url /api/admin/article/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES);
    }

    /**
     * 文章列表
     * @param $page '当前页'
     * @url /api/admin/article/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $type = Yii::$app->request->get('type', 0);
        $model = new Article();
        return $model->lists($page, $limit, $name, $type);
    }

    /**
     * 文章新建、编辑操作
     * @url /api/admin/article/article-edit
     * @return array|bool|string|void
     */
    public function actionArticleEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Article();
        return $model->atrAddOrEdit($post);
    }

    /**
     * 批量删除
     * @url /api/admin/article/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new Article();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->ArtDels($id);
        }
    }

    /**
     * 置顶操作
     * @url /api/admin/article/set-top
     * @return array|false|null|string
     */
    public function actionSetTop()
    {
        $post = \Yii::$app->request->post();
        $model = new Article();
        return $model->setTop($post);

    }

    /**
     * 状态操作
     * @url /api/admin/article/set-status
     * @return array|false|null|string
     */
    public function actionSetStatus()
    {
        $post = \Yii::$app->request->post();
        $model = new Article();
        return $model->setStatus($post);

    }
}