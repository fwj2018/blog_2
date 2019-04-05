<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/13
 * Time: 17:20
 */

namespace app\controllers\home;

use app\models\home\Mail;
use app\controllers\BaseController;

class MailController extends BaseController
{
    //获取seo信息
    public function actionGetSeo()
    {
        $model = new Mail();
        return $model->getSeo();
    }

    //获取top6信息
    public function actionTop6()
    {
        $model = new Mail();
        return $model->top6();
    }

    //获取top6信息
    public function actionNew5()
    {
        $model = new Mail();
        return $model->new5();
    }

    //获取单挑数据
    public function actionGetone()
    {
        $id = \Yii::$app->request->get('id', '');
        $model = new Mail();
        return $model->getOne($id);
    }
	
	//获取公告单挑数据
    public function actionNotice()
    {
        $id = \Yii::$app->request->get('id', '');
        $model = new Mail();
        return $model->notice($id);
    }
    
    //获取相关2篇文章
    public function actionGetmore()
    {
        $data = \Yii::$app->request->get();
        $model = new Mail();
        return $model->getMore($data);
        
    }

    public function actionLike()
    {
        $id = \Yii::$app->request->post('id');
        $model = new Mail();
        return $model->like($id);
    }

    //获取文章总数
    public function actionGettot()
    {
        $type = \Yii::$app->request->get('type','');
		$t = \Yii::$app->request->get('t','');
        $model = new Mail();
        return $model->getNum($type,$t);
    }
    
    //列表分页
    public function actionGetall()
    {
        $get = \Yii::$app->request->get();
        $model = new Mail();
        return $model->getList($get);

    }

    //点击量
    public function actionClick8()
    {
        $model = new Mail();
        return $model->click8();
    }

    //友链
    public function actionLink()
    {
        $model = new Mail();
        return $model->links();
    }
	
	//获取banner
	public function actionBanner()
    {
        $model = new Mail();
        return $model->banInfo();
    }

    //站点信息
    public function actionSiteInfo()
    {
        $model = new Mail();
        return $model->getSiteInfo();
    }

    //留言
    public function actionMess()
    {
        $post = \Yii::$app->request->post('mess');
        $model = new Mail();
        return $model->addMess($post);
    }

    //获取留言总条数
    public function actionGetMessNum()
    {
        $model = new Mail();
        return $model->getMess();
    }

    //获取留言列表
    public function actionMessList()
    {
        $get = \Yii::$app->request->get();
        $model = new Mail();
        return $model->messList($get);

    }

    //获取所有文章id
    public function actionNum()
    {
        $get = \Yii::$app->request->post('id');
        $model = new Mail();
        return $model->getId($get);

    }
	
	//清Redis缓存
	public function actionDelredis()
    {
        $model = new Mail();
        return $model->delRedis();
    }

    public function actionExport()
    {
        $model = new Mail();
        return $model->Userexport();
    }


}