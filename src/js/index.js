jQuery(function($){
    cookieRender()
    bannerShow();
    //上面轮播广告
    bannerBottom();
    tabChange();
    hotChange();
    bjRender();
    footerBan();
    toTop();
    function bannerShow(){
        //第一张显示
        var $lis=$(".pic li");
        var $position=$("#position li");
        var $len=$lis.length;
        var i=0;
        $lis.eq(0).show();
        //鼠标滑过手动切换，淡入淡出
        $position.mouseover(function() {
            $(this).addClass('cur').siblings().removeClass("cur");
            var index = $(this).index();
            i = index;
            $lis.eq(index).stop().fadeIn(500).siblings().stop().fadeOut(500);
        });
        //默认都是向右切换的
        var timer=setInterval(play,2000);
        //向右切换
        function play(){
            i++;
            i = i > $len-1 ? 0 : i ;
            $("#position li").eq(i).addClass('cur').siblings().removeClass("cur");
            $(".pic li").eq(i).stop().fadeIn(500).siblings().stop().fadeOut(500);
        }
        //向左切换
        var playLeft=function(){
            i--;
            i = i < 0 ? $len-1 : i ;
            $("#position li").eq(i).addClass('cur').siblings().removeClass("cur");
            $(".pic li").eq(i).stop().fadeIn(500).siblings().stop().fadeOut(500);
        }
        //鼠标移入移出效果
        $("#bannerBox").hover(function() {
            clearInterval(timer);
        }, function() {
            timer=setInterval(play,2000);
        });
        //左右点击切换
        $("#prev").on("click",function(e){
            e.preventDefault();
            playLeft();
        }); 
        $("#next").on("click",function(e){
            e.preventDefault();
            play();
        });    
    }
	//下面轮播广告
    function bannerBottom(){
        var $bannerSmall=$(".bannerSmall");
        var $bannerMain=$(".bannerMain");
        var $ul=$(".bannerMain ul");
        var $allowL=$(".allow_l");
        var $allowR=$(".allow_r");
        //先复制出一个多的
        $ul.first().clone(true).appendTo($bannerMain);
        var $len=$(".bannerMain ul").length;
        //计算出整个的宽度是多少先
        $bannerMain.css("width",$ul.get(0).offsetWidth*$len);
        var i=0;
        var timer;
        showBanner();
        $bannerSmall.on("mouseover",function(){
            clearInterval(timer);
        });
        $bannerSmall.on("mouseout",function(){
            showBanner();
        });
        //点击右边的按钮
        $allowR.on("click",function(e){
            e.preventDefault();
            autoplay();
        });
        //点击左边按钮
        $allowL.on("click",function(e){
            e.preventDefault();
            if(i==0){
                i=$len-1;
                $bannerMain.css("left",-$ul.get(0).offsetWidth*i);
            }
            i--;
            $bannerMain.stop().animate({left:-$ul.get(0).offsetWidth*i},500);
        });
        //封装一个自动播放的动画
        function showBanner(){
            timer=setInterval(function(){
                autoplay();
            },2000);
        }
        function autoplay(){
            i++;
            if(i==$len){
                //当到达最后一张的时候
                $bannerMain.css("left",0);
                i=1;
            }
            $bannerMain.stop().animate({left:-$ul.get(0).offsetWidth*i},500);
        }
    }
    // tab切换
    function tabChange(){
        var $titLis=$(".tit li");
        var $picBan=$(".picBan li");
        var $tab=$(".jd_nav li");
        var i=0;
        $titLis.on("mouseover",function(){
            $(this).siblings("li").removeClass('titcurrent');
            $(this).addClass('titcurrent');
            i=$(this).index();
            $picBan.siblings().hide();
            $picBan.eq(i).show();
        });

        $tab.on("mouseover",function(){
            $(this).siblings("li").removeClass('navcurrent');
            $(this).addClass('navcurrent');
            i=$(this).index();
            $picBan.siblings().hide();
            $picBan.eq(i).show();
        });
    }
    //热门促销切换
    function hotChange(){
        var $lis=$(".hotBuy_tit ul li");
        var $hotMain=$(".hotBuy_pro");
        var num=12;
        $.ajax({
            type:"get",
            url:"api/index.php",//发送数据到php
            data:"num="+num,
            success:function(msg){//传递的参数就是json字符串了
                //接着开始渲染了
                var $res=JSON.parse(msg);
                for(var i=0;i<3;i++){
                    //每一遍历都要渲染一次
                    var $ul=$("<ul/>")
                    var str=$.map($res.slice(4*i,(i+1)*4),function(item){
                        return `<li data-id="${item.guid}">
                            <div>
                                <a href="html/details.html?guid=${item.guid}"><img src="${item.imgurl}"/></a>
                            </div>
                            <p><a href="html/details.html?guid=${item.guid}">${item.title}</a></p>
                            <span>惊喜特惠价：${item.price}元</span>
                        </li>`;
                    }).join("");
                    $ul.html(str);
                    $ul.appendTo($hotMain);
                    //当鼠标移入相关的内容的时候
                    $lis.on("mouseover",function(){
                        $(this).siblings('li').removeClass("current");
                        $(this).addClass("current");
                        $(".hotBuy_pro ul").hide();
                        $(".hotBuy_pro ul").eq($(this).index()).show();
                    })
                }
            }
        });
    }
    //渲染保健品专区
    function bjRender(){
        var $proMains=$(".proMain_c .proMain_child");
        var $len=$proMains.length;
        var $bjTit=$(".bj_pro_t ul li");
        var num=20;
        $.ajax({
            type:"get",
            url:"api/index.php",//发送数据到php
            data:"num="+num,
            success:function(msg){//传递的参数就是json字符串了
                //接着开始渲染了
                var $res=JSON.parse(msg);
                for(var i=0;i<5;i++){
                    var $ul=$("<ul/>");
                    $ul.addClass('child_02');
                    var str=$.map($res.slice(4*i,4*(i+1)),function(item){
                        return `<li data-id="${item.guid}">
                                <div>
                                    <a href="html/details.html?guid=${item.guid}"><img src="${item.imgurl}"/>
                                    </a>
                                </div>
                                <span>￥${item.price}</span>
                                <p><a href="#">${item.title}</a></p>
                            </li>`;
                    }).join("");
                    $ul.html(str);
                    $ul.appendTo($proMains.eq(i));
                }
                //上面的数据已经渲染完成了
                var $uls=$(".proMain_c .proMain_child");
                $uls.siblings().css("display","none");
                $uls.eq(0).css("display","block");
                $bjTit.on("mouseover",function(){
                    $(this).siblings().removeClass("current");
                    $(this).addClass("current");
                    $uls.siblings().hide();
                    $uls.eq($(this).index()).show();
                });
            }
        });
    }
    //底部轮播图渲染
    function footerBan(){
        var $div=$(".hot_pro div");
        var $bigBox=$(".hot_pro");
        var $hotL=$(".hot_l");
        var $hotR=$(".hot_r");
        //请求数据
        var num=40;
        $.ajax({
            type:"get",
            url:"api/index.php",//发送数据到php
            data:"num="+num,
            success:function(msg){
                var $res=JSON.parse(msg);
                for(var i=0;i<4;i++){
                    var $ul=$("<ul/>");
                    var str=$.map($res.slice(i*10,(i+1)*10),function(item){
                        return `<li data-id="${item.guid}">
                        <a href="html/details.html?guid=${item.guid}" class="aimg"><img src="${item.imgurl}"/></a>
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
                    $div.stop().animate({left:-$w*i},500);
                });
                //封装一个自动播放的动画
                function showBanner(){
                    timer=setInterval(function(){
                        autoplay();
                    },2000);
                }
                function autoplay(){
                    i++;
                    if(i==$len){
                        //当到达最后一张的时候
                        $div.css("left",0);
                        i=1;
                    }
                    $div.stop().animate({left:-$w*i},500);
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
    // 根据cookie来显示头部的内容
    function cookieRender(){
        var str=Cookie.getCookie("username")||"";
        if(str.length>0){
            $(".welcome i").html(str);
            $(".welcome .headerSign").html("退出");
        }else{
            $(".welcome i").html("");
            $(".welcome .headerSign").html("登录");
        }
        $(".welcome a").on("click",function(){
            Cookie.delCookie("username","/");
        });
        headerCar(str);
        //点击出现弹窗的相关内容
        var $ulLis=$(".my_j1 ul li a");
        var $overlay=$("#overlay");
        var $popUp=$("#popUp");
        var $closeBtn=$(".closeBtn");
        $(".header_r .my_shop a").on("click",function(e){
            e.preventDefault();
            tanWindow();
        })
        $ulLis.on("click",function(e){
            e.preventDefault();
            tanWindow();
        });
        //封装弹窗函数
        function tanWindow(){
            if(str.length>0){//表明用户已经登录了
                $overlay.css("display","none");
                $popUp.css("display","none");
                location.href="html/car.html";
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
                url:"api/sign.php",
                data:"user="+_user+"&pwd="+_pwd,
                success:function(msg){
                    if(msg){//如果用户名存在的话
                        Cookie.setCookie("username",JSON.parse(msg)[0].user,"","/");
                        location.href="index.html";
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
    //渲染顶部的购物车
    function headerCar(str){
        var $headerMycar=$(".headerMycar");
        if(str.length>0){
            $.ajax({
                type:"get",
                url:"api/car.php",
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
                                        <img src="${item.imgurl}"/>
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
                location.href="html/car.html";
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
                    url:"api/car.php",
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
                    url:"api/car.php",
                    data:"user="+str+"&guid="+$currentId+"&qty="+currentVal,//有这个表明我需要的是数量
                    success:(msg)=>{
                       $(this).closest("li").find(".headerprice").html((currentVal*JSON.parse(msg)[0].price).toFixed(2)); 
                       //所有的价格和所有的件数
                       var $numCar=$(".headerprice");
                       console.log($numCar);
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