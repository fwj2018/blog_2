<?php
/**
 * 【SEO模块控制器】
 * Created by PhpStorm.
 * User: ZH
 * Date: 2018/11/24
 * Time: 22:35
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Seo;
use Yii;

class SeoController extends BaseController
{
    /**
     * LOGON图片上传
     * @url /api/admin/seo/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES, LOGON_PIC_UPLOAD);
    }

    /**
     * 获取seo信息
     * @url /api/admin/seo/info
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionInfo()
    {
        $model = new Seo();
        return $model->lists();
    }

    /**
     * 编辑seo操作
     * @url /api/admin/seo/seo-edit
     * @return array|bool|string|void
     */
    public function actionSeoEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Seo();
        return $model->SeoAddOrEdit($post);
    }

    //获取公司logo、电话
    public function actionGetBasic()
    {
        $model = new Seo();
        return $model->getBasic();

    }

    /**
     * 编辑seo操作
     * @url /api/admin/seo/basic-edit
     * @return array|bool|string|void
     */
    public function actionBasicEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Seo();
        return $model->basicEdit($post);
    }

}