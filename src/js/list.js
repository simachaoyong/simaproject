jQuery(function($){
    //在外面定义一个str，以便后面用到
    var str;
    cookieRender();
    toTop();
    cxSales(actionBuy);
    goodLists(pageRender,listAdd);
    // pageTurn(pageRender);
    // 根据cookie来显示头部的内容
    function cookieRender(){
        str=Cookie.getCookie("username")||"";
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
        headerCar(str)
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
            // if(str.length>0){//表明用户已经登录了
            //     $overlay.css("display","none");
            //     $popUp.css("display","none");
            //     location.href="car.html";
            // }else{
            //     $overlay.css("display","block");
            //     $popUp.css("display","block");
            // }
            tanWindow();
        });
        //封装弹窗函数
        function tanWindow(){
            if(str.length>0){//表明用户已经登录了
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
    // 促销活动那里需要渲染一下，大概两三个商品就可以了
    function cxSales(actionBuy){
        // 促销活动那一栏
        var $listcxLeft=$(".listcx_left");
        var $num=3
        $.ajax({
            type:"get",
            url:"../api/list.php",
            data:"num="+$num,
            success:function(msg){
                var $res=JSON.parse(msg).res;
                $listcxLeft.html("<h2>促销活动</h2>"+$.map($res,function(item){
                    return `<dl class="cxlist" data-id="${item.guid}">
                            <dt>
                                <a href="details.html?guid=${item.guid}" target="_blank"><img src="../${item.imgurl}"></a>
                            </dt>
                            <dd>
                                <span>送碧生源水杯1个</span><cite>${item.title}</cite><s>¥${item.price}</s> <a href="#">立即抢购</a>
                            </dd>
                    </dl>`;
                }).join(""));
                actionBuy(str);
            }
        });
    }
    // 接下来渲染列表页面的相关内容
    function goodLists(pageRender,listAdd){
        // 先渲染内容，搞好页码先
        var num=12;
        var page=1;
        var $listSearch=$(".listsearch-jg");
        var $pageLis=$(".last_page ul");
        $.ajax({
            type:"get",
            url:"../api/list.php",
            data:"num="+num+"&page="+page,
            success:function(msg){
                var $res=JSON.parse(msg);
                var $len=$res.len;//这里得到的是总的商品的个数
                var $arr=$res.res;
                //开始渲染先，每排只能渲染4个
                pageRender($arr,$listSearch);
                //接下来根据这个创建翻页
                for(var p=1;p<=Math.ceil($len/$res.num);p++){
                    var $li=$("<li/>");
                    $li.html(p);
                    if(p>1){
                        $li.addClass("pagecurrent borderpage");
                    }
                    $li.appendTo($pageLis);
                }
                // 最上面有一个商品的内容
                $(".allNum").html(`共${$len}条：`);
                $(".proNum").html(`共${$len}个商品`);
                $(".pageNum i").html($res.page);
                $(".pageNum b").html(Math.ceil($len/$res.num));
                //以上的页码都渲染完了
                //当点击对应的页码时
                $(".page_shouye").addClass("colorpage");
                $(".page_syy").addClass("colorpage");
                $pageLis.on("click","li",function(){
                    $(this).siblings("li").addClass("pagecurrent borderpage");
                    $(this).removeClass("pagecurrent borderpage");
                    //上面的页面的页码也需要更改一下
                    page=$(this).html();
                    pageChange();
                    $(".pageNum i").html(page);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                        }
                    });
                });
                function pageChange(){
                    if(page>1&&page<Math.ceil($len/$res.num)){
                            $(".page_shouye").addClass("pagecurrent borderpage").removeClass('colorpage');
                            $(".page_syy").addClass("pagecurrent borderpage").removeClass('colorpage');
                            $(".page_xyy").addClass("pagecurrent borderpage").removeClass('colorpage');
                            $(".page_my").addClass("pagecurrent borderpage").removeClass('colorpage');
                    }
                    if(page==1){
                        $(".page_shouye").removeClass("pagecurrent borderpage").addClass('colorpage');
                        $(".page_syy").removeClass("pagecurrent borderpage").addClass('colorpage');
                        $(".page_xyy").addClass("pagecurrent borderpage").removeClass('colorpage');
                        $(".page_my").addClass("pagecurrent borderpage").removeClass('colorpage');
                    }
                    if(page==Math.ceil($len/$res.num)){
                        $(".page_xyy").removeClass("pagecurrent borderpage").addClass('colorpage');
                        $(".page_my").removeClass("pagecurrent borderpage").addClass('colorpage');
                        $(".page_shouye").addClass("pagecurrent borderpage").removeClass('colorpage');
                        $(".page_syy").addClass("pagecurrent borderpage").removeClass('colorpage');
                    }  
                }
                //当点击上面的按钮时
                $(".page_l").on("click",function(){
                    nextLbtn();
                })
                //当点击上面右边的按钮时
                $(".page_r").on("click",function(){
                    nextRbtn();
                })
                //当点击下面的上一页和下一页按钮时
                $(".page_syy").on("click",function(){
                    nextLbtn();
                })
                // 当点击下一页时
                $(".page_xyy").on("click",function(){
                    nextRbtn();
                })
                // 当点击首页的时候
                $(".page_shouye").on("click",function(){
                    page=$(".pageNum i").html();
                    if(page==1){
                        return;
                    }
                    page=1;
                    pageChange();
                    $pageLis.find("li").addClass("pagecurrent borderpage");
                    $pageLis.find("li").eq(page-1).removeClass("pagecurrent borderpage");
                    $(".pageNum i").html(page);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                        }
                    })
                })
                // 当点击末页时
                $(".page_my").on("click",function(){
                    page=$(".pageNum i").html();
                    if(page==Math.ceil($len/$res.num)){
                        return;
                    }
                    page=5;
                    pageChange();
                    $pageLis.find("li").addClass("pagecurrent borderpage");
                    $pageLis.find("li").eq(page-1).removeClass("pagecurrent borderpage");
                    $(".pageNum i").html(page);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                        }
                    })
                })
                //当点击按钮的时候
                $(".pagenumbtn").on("click",function(){
                    var _value=$(".pagetxt").val();
                    if(_value<1||_value>Math.ceil($len/$res.num)){
                        return;
                    }
                    if(!isNaN(_value)){
                        page=_value;
                        pageChange();
                        $pageLis.find("li").addClass("pagecurrent borderpage");
                        $pageLis.find("li").eq(page-1).removeClass("pagecurrent borderpage");
                        $(".pageNum i").html(page);
                        $.ajax({
                            type:"get",
                            url:"../api/list.php",
                            data:"num="+num+"&page="+page,
                            success:function(msg){
                                var $res=JSON.parse(msg);
                                $listSearch.html("");
                                pageRender($res.res,$listSearch);
                            }
                        })
                    }
                })
                //封装一下点击的函数先
                function nextRbtn(){
                    page=$(".pageNum i").html();
                    if(page==Math.ceil($len/$res.num)){
                        return;
                    }
                    page++;
                    pageChange();
                    $pageLis.find("li").addClass("pagecurrent borderpage");
                    $pageLis.find("li").eq(page-1).removeClass("pagecurrent borderpage");
                    $(".pageNum i").html(page);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                        }
                    })
                }
                function nextLbtn(){
                    page=$(".pageNum i").html();
                    if(page==1){
                        return;
                    }
                    page--;
                    pageChange();
                    $pageLis.find("li").addClass("pagecurrent borderpage");
                    $pageLis.find("li").eq(page-1).removeClass("pagecurrent borderpage");
                    $(".pageNum i").html(page);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                        }
                    })
                }
                //默认按销量的从高到低排序
                var $xl=$(".xl");
                var $pl=$(".pl");
                var $jg=$(".jg");
                var $sj=$(".sj");
                var xlshow=true;
                var plshow=true;
                var jgshow=true;
                var sjshow=true;
                //所有的span
                var $pxSpan=$(".px dd span");
                var $pxI=$(".px dd span i");
                // 当点击销量的时候
                $xl.on("click",function(){
                    // 销量需要单独判断下，每次是按照销量的高低排序的
                    $pxSpan.removeClass('current');
                    $(this).addClass("current");
                    $pxI.removeClass().addClass("up");
                    if(xlshow){
                        $(this).find("i").removeClass().addClass("down"); 
                   }else{
                        $(this).find("i").removeClass().addClass("upb"); 
                   }
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page+"&xlshow="+xlshow,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                            xlshow=!xlshow;
                        }
                    })
                })
                // 当点击评论的时候
                $pl.on("click",function(){
                    classChange(this,plshow);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page+"&plshow="+plshow,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                            plshow=!plshow;
                        }
                    })
                })
                // 当点击价格的时候
                $jg.on("click",function(){
                    classChange(this,jgshow);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page+"&jgshow="+jgshow,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                            jgshow=!jgshow;
                        }
                    })
                })
                // 当点击时间的时候
                $sj.on("click",function(){
                    classChange(this,sjshow);
                    $.ajax({
                        type:"get",
                        url:"../api/list.php",
                        data:"num="+num+"&page="+page+"&sjshow="+sjshow,
                        success:function(msg){
                            var $res=JSON.parse(msg);
                            $listSearch.html("");
                            pageRender($res.res,$listSearch);
                            sjshow=!sjshow;
                        }
                    })
                })
                // 封装一个函数样式相关的函数
                function classChange(em,show){
                    $pxSpan.removeClass('current');
                    $(em).addClass("current");
                    $pxI.removeClass().addClass("up");
                    if(show){
                        $(em).find("i").removeClass().addClass("upb"); 
                   }else{
                        $(em).find("i").removeClass().addClass("down"); 
                   }  
                }
            }
        });
    }
    // 每页渲染的内容函数封装
    function pageRender(arr,ren){
        for(var i=0;i<arr.length/4;i++){
            var $div=$("<div/>");
            $div.addClass("listsearch-one clearfix");
            $div.html(
            $.map(arr.slice(i*4,(i+1)*4),function(item){
                return `<div class="fl listsearch-ztimg" data-id="${item.guid}">
                    <div class="list_img"><a href="details.html?guid=${item.guid}">
                        <img src="../${item.imgurl}"/>
                    </a></div>
                    <div class="list_tit"><a href="details.html?guid=${item.guid}">${item.title}</a></div>
                    <div class="list_price">￥${item.price}</div>
                    <div class="list_num">
                        <span class="list_xl">总销量：${item.xl} </span>
                        <a href="#" class="list_pj">${item.pj}条评论</a>
                    </div>
                    <div class="list_btn">
                        <a href="#" class="list_car">加入购物车</a>
                        <a href="details.html?guid=${item.guid}" class="list_ck">查看详情</a>
                    </div>
                </div>`
            }).join("")
            );
            $div.appendTo(ren);
            listAdd(str);
        }
    }
    //点击立即购买时，添加进购物车
    function actionBuy(str){
       var $cxlist=$(".cxlist dd a");
        $cxlist.on("click",function(e){
            $(".headerMycarp").remove();
            e.preventDefault();
            clearTimeout(this.timer);
            if(str.length>0){
                $("#overlay").css("display","none");
                $("#popUp").css("display","none");
                //访问数据库添加商品
                var $currentId=$(this).closest("dl").attr("data-id");
                //飞入购物车相关的内容
                var $headerMycara=$(".headerMycara");
                var $currentImg=$(this).closest("dl").find("dt a img");
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
                    data:"user="+str+"&guid="+$currentId+"&qty=1",
                    success:function(res){
                    }
                });
                this.timer=setTimeout(function(){
                    $(".headerMycar ul").remove();
                    headerCar(str);
                },500);
            }else{
                $("#overlay").css("display","block");
                $("#popUp").css("display","block");
            }
        });
    }
    //接下来是列表页中的内容渲染
    function listAdd(str){
        var $listCar=$(".list_car");
        $listCar.on("click",function(e){
            e.preventDefault();
            $(".headerMycarp").remove();
            clearTimeout(this.timer);
            if(str.length>0){
                $("#overlay").css("display","none");
                $("#popUp").css("display","none");
                //访问数据库添加商品
                var $currentId=$(this).closest(".listsearch-ztimg").attr("data-id");
                //飞入购物车
                var $headerMycara=$(".headerMycara");
                var $currentImg=$(this).closest("div").siblings(".list_img").find("img");
                var $copyImg=$currentImg.clone(true);
                $copyImg.css("position","absolute");
                $copyImg.css({left:$currentImg.offset().left,top:$currentImg.offset().top});
                $copyImg.appendTo($("body"));
                $copyImg.animate({left:$headerMycara.offset().left,top:$headerMycara.offset().top,width:20},1000,function(){
                    $copyImg.remove();
                });
                //访问数据库
                $.ajax({//这个数据库是添加
                    type:"get",
                    url:"../api/details.php",
                    data:"user="+str+"&guid="+$currentId+"&qty=1",
                    success:function(res){
                    }
                });
                this.timer=setTimeout(function(){
                    $(".headerMycar ul").remove();
                    headerCar(str);
                },500);
            }else{
                $("#overlay").css("display","block");
                $("#popUp").css("display","block");
            }
        });
    }
    //顶部购物车
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
    // function headerCar2(str){
    //     var $headerMycar=$(".headerMycar");
    //     if(str.length>0){
    //         $.ajax({
    //             type:"get",
    //             url:"../api/car.php",
    //             data:"user="+str+"&car=car",//传入car的话表是渲染的页面
    //             success:function(msg){
    //                 var $res=JSON.parse(msg);
    //                 if($res.length==0){
    //                     $headerMycar.html(`<p class="headerMycarp">购物车空空如也，赶紧选购吧！
    //                         <i></i>
    //                     </p>`);
    //                 }else if($res.length>0){
    //                     //这里已经渲染完毕了,所有的内容都是在渲染完毕的前提下进行的
    //                     headerRenderCar($res);
    //                 }
    //             }
    //         });
    //     }else{
    //         $headerMycar.html(`<p class="headerMycarp">购物车空空如也，赶紧选购吧！
    //                         <i></i>
    //         </p>`);
    //     }
    //     //渲染的代码封装
    //     function headerRenderCar(res){
    //         var $ul=$("<ul/>");
    //         $ul.addClass("headerMycarul");
    //         var $totalPrice=0;
    //         var $totalNum=0;
    //         $ul.html($.map(res,function(item){
    //             $totalPrice+=item.price*item.qty;
    //             $totalNum+=Number(item.qty);
    //             return `<li data-id="${item.guid}">
    //                         <dl class="headerpro fl">
    //                             <dt class="fl">
    //                                 <a href="html/details.html?guid=${item.guid}">
    //                                     <img src="../${item.imgurl}"/>
    //                                 </a>
    //                             </dt>
    //                         <dd class="fl">
    //                             <a href="html/details.html?guid=${item.guid}">${item.title}</a>
    //                         </dd>
    //                         </dl>
    //                         <span class="fl headerprice">${(item.price*item.qty).toFixed(2)}</span>
    //                         <div class="fl headersl">
    //                             <div class="headersl_t clearfix">
    //                                 <span class="headersl_t_j fl">-</span>
    //                                 <p class="fl">${item.qty}</p>
    //                                 <span class="headersl_t_s fl">+</span>
    //                             </div>
    //                             <p class="headersl_del">删除</p>
    //                         </div>
    //                     </li>`
    //         }));
    //         $ul.prependTo($headerMycar);
    //         carJs($totalNum,$totalPrice);
    //         $(".headerMycar_b a").on("click",function(){
    //             location.href="car.html";
    //         })
    //         headerCarDel();
    //         headerCarbtn();

    //     }
    //     //当点击删除按钮的时候，有删除按钮表明已经出现了
    //     function headerCarDel(){
    //         $(".headersl_del").on("click",function(){
    //             var $currentId=$(this).closest("li").attr("data-id");
    //             var $show=true;
    //             $(this).closest("li").remove();
    //             $.ajax({
    //                 type:"get",
    //                 url:"../api/car.php",
    //                 data:"user="+str+"&guid="+$currentId+"&show="+$show,
    //                 success:function(msg){
    //                     //这里需要渲染那个数量以及
    //                     var $res=JSON.parse(msg);
    //                     if($res.length==0){
    //                         $headerMycar.html(`<p class="headerMycarp">购物车空空如也，赶紧选购吧！
    //                         <i></i>
    //                         </p>`);
    //                     }
    //                     var $totalNum=0;
    //                     var $totalPrice=0;
    //                     $.map($res,function(item){//这里是为了渲染价格
    //                         $totalNum+=Number(item.qty);
    //                         $totalPrice+=item.price*item.qty;
    //                     })
    //                     carJs($totalNum,$totalPrice);
    //                 }
    //             });
    //         })
    //     }
    //     //渲染购物车顶部的那个数量按钮
    //     function carJs($totalNum,$totalPrice){
    //         $(".headerTotal i").html($totalNum);
    //         var $headerMycarB=$(".headerMycar_b");
    //         $headerMycarB.find("p i").html($totalNum);
    //         $headerMycarB.find("span").html($totalPrice.toFixed(2));
    //     }
    //     //当点击增加或者减少按钮时
    //     function headerCarbtn(){
    //         // var $headerslJ=$(".headersl_t_j");
    //         // var $headerslS=$(".headersl_t_s");
    //         $(".headersl_t span").on("click",function(){
    //             var currentVal=$(this).siblings("p").html();
    //             var $currentId=$(this).closest("li").attr("data-id");
    //             if($(this).hasClass("headersl_t_j")){
    //                 currentVal--;
    //                 if(currentVal<1){
    //                     return;
    //                 }
    //             }
    //             if($(this).hasClass("headersl_t_s")){
    //                 currentVal++;
    //             }
    //             $(this).siblings("p").html(currentVal);
    //             $.ajax({
    //                 type:"get",
    //                 url:"../api/car.php",
    //                 data:"user="+str+"&guid="+$currentId+"&qty="+currentVal,//有这个表明我需要的是数量
    //                 success:(msg)=>{
    //                    $(this).closest("li").find(".headerprice").html((currentVal*JSON.parse(msg)[0].price).toFixed(2)); 
    //                    //所有的价格和所有的件数
    //                    var $numCar=$(".headerprice");
    //                    // console.log($numCar);
    //                    var $priceCar=$(".headersl_t p");
    //                    var $totalNum=0;
    //                    var $totalPrice=0;
    //                    for(var i=0;i<$numCar.length;i++){
    //                        $totalNum+=Number($priceCar.eq(i).html()); 
    //                        $totalPrice+=Number($numCar.eq(i).html());
    //                    }
    //                    carJs($totalNum,$totalPrice);
    //                 }
    //             })
    //         })
    //     }
    // }
})