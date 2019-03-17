<?php
/**
 * 【用户修改密码】
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/13
 * Time: 21:16
 */

namespace app\models\admin;

use app\models\BaseModel;

class changePwd extends BaseModel
{
    public static $table = 'admin';
    public $name, $repasswd, $newpass, $surepass;

    public function __construct()
    {
        parent::__construct();
        parent::$logParam['module'] = '用户中心-用户中心';
    }

    /**
     * 规则校验
     * @return array
     */
    public function rules()
    {
        return [
            [['repasswd', 'newpass', 'surepass'], 'required'],
            [['newpass', 'surepass'], 'valiDate1'],
        ];
    }

    /**
     * 地址标签
     * @return array
     */
    public function attributeLabels()
    {
        return [
            'repasswd' => '原密码',
            'newpass'  => '新密码',
            'surepass' => '确认密码',
        ];
    }

    /**
     * 表名
     * @return mixed|string
     */
    public static function tableName()
    {
        return self::$table; // TODO: Change the autogenerated stub
    }

    //校验数据
    public function valiDate1($attribute)
    {
        switch ($attribute) {
            case 'newpass':
                $ptn = '/^[a-zA-Z]\w{3,9}$/';
                if (!preg_match($ptn, $this->newpass)) {
                    return $this->addError('newpass', '密码长度4-10位，且以字母开头数字下划线组成！');
                }
                break;
            case 'surepass':
                if ($this->surepass !== $this->newpass) {
                    return $this->addError('surepass', '两次密码输入不一致，请重新输入！');
                }
                break;
        }

    }

    /**
     * 修改密码
     * @param $data
     * @return $this|bool|string
     */
    public function changePwd($data)
    {
        parent::$logParam['action'] = EDIT;
        parent::$logParam['cmd'] = '修改密码';
        try {
            //获取类名
            $path = str_replace("\\", "/", $this::className());
            //输入验证
            $this->load([basename($path) => $data]);
            if (!$this->validate()) {
                $error = (current($this->getFirstErrors()));
                throw new \Exception($error, parent::$isValidCode);
            }
            $where = 'name=:name';
            $params['name'] = trim($data['name']);
            $info = $this->getS('admin', '*', 1, $where, $params);
            if ($info['pass'] !== md5(trim($data['repasswd']))) {
                throw new \Exception('原密码不正确，请重新输入！');
            }
            //更新密码
            $params['id'] = $info['id'];
            $params['pass'] = md5(trim($data['newpass']));
            $this->addOrEdit(self::$table, $params, 'id');
            parent::saveOptLog(1);
            return true;
        } catch (\Exception $e) {
            return parent::catchException($e, $this);
        }
    }

}