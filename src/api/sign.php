<?php
    //登录访问数据库，这个是登录的内容
    $user=isset($_POST["user"])?$_POST["user"]:null;
    $pwd=isset($_POST["pwd"])?$_POST["pwd"]:null;
    //上面的连接没有问题
    //创建与数据库的连接
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = 'j1_data';
    //判断数据库是否已经连接好了
    $conn = new mysqli($servername, $username, $password, $dbname);
    if($conn->connect_error){
        echo "连接失败";
    }//上面的数据库已经连接成功了
    $conn->set_charset("utf8");
    $res=$conn->query('select * from userMessage where user="'.$user.'" and pwd="'.$pwd.'"');
    if($res->num_rows>0){
        //这里成功了，同时需要返回出相关的用户名和密码
        $content=$res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($content,JSON_UNESCAPED_UNICODE);
    }else{
        echo "";
    }
    $res->close();
    $conn->close();
?>