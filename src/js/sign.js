jQuery(function($){
    sign();
    function sign(){
        var $user=$("#userName2");
        var $error=$(".userError");
        var $pwd=$("#password2");
        var $login=$("#ptLogin");
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
})