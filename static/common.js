function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookieHour( name, value, hours ){   
    var now = new Date();
	var time = now.getTime();
	time += 3600 * 1000 * hours;
	now.setTime(time);
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + now.toUTCString() + ";"   
}
function authJoin(){
    $(document).ready(function() {
                function email_check( email ) { 
                var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                return (regex.test(email));         
            }
            $('#join_form').submit(function(){
                var $email = $('#join_form input[name=email]');
                var $passwordInput = $('#join_form input[name=password]');
                var $passwordInput2 = $('#join_form input[name=password2]');
                var $username = $('#join_form input[name=username]');
                var $phone = $('#join_form input[name=phone]');
                var $nickname = $('#join_form input[name=nickname]');
                var $address = $('#join_form input[name=address]');

                    if(!$email.val()){
                        alert("이메일을 입력해주세요.");
                        $email.focus();
                        return false;
                    }
                    if(! email_check($email.val()) ) {
                        alert('잘못된 형식의 이메일 주소입니다.');
                        $(this).focus();
                        return false;
                    }
                    if(!$passwordInput.val()){
                        alert("패스워드를 입력해주세요.");
                        $passwordInput.focus();
                        return false;
                    }
                    var reg_pw = /^.*(?=.{8,17})(?=.*[0-9])(?=.*[a-zA-Z]).*$/; 
                    if(!reg_pw.test($passwordInput.val())) { 
                        alert("8~17자 영문 대 소문자, 숫자, 특수문자를 사용하세요."); 
                        $passwordInput.focus();
                        return false; 
                    }else if(/(\w)\1\1/.test($passwordInput.val())) { 
                        alert('패스워드에 같은 문자를 3번 이상 사용하실 수 없습니다.');  
                        $passwordInput.focus(); 
                        return false; 
                    }
                    if(!$passwordInput2.val()){
                        alert("확인 패스워드를 입력해주세요.");
                        $passwordInput2.focus();
                        return false;
                    }
                    if($passwordInput.val() !== $passwordInput2.val()){
                        alert("패스워드가 서로 같지 않습니다 정확히 입력해 주십시요.");
                        return false;
                    }
                    if(!$username.val()){
                        alert("이름을 입력해주세요.");
                        $username.focus();
                        return false;
                    }
                    if(!$phone.val()){
                        alert("전화번호를 입력해주세요.");
                        return false;
                    }
                    if(!$address.val()){
                        alert("주소를 입력해주세요.");
                        return false;
                    }
                });
            });        
            return true; 
    }

