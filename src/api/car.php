<?php
    $user=isset($_GET["user"])?$_GET["user"]:null;
    $guid=isset($_GET["guid"])?$_GET["guid"]:null;
    $show=isset($_GET["show"])?$_GET["show"]:null;
    $car=isset($_GET["car"])?$_GET["car"]:null;
    $qty=isset($_GET["qty"])?$_GET["qty"]:null;
    $alldel=isset($_GET["alldel"])?$_GET["alldel"]:null;
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
    if($show && $user){
        $res=$conn->query('delete from car_data where guid='.$guid.'');
        $res=$conn->query('select *from (select * from  data_j1 where  data_j1.guid in (select guid from  car_data where user = "'.$user.'" ))a
        left join (select guid,qty from car_data where user = "'.$user.'" )b
        on a.guid =b.guid');
        $content=$res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($content,JSON_UNESCAPED_UNICODE);
        $res->close();
    }
    //有这个添加数量的表明我是添加的往另一张数据库中添加
    if($qty){
        $res=$conn->query('update car_data set qty='.$qty.' where guid='.$guid.' and user="'.$user.'"');
        //这里我需要返回当前的商品价格就行了
        $res=$conn->query('select price from data_j1 where guid='.$guid.'');
        $content=$res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($content,JSON_UNESCAPED_UNICODE);
        $res->close();
    }
    if($user && $car){
        $res=$conn->query('select *from (select * from  data_j1 where  data_j1.guid in (select guid from  car_data where user = "'.$user.'" ))a
        left join (select guid,qty from car_data where user = "'.$user.'" )b
        on a.guid =b.guid');
        $content=$res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($content,JSON_UNESCAPED_UNICODE);
        $res->close();
    }
    if($user && $alldel){
        $res=$conn->query('delete from car_data where user="'.$user.'"');
        echo 1;
    }
    $conn->close();
?>