<?php
    //先将数据传过来先
    $num=isset($_GET["num"])?$_GET["num"]:5;
    $page=isset($_GET["page"])?$_GET["page"]:1;
    $plshow=isset($_GET["plshow"])?$_GET["plshow"]:null;
    $xlshow=isset($_GET["xlshow"])?$_GET["xlshow"]:null;
    $jgshow=isset($_GET["jgshow"])?$_GET["jgshow"]:null;
    $sjshow=isset($_GET["sjshow"])?$_GET["sjshow"]:null;
    //建立与数据库的连接
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = 'j1_data';
    $conn = new mysqli($servername, $username, $password, $dbname);
    if($conn->connect_error){
        echo "连接失败";
    }//假设没有连接成功的话，执行上面的代码
    $conn->set_charset('utf8');
    //接下来就是查询里面的内容
    if($xlshow=="true"){//假设点击了的话，就将数据库中的内容重新排序
        $res=$conn->query('select * from data_j1 order by xl asc');
        // desc降序
        // asc升序
    }else if($xlshow=="false"){
        $res=$conn->query('select * from data_j1 order by xl desc');
    }else{
        $res=$conn->query('select * from data_j1 order by xl desc');
    }
    // 当点击评论的时候
    if($plshow=="true"){//假设点击了的话，就将数据库中的内容重新排序
        $res=$conn->query('select * from data_j1 order by pj asc');
        // desc降序
        // asc升序
    }else if($plshow=="false"){
        $res=$conn->query('select * from data_j1 order by pj desc');
    }

    // 当点击价格时
    if($jgshow=="true"){//假设点击了的话，就将数据库中的内容重新排序
        $res=$conn->query('select * from data_j1 order by price asc');
        // desc降序
        // asc升序
    }else if($jgshow=="false"){
        $res=$conn->query('select * from data_j1 order by price desc');
    } 
    //当点击时间时
    
    if($sjshow=="true"){//假设点击了的话，就将数据库中的内容重新排序
        $res=$conn->query('select * from data_j1 order by settime asc');
        // desc降序
        // asc升序
    }else if($sjshow=="false"){
        $res=$conn->query('select * from data_j1 order by settime desc');
    }    

    $content=$res->fetch_all(MYSQLI_ASSOC);
    $len=count($content);
    //裁剪成想要的样子
    $cont=array_slice($content,$num*($page-1),$num);
    $result=array(
        "res"=>$cont,//得到的是数据
        "len"=>$len,//总的数据的长度
        "num"=>$num,//每页能容纳的商品数
        "page"=>$page//总共的页数
        );
    //将其用json字符串转出来
    $res->close();
    $conn->close();
    echo json_encode($result,JSON_UNESCAPED_UNICODE);
?>