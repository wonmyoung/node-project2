var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passwordHash = require('../libs/passwordHash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require("nodemailer");
var generator = require('random-password');
var sendMailer = require('../libs/sendMailer');
var request = require("request");

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    var result = user;
    result.password = "";  //??
    console.log('deserializeUser');
    done(null, result);
});

router.get('/term', function(req, res){
    res.render('accounts/term');
});

router.get('/privacy', function(req, res){
    res.render('accounts/privacy');
});

//로그인 인증
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, 
    function (req, email, password, done) {
        UserModel.findOne({ email : email , password : passwordHash(password)}, function (err,user) {
            if (!user){
                console.log('=====인증 실패===========')
                return done(null, false, { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user );
            }
        });
    }
));

router.get('/', function(req, res){
    res.send('account app');
});

router.get('/join', function(req, res){
    res.render('accounts/join');
});

//이메일 인증
//인증번호 생성+이메일,인증번호,cert저장
router.post('/join/emailToken', function(req, res){

    var cert_num = generator(8);

    console.log(cert_num);
    UserModel.findOne({'email': req.body.email}, function(err,user){
        if(err){
            console.log(err);
            return false;
        }
        else if(user){
            console.log(user);
            res.send('<script>alert("이미 회원가입 하셨습니다.");location.href="/accounts/join";</script>');
            return false;
        }
        else{
        var User = new UserModel({
            email : req.body.email,
            certbumber : passwordHash(cert_num),
            cert : false
        });
        User.save(function(err){
            if(err){
            console.log(err);
            res.json({message:"fail"});
            }
        var content = "다음의 인증번호를 회원가입 이메일 인증에 기입하세요."+cert_num;
        //var mailconfirm = sendMailer(req,res,content);
        sendMailer(req,res,content);
            res.json({message:"sendmail_success"});    
      });
    }
  });
});

//이메일 인증
//인증번호 확인, 맞으면 ok return
router.post('/join/emailToken/confirm', function(req, res){
   
    UserModel.findOne({'email': req.body.email}, function(err,user){
        if(err){
            res.json({message:"cert_fail"});
        }
        else(req.body.cert_num===user.certbumber)
            var cert = true;
        
            UserModel.update({ email : req.body.email }, { cert : cert }, function(err){
                if(err){
                    console.log(err);
                    return false;
                }
                res.json({message:"cert_success"}); 
            });
    });
});

//회원가입 인증
router.post('/join', function(req, res){
    UserModel.findOne({'email': req.body.email}, function(err,user){
        if(err){
            return false;
        }
        else if(user){
            res.send('<script>alert("이미 회원가입 하셨습니다.");location.href="/accounts/join";</script>');
            return false;
        }
        else{
        var User = new UserModel({
            email : req.body.email,
            password : passwordHash(req.body.password),
            username : req.body.username,
            phone : req.body.phone,
            nickname:req.body.nickname,
            address:req.body.address
        });
        User.save(function(err,user){
            console.log(user);
            res.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>');
        });
        var content = "회원 가입을 진심으로 감사드립니다. 앞으로 많은 이용 부탁 드리겠습니다.";
        sendMailer(req,res,content);
    }
  });
});

router.get('/login', function(req, res){
    res.render('accounts/login', { flashMessage : req.flash().error });
});

router.get('/lostpass', function(req, res){
    res.render('accounts/lostpass');
});


router.get('/success', function(req, res){
    res.send(req.user);
});

router.post('/lostpass', function(req, res){
    var imsi_password = generator(10);
     //해당 email이 등록된 것인지 확인
     console.log( req.body.email);
    UserModel.findOne( {'email' : req.body.email} , function(err, user){
        console.log(imsi_password);
        console.log(user);
        if(!user){
            return false;
            //res.send('<script>alert("등록된 이메일이 아닙니다.");location.href="/lostpass";</script>');
        }
        if(err){
            return false;
        }
        console.log(user);
        UserModel.update({ email : req.body.email }, { password : passwordHash(imsi_password) }, function(err){
            if(err){
                console.log(err);
                return false;
            }
           
        });

    });
        var transport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
            user: '본인 지메일',
            pass:'본인 이메일 비밀 번호'
        }
      });
      
      var mailOptions = {
          from: '본인 지메일',
          to: req.body.email,
         // subject: req.body.name,
          html : "임시 비밀 번호 : " + imsi_password
          /*text: "보내는 사람 :" + req.body.name + 
                "전화번호 :" + req.body.name + 
                "이메일 :"+ req.body.email+ 
                "내용 :"  + req.body.description    */
        };
      
      transport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        // smtpTransport.close(); // shut down the connection pool, no more messages
        transport.close(); // 필요 없으니 종료!!
      });
      res.send('<script>alert("이메일에서 임시번호를 확인하세요");location.href="/";</script>');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/accounts/login');
});

router.get('/account_Info' ,function(req, res){

    UserModel.findOne( {email : req.user.email} , function(err, user){
        if(err){
            console.log(err);
            return false;
        }
        console.log(user);
        //넣을 변수 값을 셋팅한다
        var userinfo = {
            username : user.username,
            email :  user.email,
            phone :  user.phone,
            nickname: user.nickname,
            address: user.address
        }
        if(!userinfo){
            res.send('<script>alert("회원정보 못받음");location.href="/";</script>');
            return false;
        }
        res.render('accounts/account_Info', {userinfo : userinfo});
    });
});

router.get('/accounts_modify' , function(req, res){

    UserModel.findOne( {username : req.user.username} , function(err, user){
        if(err){
            console.log(err);
        }
        console.log("session정보를 통해 user정보 가져옴 : "+req.session.username);
        //넣을 변수 값을 셋팅한다
        var userinfo = {
            username : user.username,
            email :  user.email,
            phone :  user.phone,
            nickname : user.nickname,
            address : user.address
        }
        if(!userinfo){
            res.send('<script>alert("회원정보 못받음");location.href="/";</script>');
            return false;
        }
        console.log("=========회원 정보 : "+userinfo);
        res.render('accounts/accounts_modify', {userinfo : userinfo});
    });
});

router.post('/login' , 
    passport.authenticate('local', { 
        failureRedirect: '/accounts/login', 
        failureFlash: true 
    }), 
    function(req, res){
        res.send('<script>alert("로그인 성공");location.href="/";</script>');
    }
);

router.post('/accounts_modify', function(req, res){

    UserModel.findOne({ email : req.body.email , password : passwordHash(req.body.password)}, function (err,user) {

        if(user){
            var change_userinfo = {
                username :  req.body.username,
                email :  req.body.email,
                phone :  req.body.phone,
                nickname : req.body.nickname,
                address : req.body.address
            }
            UserModel.update( {email : req.body.email} , {$set : change_userinfo}, function(err, user){
            if(err){
                console.log(err);
                return false;
            }
            req.session.passport.user=change_userinfo; 
            res.send('<script>alert("회원님의 정보가 변경 되었습니다.");location.href="/accounts/account_Info";</script>');
            });
     //console.log("=========변경된 회원 정보 : "+req.session.passport.user.username);
    // console.log("=========변경된 회원 정보 : "+req.session.passport.user.email);
   //  console.log("=========변경된 회원 정보 : "+req.session.passport.user.phone);
   //  console.log("=========변경된 회원 정보 : "+req.session.passport.user.nickname);
   //  console.log("=========변경된 회원 정보 : "+req.session.passport.user.address);
   //  console.log("=========변경된 회원 정보 : "+req.session.passport.user.password);
       }else
       res.send('<script>alert("비밀번호를 잘못 입력하셨습니다.");location.href="/accounts/accounts_modify";</script>');
   });
});

module.exports = router;