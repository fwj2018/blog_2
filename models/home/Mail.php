<?php
/**
 * 【公共模块】
 * Created by PhpStorm.
 * User: ZH
 * Date: 2019/3/2
 * Time: 10:16
 */

namespace app\models\home;

use app\models\BaseModel;

class Mail extends BaseModel
{
    public static $table = 'about';
    public static $article = 'article';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 表名
     * @return mixed|string
     */
    public static function tableName()
    {
        return self::$table; // TODO: Change the autogenerated stub
    }

    //获取seo信息
    public function getSeo()
    {

        return $this->getS('seo', '*', 1);
    }

    public function top6()
    {
        $where = "status = 'checked'";
        $extra = "ORDER BY top DESC,id DESC LIMIT 6";
        return $this->getS(self::$article, '*', 0, $where, [], $extra);

    }

    //获取文章id
    public function getId($id)
    {
        $where = "status = 'checked'";
        $data = $this->getS(self::$article, 'id', 0, $where);
        $list = array_column($data, 'id');
        return in_array($id, $list) ? true : false;
    }

    //最新5篇文章
    public function new5()
    {
        $where = "status = 'checked'";
        $extra = "ORDER BY id DESC LIMIT 5";
        return $this->getS(self::$article, '*', 0, $where, [], $extra);

    }

    //点击量排行
    public function click8()
    {
        $where = "status = 'checked'";
        $extra = "ORDER BY `like` DESC LIMIT 8";
        return $this->getS(self::$article, '*', 0, $where, [], $extra);

    }
	
	//获取banner
	public function banInfo()
	{
		$where = "status = 1 AND classify = 2";
		return $this->getS('banner', 'thum', 0, $where);
		
	}

    //点击量排行
    public function links()
    {
        $where = "status = 'checked'";
        return $this->getS('link', '*', 0, $where);

    }

    //获取单条数据
    public function getOne($id)
    {
        $where = "id=:id";
        $param['id'] = intval($id);
        $data =  $this->getS(self::$article, '*', 1, $where, $param);
		$arr['id'] = intval($id);
		$arr['scan'] = $data['scan'] += 1;
		$arr = $this->addOrEdit(self::$article, $arr, 'id');
		$data['time'] = date('Y-m-d H:i', strtotime($data['time']));
		return $data;
		
    }
	
	
    //获取公告单条数据
    public function notice($id)
    {
        $where = "id=:id";
        $param['id'] = intval($id);
        $data =  $this->getS('recruit', '*', 1, $where, $param);
		$data['time'] = date('Y-m-d H:i', strtotime($data['time']));
		return $data;
		
    }

    //更多文章
    public function getMore($data)
    {
        $where = "classify=:classify AND id <> :id";
        $param['classify'] = intval($data['class']);
        $param['id'] = intval($data['id']);
        $data = $this->getS(self::$article, '*', 0, $where, $param);
		$key = array_rand($data,2);
		$arr[] = $data[$key[0]];
		$arr[] = $data[$key[1]];
		return $arr;
    }

    //点赞
    public function like($id)
    {
        $where = "id=:id";
        $param['id'] = intval($id);
        $info = $this->getS(self::$article, '*', 1, $where, $param);
        $data['id'] = $id;
        $data['like'] = $info['like'] += 1;
        $this->addOrEdit(self::$article, $data, 'id');
        return true;
    }

    //获取总数
    public function getNum($type)
    {
        switch ($type) {
            case 3:
                $where = "status = 'checked' AND classify <> 3";
                break;
            default:
                //获取全部文章条数
                $where = "status = 'checked'";
        }
        return $this->getS(self::$article, 'count(*)', 2, $where);

    }

    //留言总条数
    public function getMess()
    {
        return $this->getS('liuyan', 'count(*)', 2);
    }

    //分页列表
    public function getList($get)
    {
        $tpye = !isset($get['type']) ? '0' : $get['type'];
        $where = "1=1 ";
        $param = [];
        if (!empty(trim($get['key']))) {
            $where .= "AND title like :tile";
            $param['tile'] = '%' . trim($get['key']) . '%';
        }
        if ($tpye != 0) {
            $where .= "AND classify=:classify";
            $param['classify'] = intval($get['class']);
        }
        $extra = "order by time desc limit " . (intval($get['page']) - 1) * intval($get['limit']) . "," . intval($get['limit']);

        $data = $this->getS(self::$article, '*', 0, $where, $param, $extra);
        foreach ($data as $k => &$v) {
            $v['time'] = $this->dateChange($v['time']);
        }
        return $data;

    }

    //留言列表
    public function messList($get)
    {
        $extra = "order by id desc limit " . (intval($get['page']) - 1) * intval($get['limit']) . "," . intval($get['limit']);
        return $this->getS('liuyan', 'name,content,FROM_UNIXTIME(time) as time,pic', 0, '', [], $extra);
    }

    public function dateChange($t)
    {
        $s = strtotime($t);
        return date('Y-m-d', $s);
    }

    //留言
    public function addMess($post)
    {
        $data['ip'] = \Yii::$app->request->getUserIP();
        $data['content'] = trim($post);
        $data['time'] = time();
        $this->addOrEdit('liuyan', $data, 'id');
        return true;

    }

}