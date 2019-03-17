<?php
/**
 * 【招聘模块控制器】
 * Created by PhpStorm.
 * User: ZH
 * Date: 2018/11/26
 * Time: 11:32
 */

namespace app\controllers\admin;

use app\controllers\BaseController;
use app\models\admin\Recruit;
use Yii;

class RecruitController extends BaseController
{
    /**
     * 招聘信息图片上传
     * @url /api/admin/recruit/upload-image
     * @return array
     */
    public function actionUploadImage()
    {
        return $this->uploads($_FILES, RECRUIT_PIC_UPLOAD);
    }
    
    /**
     * 招聘列表
     * @param $page '当前页'
     * @url /api/admin/recruit/lists
     * @return array
     * @throws \yii\db\Exception
     */
    public function actionLists()
    {
        $page = Yii::$app->request->get('page', 1);
        $limit = Yii::$app->request->get('limit', 10);
        $name = Yii::$app->request->get('name', '');
        $model = new Recruit();
        return $model->lists($page, $limit, $name);
    }

    /**
     * 招聘新建、编辑操作
     * @url /api/admin/recruit/recruit-edit
     * @return array|bool|string|void
     */
    public function actionRecruitEdit()
    {
        $post = Yii::$app->request->post();
        $model = new Recruit();
        return $model->recruitAddOrEdit($post);
    }

    /**
     * 批量删除
     * @url /api/admin/recruit/del
     * @return bool|void
     * @throws \yii\db\Exception
     */
    public function actionDel()
    {
        $id = \Yii::$app->request->get('ids');
        $model = new Recruit();
        if ($id == "") {
            return $model->addError("errMessage", "参数错误，删除数据失败！");
        } else {
            return $model->RecruitDel($id);
        }
    }

}