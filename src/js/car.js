jQuery(function($){
    //先渲染cookie先
    var str;
    cookieRender();
    renderCar();
    function cookieRender(){
        str=Cookie.getCookie("username")||"";
        if(str.length>0){
            $(".logininfo span i").html(str);
            $(".signhead").html("退出");
        }else{
            $(".logininfo span i").html("");
            $(".signhead").html("登录");
        }
        $(".logininfo a").on("click",function(){
            Cookie.delCookie("username","/");
        });
    }
    //购物车
    function renderCar(){
        var $carBox=$(".carBox"); 
        if(str.length>0){//只有拥有用户名时
            $.ajax({
                type:"get",
                url:"../api/car.php",
                data:"user="+str+"&car=car",
                success:function(msg){
                    var $res=JSON.parse(msg);
                    myCarRender($carBox,$res);
                    delFn(str);
                    headerCarbtn(str);
                    allDel(str);
                }
            })
        }
    }
    //购物车渲染的代码
    function myCarRender(carBox,res){
        var $totalNum=0;
        var $totalPrice=0;
        carBox.html($.map(res,function(item){
            $totalNum+=Number(item.qty);
            $totalPrice+=item.qty*item.price;
            return `<li data-id="${item.guid}">
                    <input type="checkbox" class="carCheck fl"/>
                    <dl class="fl carpro">
                        <dt>
                            <a href="details.html?guid=${item.guid}"><img src="../${item.imgurl}"/></a>
                        </dt>
                        <dd>
                            <a href="details.html?guid=${item.guid}">${item.title}</a>
                        </dd>
                    </dl>
                    <div class="fl proId poscar"><div>${item.guid}</div></div>
                    <div class="fl progg poscar"><div>${item.progg}</div></div>
                    <div class="fl procd poscar"><div>${item.schancj}</div></div>
                    <div class="fl projg poscar"><div>${item.price}</div></div>
                    <div class="fl prosl poscar clearfix">
                        <div>
                            <i class="carL">-</i><span>${item.qty}</span><i class="carR">+</i>
                        </div>
                    </div>
                    <div class="fl prozj poscar"><div>${(item.qty*item.price).toFixed(2)}</div></div>
                    <div class="fl prosc poscar"><div>删除</div></div>
                </li>`
        }).join(""));
        footerCar($totalNum,$totalPrice);
    }
    //总数量以及总的价格
    function footerCar(totalNum,totalPrice){
        $(".procarNum li span").eq(0).html(totalNum);
        $(".procarNum li span").eq(2).html(totalPrice.toFixed(2));
        $(".footyxz i").html(totalNum);
        $(".footzj i").html(`￥${totalPrice.toFixed(2)}`);
    }
    //当点击删除按钮的时候
    function delFn(str){
        var $prosc=$(".prosc");
        $prosc.on("click",function(e){
            e.preventDefault();
            var $currentId=$(this).closest("li").attr("data-id");
            var $show=true;
            $(this).closest("li").remove();
            $.ajax({
                type:"get",
                url:"../api/car.php",
                data:"user="+str+"&guid="+$currentId+"&show="+$show,
                success:function(msg){
                    var $res=JSON.parse(msg);
                    var $totalNum=0;
                    var $totalPrice=0;
                    $.map($res,function(item){//这里是为了渲染价格
                        $totalNum+=Number(item.qty);
                        $totalPrice+=item.price*item.qty;
                    })
                    footerCar($totalNum,$totalPrice);
                } 
            })
        })
    }
    //当点击左右的按钮的时候
    function headerCarbtn(str){
        $(".prosl i").on("click",function(e){
            e.preventDefault();
            var currentVal=$(this).siblings("span").html();
            var $currentId=$(this).closest("li").attr("data-id");
            if($(this).hasClass("carL")){
                currentVal--;
                if(currentVal<1){
                    return;
                }
            }
            if($(this).hasClass("carR")){
                currentVal++;
            }
            $(this).siblings("span").html(currentVal);
            $.ajax({
                type:"get",
                url:"../api/car.php",
                data:"user="+str+"&guid="+$currentId+"&qty="+currentVal,//有这个表明我需要的是数量
                success:(msg)=>{
                   $(this).closest("li").find(".prozj div").html((currentVal*JSON.parse(msg)[0].price).toFixed(2));
                   //所有的价格和所有的件数
                   var $numCar=$(".prozj div");//价格
                   // console.log($numCar);
                   var $priceCar=$(".prosl span");//数量
                   var $totalNum=0;
                   var $totalPrice=0;
                   for(var i=0;i<$numCar.length;i++){
                       $totalNum+=Number($priceCar.eq(i).html()); 
                       $totalPrice+=Number($numCar.eq(i).html());
                   }
                   footerCar($totalNum,$totalPrice);
                }
            })
        })
    }
    //当点击批量删除的时候
    function allDel(str){
        var $alldel=true;
        var $footsc=$(".footsc");
        $footsc.on("click",function(){
            $(".carBox").find("li").remove();
            footerCar(0,0);
            $.ajax({
                type:"get",
                url:"../api/car.php",
                data:"user="+str+"&alldel="+$alldel,
                success:function(msg){
                    console.log(msg);
                }
            });
        })
    }    
})