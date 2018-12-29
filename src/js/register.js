jQuery(function($){
    //注册相关内容
    register();
    function register(){
        var $user=$("#mobile");
        var $error=$(".ts-error i");
        var $codeBtn=$(".btn-djs");
        var $pwd=$("input[name=loginPassword]");
        var $pwdAgain=$("#rePassWord");
        var $codeTxt=$("._code_val");
        var $readme=$("#readme");
        //手机号和邮箱都能注册
        $user.on("blur",function(){
            //获取用户输入的用户名
            var _user=$(this).val();
            if(_user.trim().length==0){
                return;//当用户名为空的时候推出函数
            }
            // 验证邮箱和手机号
            if(/^[a-zA-Z][\w\-\.]*@[\da-z\-]{1,63}(\.[a-z]{2,3})+$/.test(_user) || /^1[3-8]\d{9}$/.test(_user)){
                $.ajax({
                    type:"post",
                    url:"../api/register.php",
                    data:"user="+_user,
                    success:function(msg){
                        $error.eq(0).html(_user+msg);
                    }
                })
            }
            if(!/^[a-zA-Z][\w\-\.]*@[\da-z\-]{1,63}(\.[a-z]{2,3})+$/.test(_user) || !/^1[3-8]\d{9}$/.test(_user)){
                $error.eq(0).html("您的用户名过于简单，请考虑清楚后再注册");
            }
        })
        //得到那个验证码
        $codeBtn.on("click",function(){
            var _code=renderCode();
            $codeBtn.val(_code);
        })
        //当点击提交按钮的时候，提交到数据库
        $(".btn-ljzc").on("click",function(){
            var show=true;
            if($user.val().trim().length==0||$pwd.val().trim().length==0||$pwdAgain.val().trim().length==0||$codeTxt.val().trim().length==0){
                alert("请写全相关的注册信息，谢谢配合！")
                return;
            }
            if((/^[a-zA-Z][\w\-\.]*@[\da-z\-]{1,63}(\.[a-z]{2,3})+$/.test($user.val()) || /^1[3-8]\d{9}$/.test($user.val())) && /^[a-z0-9_-]{6,20}$/.test($pwd.val()) && $pwd.val()==$pwdAgain.val() && $codeTxt.val().toUpperCase()==$codeBtn.val() && $readme.attr("checked")){
                $.ajax({
                    type:"post",
                    url:"../api/register.php",
                    data:"user="+$user.val()+"&pwd="+$pwd.val()+"&show="+show,
                    success:function(msg){
                        if(msg=="该用户名已经被注册"){
                            alert(msg);
                            location.href="register.html";
                        }else if(msg=="注册成功"){
                            alert(`恭喜您${msg}`);
                            location.href="sign.html";
                        }
                    }
                })
            }
        })
        //当你输入密码的时候
        // $pwd.on("blur",function(){
        //     var $pwdTxt=$(this).val();
        //     if(/^[a-z0-9_-]{6,20}$/.test($pwdTxt)){
        //         console.log(($pwdTxt.match(/[a-zA-Z]+/g));
        //         // if(($pwdTxt.match(/[a-zA-Z]+/g)).length>0){
        //         //     $("#aqStyle").css("background-position","0 -129px");
        //         // }else{
        //         //     $("#aqStyle").css("background-position","0 -129px");
        //         // }
        //     }
        // })
        //随机验证码的函数封装
        function renderCode(){
            var str="0123456789abcdefghigklmnopqrstuvwxyz";
            var codeStr="";
            //点击时随机生成四位二维码
            for(var i=0;i<4;i++){
                var ram=parseInt(Math.random()*36);
                codeStr+=str[ram];
            }
            return codeStr.toUpperCase();//验证码已经生成完成了
        }
    }
})