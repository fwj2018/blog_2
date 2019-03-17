<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/7/13
 * Time: 17:20
 */
namespace app\controllers;
//use yii\web\Controller;
use yii\web\Response;
use yii\rest\Controller;
use yii\filters\ContentNegotiator;
use yii\helpers\ArrayHelper;
use yii\data\ArrayDataProvider;
class BaseController extends Controller{

    /**
     * php返回json格式的数据
     * @return array
     */
    public function behaviors()
    {
        return ArrayHelper::merge(parent::behaviors(), [
            'contentNegotiator' => [        //配置响应格式
                'class'   => ContentNegotiator::className(),
                'formats' => [
                    'application/json' => Response::FORMAT_JSON,
                    'application/xml'  => Response::FORMAT_JSON,
                ],
            ],

        ]);
    }

    //格式化输出属性
    public $serializer = [
        'class'              => 'yii\rest\Serializer',
        'collectionEnvelope' => 'items',
    ];

    /**
     * 数组分页
     * 参数形如：$query = [['id' => 1, 'name' => 'name 1', ...],['id' => 2, 'name' => 'name 2', ...],['id' => 100, 'name' => 'name 100', ...],];
     * @param $query
     * @param int $pageSize
     * @return ArrayDataProvider
     */
    protected function arrayActivePage($query, $pageSize = 15)
    {
        return new ArrayDataProvider([
            'allModels'      => $query,
            'pagination' => [
                'pageSize' => $pageSize,
            ],
        ]);
    }
    //图片上传
    public function uploads($file, $path = ARTICLE_PIC_UPLOAD)
    {
        if ($file['file'] == null) {
            return (array('code' => 1, 'msg' => '未上传图片'));
        }
        // 获取文件后缀
        $ext = getFileType($file["file"]["name"]);
        //图片限制大小
        $size = $file['file']['size'];
        if ($size > 1024 * 1024) {
            return (array('code' => 1, 'msg' => '上传图片超出限制，最大1M'));
        }
        // 判断文件是否合法
        if (!in_array($ext, array("gif", "jpeg", "jpg", "png"))) {
            return (array('code' => 1, 'msg' => '上传图片不合法'));
        }
        //文件移动
        $img = $path . date("YmdHis") . '.' . $ext;
        move_uploaded_file($file["file"]["tmp_name"], $img);
        return (array('code' => 0, 'msg' => '上传成功', 'data' => array('src' => substr($img, 2))));
    }
}