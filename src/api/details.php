<?php
    $num=isset($_GET["num"])?$_GET["num"]:null;
    $user=isset($_GET["user"])?$_GET["user"]:null;
    $guid=isset($_GET["guid"])?$_GET["guid"]:null;
    $qty=isset($_GET["qty"])?$_GET["qty"]:1;
    $car=isset($_GET["car"])?$_GET["car"]:null;
    //接下来需要调用数据库中的数据了
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = 'j1_data';
    //建立与数据库的连接
    $conn = new mysqli($servername, $username, $password, $dbname);
    if($conn->connect_error){
        echo "连接失败";
    }//假设没有连接成功的话，执行上面的代码
    //查询前设置编码，防止输出乱码
    $conn->set_charset('utf8');
    //接下来开始查询数据库中的内容
    if($user){
        $res=$conn->query('select * from car_data where guid='.$guid.' and user="'.$user.'"');
        if($res->num_rows>0){//表明存在那个结果
            //在原来的基础上更新
            $res=$conn->query('update car_data set qty=qty+'.$qty.' where guid='.$guid.' and user="'.$user.'"'); 
            echo 1;
        }else{
            $res=$conn->query('insert into car_data (guid,user,qty) values ('.$guid.',"'.$user.'",'.$qty.')');
        }   //增删改的语句返回的是布尔类型的值     
    }
    if($num){
        $res=$conn->query('select * from data_j1 where guid='.$num.'');//查询语句返回的是布尔值
        $content=$res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($content,JSON_UNESCAPED_UNICODE); 
        $res->close();
    }
    $conn->close();   
?>