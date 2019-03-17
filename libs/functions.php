<?php
//获取文件扩展名
function getFileType($filename)
{
    return substr(strrchr($filename, '.'), 1);
}

/**
 * 功能：文件下载
 * @param $filePath
 * @param $fileName
 */
function downloadFile($filePath, $fileName)
{
    if (!file_exists($filePath)) {
        die('抱歉，下载文件不存在！');
    }
    if (preg_match('@^\.\.$|\.\./|/\.\.$@', $fileName)) {
        exit("<script>alert('非法路径下载文件!');</script>");
    }
    header('Content-Type: application/vnd.ms-word');
    header('Content-Disposition: attachment;filename="' . $fileName . '"');
    header('Cache-Control: max-age=0');
    header('Cache-Control: max-age=1');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
    header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
    header('Pragma: public'); // HTTP/1.0

    $size = filesize($filePath);
    $range = 0;
    if (isset ($_SERVER ['HTTP_RANGE'])) {
        list ($a, $range) = explode("=", $_SERVER ['HTTP_RANGE']);
        //if yes, download missing part
        $size2 = $size - 1; //文件总字节数
        $new_length = $size2 - $range; //获取下次下载的长度
        header("HTTP/1.1 206 Partial Content");
        header("Content-Length: {$new_length}"); //输入总长
        header("Content-Range: bytes {$range}-{$size2}/{$size}");
        //Content-Range: bytes 4908618-4988927/4988928 95%的时候
    } else {   //第一次连接
        $size2 = $size - 1;
        header("Content-Range: bytes 0-{$size2}/{$size}"); //Content-Range: bytes 0-4988927/4988928
        header("Content-Length: " . $size); //输出总长
    }

    $fp = fopen("{$filePath}", "rb");
    //设置指针位置
    fseek($fp, $range);
    while (!feof($fp)) {
        set_time_limit(0);
        print (fread($fp, 1024 * 1024)); //输出文件 每次1兆
        flush(); //输出缓冲
        ob_flush();
    }
    fclose($fp);
}

function sendCmd($cmd)
{
    //记录发送命令日志
    writeCmdLog($cmd);
    $ret = exec($cmd, $output, $return);
    //记录命令返回结果
    writeCmdLog('output:');
    writeCmdLog($output);
    writeCmdLog('return:');
    writeCmdLog($return);
    writeCmdLog('ret:');
    writeCmdLog($ret);
    writeCmdLog('------------------------');
    return $ret;
}

function writeCmdLog($param)
{
    //日志路径
    if (!file_exists(CMD_LOG_PATH)) {
//        exec('touch ' . CMD_LOG_PATH);
        return false;
    }
    $contentTemp = "[%s]%s:(%s)" . PHP_EOL;
    $content = '';
    //    $interval = "------------------" . PHP_EOL;
    $interval = "";
    if (is_array($param)) {
        foreach ($param as $key => $row) {
            if (is_array($row)) {
                $row = json_encode($row);
            }
            $content .= $interval;
            $content .= sprintf($contentTemp, date('Y-m-d H:i:s'), $key, $row);
        }
    } else {
        $content .= $interval;
        $content .= sprintf($contentTemp, date('Y-m-d H:i:s'), 'shell', $param);
    }
    file_put_contents(CMD_LOG_PATH, $content, FILE_APPEND);
}

//删除文件
function deldir($path)
{
    //如果是目录则继续
    if (is_dir($path)) {
        //扫描一个文件夹内的所有文件夹和文件并返回数组
        $p = scandir($path);
        foreach ($p as $val) {
            //排除目录中的.和..
            if ($val != "." && $val != "..") {
                //如果是目录则递归子目录，继续操作
                if (is_dir($path . $val)) {
                    //子目录中操作删除文件夹和文件
                    deldir($path . $val . '/');
                    //目录清空后删除空文件夹
                    @rmdir($path . $val . '/');
                } else {
                    //如果是文件直接删除
                    unlink($path . $val);
                }
            }
        }
    }
}

//发送邮件
function sendMail($to, $subject, $content, $name = '小丸子科技')
{
    try {
        require '../config/web.php';
        $username = $config['components']['mailer']['transport']['username'];
        $mail = \Yii::$app->mailer->compose()
            ->setFrom([$username => $name])
            ->setTo($to)
            ->setSubject($subject)
            ->setHtmlBody($content)
            ->send();
        if ($mail)
            return true;
        else
            return false;

    } catch (\Exception $e) {
        return $e->getMessage();
    }
}

//生成唯一订单号
function createUniqueId($uid)
{
    return substr(implode(NULL, array_map('ord', str_split(substr(uniqid(), 7, 13), 1))), 0, 8) . $uid;
}

//判断url是否合法
function isUrl($url)
{
    return preg_match('/^http[s]?:\/\/' .
            '(([0-9]{1,3}\.){3}[0-9]{1,3}' .
            '|' .
            '([0-9a-z_!~*\'()-]+\.)*' .
            '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' .
            '[a-z]{2,6})' .
            '(:[0-9]{1,4})?' .
            '((\/\?)|' .
            '(\/[0-9a-zA-Z_!~\'\(\)\[\]\.;\?:@&=\+\$,%#-\/^\*\|]*)?)$/',
            $url) == 1;
}

