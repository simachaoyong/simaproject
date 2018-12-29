<?php
    $user=isset($_POST["user"])?$_POST["user"]:null;
    $pwd=isset($_POST["pwd"])?$_POST["pwd"]:null;
    $show=isset($_POST["show"])?$_POST["show"]:null;
    //上面的数据都已经传过去了，检测没有什么问题
    //接下来就是创建与数据库的连接
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = 'j1_data';
    //判断数据库是否已经连接好了
    $conn = new mysqli($servername, $username, $password, $dbname);
    if($conn->connect_error){
        echo "连接失败";
    }//上面的数据库已经连接成功了
    $conn->set_charset('utf8');
    //接着开始查询数据库中的内容，看看有没有出现用户注册的用户名
    $res=$conn->query('select * from userMessage where user="'.$user.'"');   
    if($res->num_rows>0){
        echo "该用户名已经被注册";
    }else{//下面跑该用户名可用的情况下
        if($show){//表明用户已经点击了提交的按钮了，接下来将用户的用户名和密码插入进数据库中
            $res1=$conn->query('insert into userMessage (user,pwd) values ("'.$user.'","'.$pwd.'")');
            if($res1){
                echo "注册成功";
            }else{
                echo "注册不成功";
            }
        }else{
            echo "该用户名可用";
        }
    }
    //最后关闭数据
    $res->close();
    $conn->close();
?>