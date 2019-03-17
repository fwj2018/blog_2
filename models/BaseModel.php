<?php

namespace app\models;

use yii\db\ActiveRecord;
use yii\data\SqlDataProvider;
use yii;

class BaseModel extends ActiveRecord
{
    public static $isValidCode = 21;
    //规则暂存
    public static $rulesTemp = [];
    public static $handle;
    //用户表
    public static $admin = 'admin';
    public static $log   = 'log';
    //记录日志参数 在各模块重构
    public static $logParam = [
        'module' => '系统模块',//产生日志的模块
        'action' => '系统操作',//产生日志的操作
        'result' => 0,//操作的结果 1,成功/0,失败
        'cmd'    => '日志信息',//操作内容
    ];

    public function __construct()
    {
        parent::__construct();
        self::$handle = $this->getDb();
    }

    /**
     * 通过select获取数据 包括多条数据，单条数据，一个字段
     *
     * @param string $table 表名
     * @param string|array $field 获取字段
     * @param int $isOne 0,获取所有;1,获取第一条数据;2,获取第一条第一个数据
     * @param string $where 字符串WHERE条件
     * @param array $param 字符串WHERE条件绑定参数or数组WHERE条件
     * @param string $extra 额外SQL操作
     * @return array|false|null|string
     * @throws \yii\db\Exception
     */
    public function getS($table, $field = '*', $isOne = 0, $where = '', $param = [], $extra = '')
    {
        //组装SQL获取句柄
        $ex = $this->getEx($table, $field, $where, $param, $extra);
        switch ($isOne) {
            //1,获取第一条数据;
            case 1:
                $return = $ex->queryOne();
                break;
            //2,获取第一条数据第一个字段的值;
            case 2:
                $return = $ex->queryScalar();
                break;
            //默认,获取全部多条数据
            default:
                $return = $ex->queryAll();
        }
        return $return;
    }

    /**
     * 组装SQL获取句柄
     *
     * @param string $table 表名
     * @param string|array $field 获取字段
     * @param string $where 字符串WHERE条件
     * @param array $param 字符串WHERE条件绑定参数or数组WHERE条件
     * @param string $extra 额外SQL操作
     * @return \yii\db\Command
     */
    public function getEx($table, $field = '*', $where = '', $param = [], $extra = '')
    {
        if (is_array($field)) {
            $field = implode(',', $field);
        }
        //组装SQL
        $sql = "SELECT $field FROM $table";
        if (!empty($where)) {
            //字符串形式WHERE条件
            $sql .= " WHERE $where";
        } else if (!empty($param) && is_array($param)) {
            //数组形式WHERE条件
            $sql .= " WHERE (";
            $arr = [];
            foreach ($param as $column => $value) {
                $arr[] = "`$column` = :$column";
            }
            $sql .= implode(') AND (', $arr);
            $sql .= ')';
        }
        //组装额外条件-例如order by, group by
        if (!empty($extra)) {
            $sql .= " $extra";
        }
        //获取操作句柄
        $ex = self::$handle->createCommand($sql);
        //若参数数组不为空 则将SQL中绑定变量替换
        if (!empty($param)) {
            $ex->bindValues($param);
        }
        return $ex;
    }

    /**
     * 组装获取sql中 case when 语句
     *
     * @param        $field
     * @param        $temp
     * @param string $as
     * @return string
     */
    public function getCaseWhenField($field, $temp, $as = '')
    {
        $sqlTemp = "CASE `%s` %s ELSE '未知' END AS %s";
        $whenTemp = "WHEN '%s' THEN '%s'";
        $whenArr = [];
        foreach ($temp as $key => $val) {
            $whenArr[] = sprintf($whenTemp, $key, $val);
        }
        return sprintf($sqlTemp, $field, implode(' ', $whenArr), empty($as) ? $field : $as);
    }

    /**
     * 通过UPDATE或INSERT添加修改数据表
     *
     * @param string $table 表名
     * @param array $info 字段名作为键，要操作的数据作为值 的数组
     * @param string $key 判断添加亦或是修改操作的字段名 默认为id
     * @param string $type 判断添加亦或是修改操作的附加条件 默认为edit
     *                      （若添加操作却必须指定$key，则该参数传入'add'，例如无线扫描添加修改任务）
     * @throws \yii\db\Exception
     */
    public function addOrEdit($table, $info, $key = 'id', $type = 'edit')
    {
        $ex = self::$handle->createCommand();
        if (!empty($info[$key]) && $type == 'edit') {
            //重组数据用于WHERE条件
            $param[$key] = $info[$key];
            //UPDATE操作不需要$key字段
            unset($info[$key]);
            //更新操作
            $ex->update($table, $info, "`$key`=:$key", $param);
        } else {
            if (empty($info[$key])) {
                //卸载判断字段
                unset($info[$key]);
            }
            //添加操作
            $ex->insert($table, $info);
        }
        $ex->execute();
    }


    /**
     * 执行SQL语句返回分页信息
     *
     * @param       $sql
     * @param array $params
     * @param int $pageSize
     * @return SqlDataProvider
     */
    protected function getpagedata($sql, $params = [], $pageSize = 15, $db = null)
    {
        if ($db == null)
            $db = Yii::$app->db;
        $sqlCount = "select count(*)" . strstr(strtolower($sql), " from ");

        $count = $db->createCommand($sqlCount, $params)->queryScalar();

        return new SqlDataProvider([
            'db' => $db,
            'sql' => $sql,
            'params' => $params,
            'totalCount' => $count,
            'pagination' => [
                'pageSize' => $pageSize,
            ],
        ]);
    }


    /**
     * IN 的删除操作，批量删除时使用
     *
     * @param        $ids
     * @param        $table
     * @param string $where
     * @param string $andWhere
     * @return bool
     * @throws \yii\db\Exception
     */
    protected function delSqlAction($ids, $table, $where = 'id', $andWhere = "")
    {
        $ida = explode(',', $ids);
        $tmp = [];
        foreach ($ida as $key => $row) {
            $tmp[] = ":ids$key";
        }
        $tmpId = implode(',', $tmp);
        $sql = "delete FROM $table WHERE $where IN ($tmpId)";
        //组装额外条件-例如order by, group by
        if (!empty($andWhere)) {
            $sql .= " AND $andWhere";
        }
        $ex = self::$handle->createCommand($sql);
        foreach ($ida as $key => $row) {
            $ex->bindValue('ids' . $key, $row);
        }
        $ex->execute();
        return true;
    }

    /**
     * 替换错误信息参数
     *
     * @param       $msg
     * @param array $params
     * @return mixed
     */
    public static function replaceError($msg, $params = [])
    {
        if (!empty($params)) {
            foreach ($params as $key => $val) {
                $column = '{' . $key . '}';
                $msg = str_replace($column, $val, $msg);
            }
        }
        return $msg;
    }

    /**
     * 用户输入正则校验
     * @param $subject
     * @param int $key
     * @param string $name
     * @param string $return
     * @return bool|string
     */
    public static function checkByPreg($subject, $key, $name = '', &$return = '')
    {
        if (empty(self::$rulesTemp)) {
            self::$rulesTemp = include_once "../libs/rules.php";
        }
        if (!isset(self::$rulesTemp[$key])) {
            $return = '未找到该匹配规则！';
            return $return;
        }
        $pat = self::$rulesTemp[$key]['pat'];
        $msg = self::$rulesTemp[$key]['msg'];
        $pre = !empty($name) ? "【" . $name . "】" : '';
        $message = $pre . $msg;
        if (is_array($pat)) {
            //匹配模式为数组，则逐个匹配这些字符不应出现
            foreach ($pat as $row) {
                if (strpos($subject, $row) !== false) {
                    return $return = $message;
                }
            }
            return $return = true;
        } else {
            //匹配模式为字符后窜，则正则匹配是否符合要求
            return $return = !preg_match($pat, $subject) ? $message : true;
        }
    }

    /**
     * 用户输入长度校验
     *
     * @param        $subject
     * @param        $max
     * @param int $min
     * @param string $name
     * @param string $return
     * @return bool|string
     */
    public static function checkByLength($subject, $max, $name, &$return = '', $min = 1)
    {
        $flag = strlen($subject) >= $min && strlen($subject) <= $max;
        $param = ['column' => $name, 'min' => $min, 'max' => $max];
        $message = self::replaceError(COMMON_LENGTH_ERROR, $param);
        $return = $flag ? true : $message;
        return $return;
    }

    //异常信息处理
    public static function catchException($exception, $model, $params = [], $notLog = false)
    {
        //获取异常信息
        $msg = $exception->getMessage();
        //替换错误信息参数
        $msg = self::replaceError($msg, $params);
        //若未存入数据层 则存入异常信息
        if($exception->getCode() != self::$isValidCode){
            $model->addError('errMessage', $msg);
        }
        //记录日志
        if (!$notLog) {
            self::$logParam['cmd'] = $msg;
            self::saveOptLog(0);
        }
        return $model;
    }

    public static function saveOptLog($result = 0, $cmd = '', $action = '', $module = '')
    {
        //模块
        $module = !empty($module) ? $module : self::$logParam['module'];
        //动作
        $action = !empty($action) ? $action : self::$logParam['action'];
        //操作内容
        $cmd = !empty($cmd) ? $cmd : self::$logParam['cmd'];
        //操作结果
        $result = !empty($result) ? $result : self::$logParam['result'];
        $session = Yii::$app->getSession();
        $session->open();

        //管理员名称
        $session = \Yii::$app->session;
        $name = $session['username'];
        //管理员类型
        $where = "name=:name";
        $params['name'] = $name;
        $info = self::$handle->createCommand('SELECT * FROM ' . self::$admin . ' WHERE name=:name')
            ->bindValue(':name', $name)
            ->queryOne();
        //组装参数
        $data['type'] = $info['level'];
        $data['user'] = $name;
        $data['ip'] = \Yii::$app->request->getUserIP();
        $data['module'] = $module;
        $data['action'] = $action;
        $data['cmd'] = $cmd;
        $data['result'] = $result;
        $data['time'] = date('Y-m-d H:i:s');
        self::$handle->createCommand()->insert(self::$log, $data)->execute();
    }

}