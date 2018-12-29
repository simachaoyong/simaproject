jQuery(function($){
    //定义一个最前面的cookie，以便后续接收
    var cookieStr;
    cookieRender();
    renderDetails(addCar);
    //底部轮播图渲染
    footerBan();
    toTop();
    //接收数据页面渲染
    function renderDetails(addCar){
        var $link=location.search.split("=");
        var $guid=$link[1];
        var $p1=$(".container>p>span");
        $.ajax({
            type:"get",
            url:"../api/details.php",
            data:"num="+$guid,
            success:function(msg){
                var $res=JSON.parse(msg);
                $p1.html($res[0].title);
                $(".cont_tit").html($res[0].title);
                $(".cont_des").html($res[0].jieshao);
                $(".cont_price>p").html($(`<span>价格：</span><b>￥${$res[0].price}</b>`));
                $(".cont_t01 i").html($res[0].progg);
                $(".cont_t02 i").html($res[0].schancj);
                //渲染小图
                var $cont=$(".cont_choice p i img");
                for(var j=0;j<$cont.length;j++){
                    $cont.eq(j).attr("src","../"+$res[0].imgurl);
                }
                //渲染百分比
                var $percentNum=$res[0].hpd;
                $(".percent b").html(`${$percentNum}%`);
                var $hp=$(".hp span i");
                var $zp=$(".zp span i");
                $hp.html(`(${$percentNum}%)`);
                $zp.html(`(${100-$percentNum}%)`);
                //获取那个的宽度
                var $pWidth=$(".hp p").outerWidth();
                $(".hp p s").css("width",parseInt($percentNum/100*$pWidth));
                $(".zp p s").css("width",parseInt((100-$percentNum)/100*$pWidth));
                $(".hp_b a").html(`${$res[0].pj}人评论`);
                $(".hp_b span").html(`${$res[0].xl}件`);
                $(".pro_bh").html(`商品编号：${$res[0].guid}`);
                //移到对应的规格，出现高亮
                $(".cont_ch_des p").on("click",function(){
                    $(this).siblings("p").removeClass("current");
                    $(this).addClass('current');
                })
                //接下来开始放大镜的相关的内容
                var $ulImg=$(".cont_b ul li img");
                for(var n=0;n<$ulImg.length;n++){
                    $ulImg.eq(n).attr("src",`../${$res[0].imgurl}`);
                }
                var $contLl=$(".cont_l_l");
                var $contBox=$(".imgBox");
                var $imgBox=$(".imgBox img");
                var $sp=$(".imgBox .sp");
                var $contLis=$(".cont_b ul li");
                var $Lens=$contLis.length;
                var $contB=$(".cont_b ul");
                var $nextL=$(".next_l");
                var $nextR=$(".next_r");
                var $imgSp=$(".imgSp");
                $imgBox.attr("src",$contLis.first().find("img").attr("src"));
                $contLis.on("mouseover",function(){
                    $(this).siblings().removeClass("current");
                    $(this).addClass("current");
                    $imgBox.attr("src",$(this).find("img").attr("src"));
                })
                //编写放大镜
                $contBox.on("mouseover",function(){
                    $sp.css("display","block");
                    $imgSp.css("display","block");
                }).on("mouseout",function(){
                    $sp.css("display","none");
                    $imgSp.css("display","none");
                }).on("mousemove",function(e){
                    var scale=2;//放大系数
                    $sp.css({width:$contBox.outerWidth()/scale,height:$contBox.outerHeight()/scale});
                    $imgSp.find("img").attr("src",$imgBox.attr("src"));
                    $imgSp.find("img").css("width",$contBox.outerWidth()*scale);
                    //接下来就是焦点的移动了
                    var $ox=e.pageX-$(this).offset().left-$sp.outerWidth()/2;
                    var $oy=e.pageY-$(this).offset().top-$sp.outerHeight()/2;
                    if($ox<=0){
                        $ox=0;
                    }else if($ox>=$contBox.outerWidth()-$sp.outerWidth()){
                        $ox=$contBox.outerWidth()-$sp.outerWidth();
                    }
                    if($oy<=0){
                        $oy=0;
                    }else if($oy>=$contBox.outerHeight()-$sp.outerHeight()){
                        $oy=$contBox.outerHeight()-$sp.outerHeight();
                    }
                    $sp.css({left:$ox,top:$oy});
                    $(".imgSp img").css({
                        marginLeft:-$ox*scale,
                        marginTop:-$oy*scale
                    });
                });
                //点击左右按钮更换图片
                $contB.css("width",$contLis.eq(0).outerWidth(true)*$Lens);
                var $ns=0;
                //当点击左右的时候,实现滚动的效果
                $nextR.on("click",function(){
                    $ns++;
                    if($ns>$Lens-4){
                        $ns=$Lens-4;
                        $contB.css({left:-$contLis.eq(0).outerWidth(true)*$ns+19});
                    }
                    $contB.animate({left:-$contLis.eq(0).outerWidth(true)*$ns+19},50);
                })
                $nextL.on("click",function(){
                    $ns--;
                    if($ns<=0){
                        $ns=0
                        $contB.animate({left:-$contLis.eq(0).outerWidth(true)*$ns+19},50);
                    }
                    $contB.animate({left:-$contLis.eq(0).outerWidth(true)*$ns+19},50);
                })
                //添加购物车的内容
                addCar();
            }
        })
    }
    // 底部的滚动banner图
    function footerBan(){
        var $div=$(".hot_pro div");
        var $bigBox=$(".hot_pro");
        var $hotL=$(".hot_l");
        var $hotR=$(".hot_r");
        //请求数据
        var num=40;
        $.ajax({
            type:"get",
            url:"../api/index.php",//发送数据到php
            data:"num="+num,
            success:function(msg){
                var $res=JSON.parse(msg);
                for(var i=0;i<4;i++){
                    var $ul=$("<ul/>");
                    var str=$.map($res.slice(i*10,(i+1)*10),function(item){
                        return `<li data-id="${item.guid}">
                        <a href="#" class="aimg"><img src="../${item.imgurl}"/></a>
                        <a href="#" class="atit">${item.title}</a>
                    </li>`;
                    }).join("");
                    $ul.html(str);
                    $ul.appendTo($div);
                }
                //算出整个div的宽度先
                //先复制第一个到最后先
                var $copy=$div.find("ul").first().clone(true);
                $copy.appendTo($div);
                var $w=$div.find("ul").first().outerWidth();
                var $len=$div.find("ul").length;
                $div.css("width",$w*$len);
                //开始自动轮播先
                var timer;
                var i=0;
                showBanner();
                $bigBox.on("mouseover",function(){
                    clearInterval(timer);
                });
                $bigBox.on("mouseout",function(){
                    showBanner();
                });
                //点击右边的按钮
                $hotR.on("click",function(){
                    autoplay();
                });
                //点击左边按钮
                $hotL.on("click",function(){
                    if(i==0){
                        i=$len-1;
                        $div.css("left",-$w*i);
                    }
                    i--;
                    $div.stop().animate({left:-$w*i},1000);
                });
                //得到所有的a标签
                var $hotA=$(".hot_pro div a");
                $hotA.on("click",function(){
                    var guid=$(this).closest('li').attr("data-id");
                    location.href="details.html?guid="+guid;
                });
                //封装一个自动播放的动画
                function showBanner(){
                    timer=setInterval(function(){
                        autoplay();
                    },2500);
                }
                function autoplay(){
                    i++;
                    if(i==$len){
                        //当到达最后一张的时候
                        $div.css("left",0);
                        i=1;
                    }
                    $div.stop().animate({left:-$w*i},1000);
                }
            }    
        })
    }
    // 返回顶部
    function toTop(){
        var $totop=$("#toTop");
        $(window).on("scroll",function(){
            if(this.scrollY>=300){
                $totop.slideDown();
            }
            if(this.scrollY<300){
                $totop.slideUp();
            }
        });
        $totop.on("click",function(){
            window.scrollTo(0,0);
        });
    }
    //渲染cookie
    function cookieRender(){
        cookieStr=Cookie.getCookie("username")||"";
        if(cookieStr.length>0){
            $(".welcome i").html(cookieStr);
            $(".welcome .headerSign").html("退出");
        }else{
            $(".welcome i").html("");
            $(".welcome .headerSign").html("登录");
        }
        $(".welcome a").on("click",function(){
            Cookie.delCookie("username","/");
            
        });
        headerCar(cookieStr);
        //点击出现弹窗的相关内容
        var $ulLis=$(".my_j1 ul li a");
        var $overlay=$("#overlay");
        var $popUp=$("#popUp");
        var $closeBtn=$(".closeBtn");
        $(".header_r .my_shop a").on("click",function(e){
            e.preventDefault();
            tanWindow();
        });
        $ulLis.on("click",function(e){
            e.preventDefault();
            // if(cookieStr.length>0){//表明用户已经登录了
            //     $overlay.css("display","none");
            //     $popUp.css("display","none");
            //     location.href="car.html";
            // }else{
            //     $overlay.css("display","block");
            //     $popUp.css("display","block");
            // }
            tanWindow();
        });
        function tanWindow(){
            if(cookieStr.length>0){//表明用户已经登录了
                $overlay.css("display","none");
                $popUp.css("display","none");
                location.href="car.html";
            }else{
                $overlay.css("display","block");
                $popUp.css("display","block");
            }
        }
        $closeBtn.on("click",function(){
            $overlay.css("display","none");
            $popUp.css("display","none");
        });
        var $user=$("#poptxt");
        var $error=$(".errorts");
        var $pwd=$("#poppwd");
        var $login=$(".popbtn");
        $login.on("click",function(){
            var _user=$user.val();
            var _pwd=$pwd.val();
            if(_user.trim().length==0||_pwd.trim().length==0){
                return;
            }
            $.ajax({
                type:"post",
                url:"../api/sign.php",
                data:"user="+_user+"&pwd="+_pwd,
                success:function(msg){
                    if(msg){//如果用户名存在的话
                        Cookie.setCookie("username",JSON.parse(msg)[0].user,"","/");
                        location.href="../index.html";
                    }else{
                        $error.css("display","block");
                        $user.on("focus",function(){
                            $error.css("display","none");
                        })
                    }
                }
            })
        })
    }   
    //添加进购物车的内容
    function addCar(){
        //点击左右按钮的时候
        var $contScale=$(".cont_scale p b")
        var $scaleS=$(".scale_s");
        var $scaleJ=$(".scale_j");
        $scaleS.on("click",function(){
            var $currentVal=$contScale.html();
            $currentVal++;
            $contScale.html($currentVal);
        });
        $scaleJ.on("click",function(){
            var $currentVal=$contScale.html();
            $currentVal--;
            if($currentVal<1){
                return;
            }
            $contScale.html($currentVal);
        });
        // 当点击添加购物车的按钮时
        $(".cont_scale button").on("click",function(e){
            e.preventDefault();
            $(".headerMycarp").remove();
            clearTimeout(this.timer);
            if(cookieStr.length>0){
                $("#overlay").css("display","none");
                $("#popUp").css("display","none");
                //访问数据库添加商品
                var $currentId=location.search.split("=")[1];
                //飞入购物车相关的内容
                var $headerMycara=$(".headerMycara");
                var $currentImg=$(".imgBox img");
                var $copyImg=$currentImg.clone(true);
                $copyImg.css("position","absolute");
                $copyImg.css({left:$currentImg.offset().left,top:$currentImg.offset().top});
                $copyImg.appendTo($("body"));
                $copyImg.animate({left:$headerMycara.offset().left,top:$headerMycara.offset().top,width:20},1000,function(){
                    $copyImg.remove();
                });
                //访问数据库
                $.ajax({
                    type:"get",
                    url:"../api/details.php",
                    data:"user="+cookieStr+"&guid="+$currentId+"&qty="+$contScale.html(),
                    success:function(){
                    }
                });
                this.timer=setTimeout(function(){
                    $(".headerMycar ul").remove();
                    headerCar(cookieStr);
                },500);
            }else{
                $("#overlay").css("display","block");
                $("#popUp").css("display","block");
            }
        });
    }
    function headerCar(str){
        var $headerMycar=$(".headerMycar");
        if(str.length>0){
            $.ajax({
                type:"get",
                url:"../api/car.php",
                data:"user="+str+"&car=car",//传入car的话表是渲染的页面
                success:function(msg){
                    var $res=JSON.parse(msg);
                    if($res.length==0){
                        $headerMycar.html(`<p class="headerMycarp">购物车空空如也，赶紧选购吧！
                            <i></i>
                        </p>`);
                    }else if($res.length>0){
                        //这里已经渲染完毕了,所有的内容都是在渲染完毕的前提下进行的
                        headerRenderCar($res);
                    }
                }
            });
        }else{
            $headerMycar.html(`<p class="headerMycarp">购物车空空如也，赶紧选购吧！
                            <i></i>
            </p>`);
        }
        //渲染的代码封装
        function headerRenderCar(res){
            var $ul=$("<ul/>");
            $ul.addClass("headerMycarul");
            var $totalPrice=0;
            var $totalNum=0;
            $ul.html($.map(res,function(item){
                $totalPrice+=item.price*item.qty;
                $totalNum+=Number(item.qty);
                return `<li data-id="${item.guid}">
                            <dl class="headerpro fl">
                                <dt class="fl">
                                    <a href="html/details.html?guid=${item.guid}">
                                        <img src="../${item.imgurl}"/>
                                    </a>
                                </dt>
                            <dd class="fl">
                                <a href="html/details.html?guid=${item.guid}">${item.title}</a>
                            </dd>
                            </dl>
                            <span class="fl headerprice">${(item.price*item.qty).toFixed(2)}</span>
                            <div class="fl headersl">
                                <div class="headersl_t clearfix">
                                    <span class="headersl_t_j fl">-</span>
                                    <p class="fl">${item.qty}</p>
                                    <span class="headersl_t_s fl">+</span>
                                </div>
                                <p class="headersl_del">删除</p>
                            </div>
                        </li>`
            }));
            $ul.prependTo($headerMycar);
            carJs($totalNum,$totalPrice);
            $(".headerMycar_b a").on("click",function(){
                location.href="car.html";
            })
            headerCarDel();
            headerCarbtn();

        }
        //当点击删除按钮的时候，有删除按钮表明已经出现了
        function headerCarDel(){
            $(".headersl_del").on("click",function(){
                var $currentId=$(this).closest("li").attr("data-id");
                var $show=true;
                $(this).closest("li").remove();
                $.ajax({
                    type:"get",
                    url:"../api/car.php",
                    data:"user="+str+"&guid="+$currentId+"&show="+$show,
                    success:function(msg){
                        //这里需要渲染那个数量以及
                        var $res=JSON.parse(msg);
                        if($res.length==0){
                            $headerMycar.html(`<p class="headerMycarp">购物车空空如也，赶紧选购吧！
                            <i></i>
                            </p>`);
                        }
                        var $totalNum=0;
                        var $totalPrice=0;
                        $.map($res,function(item){//这里是为了渲染价格
                            $totalNum+=Number(item.qty);
                            $totalPrice+=item.price*item.qty;
                        })
                        carJs($totalNum,$totalPrice);
                    }
                });
            })
        }
        //渲染购物车顶部的那个数量按钮
        function carJs($totalNum,$totalPrice){
            $(".headerTotal i").html($totalNum);
            var $headerMycarB=$(".headerMycar_b");
            $headerMycarB.find("p i").html($totalNum);
            $headerMycarB.find("span").html($totalPrice.toFixed(2));
        }
        //当点击增加或者减少按钮时
        function headerCarbtn(){
            // var $headerslJ=$(".headersl_t_j");
            // var $headerslS=$(".headersl_t_s");
            $(".headersl_t span").on("click",function(){
                var currentVal=$(this).siblings("p").html();
                var $currentId=$(this).closest("li").attr("data-id");
                if($(this).hasClass("headersl_t_j")){
                    currentVal--;
                    if(currentVal<1){
                        return;
                    }
                }
                if($(this).hasClass("headersl_t_s")){
                    currentVal++;
                }
                $(this).siblings("p").html(currentVal);
                $.ajax({
                    type:"get",
                    url:"../api/car.php",
                    data:"user="+str+"&guid="+$currentId+"&qty="+currentVal,//有这个表明我需要的是数量
                    success:(msg)=>{
                       $(this).closest("li").find(".headerprice").html((currentVal*JSON.parse(msg)[0].price).toFixed(2)); 
                       //所有的价格和所有的件数
                       var $numCar=$(".headerprice");
                       // console.log($numCar);
                       var $priceCar=$(".headersl_t p");
                       var $totalNum=0;
                       var $totalPrice=0;
                       for(var i=0;i<$numCar.length;i++){
                           $totalNum+=Number($priceCar.eq(i).html()); 
                           $totalPrice+=Number($numCar.eq(i).html());
                       }
                       carJs($totalNum,$totalPrice);
                    }
                })
            })
        }
    } 
})