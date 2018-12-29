<?php
    $num=isset($_GET["num"])?$_GET["num"]:null;
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
    $res=$conn->query('select * from data_j1 limit 0,'.$num.'');
    $content=$res->fetch_all(MYSQLI_ASSOC);
    echo json_encode($content,JSON_UNESCAPED_UNICODE);
    $res->close();
    $conn->close();   
?>