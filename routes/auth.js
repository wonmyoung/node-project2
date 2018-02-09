var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var InstagamStrategy = require('passport-instagram').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
    // https://developers.facebook.com에서 appId 및 scretID 발급
    clientID: "appId", //입력하세요
    clientSecret: "scretID", //입력하세요.
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
},
function(accessToken, refreshToken, profile, done) {
    //아래 하나씩 찍어보면서 데이터를 참고해주세요.
      //console.log(profile);
      //console.log(profile.displayName);
      //console.log('|||==========>');
      //console.log(profile.emails[0].value);
      //console.log(profile._raw);
      //console.log(profile._json);
      //console.log('<==========||');
    UserModel.findOne({ id : "fb_" + profile.id }, function(err, user){
        if(!user){  //없으면 회원가입 후 로그인 성공페이지 이동
            var regData = { //DB에 등록 및 세션에 등록될 데이터
                //username :  "fb_" + profile.id,
                password : "facebook_login",
                username : profile.displayName,
                email : profile.emails[0].value
            };
            var User = new UserModel(regData);
            User.save(function(err){ //DB저장
                done(null,regData); //세션 등록
            });
        }else{ //있으면 DB에서 가져와서 세션등록
            done(null,user);
        }

    });
}
));

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}) );


//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook', 
        { 
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail' 
        }
    )
);

//로그인 성공시 이동할 주소
router.get('/facebook/success', function(req,res){
    res.send(req.user);
});

router.get('/facebook/fail', function(req,res){
    res.send('facebook login fail');
});

passport.use(new InstagamStrategy({
    // https://developers.instagram.com에서 appId 및 scretID 발급
    clientID: "appId", //입력하세요
    clientSecret: "scretID", //입력하세요.
    callbackURL: "http://localhost:3000/auth/instagram/callback",
    profileFields: ['id','username', 'photos', 'email','address'] //받고 싶은 필드 나열
},
function(accessToken, refreshToken, profile, done) {
    //아래 하나씩 찍어보면서 데이터를 참고해주세요.
    console.log(profile);
    console.log(profile.username);
   // console.log(profile.emails[0].value);
    console.log(profile._raw);
    console.log(profile._json);
    UserModel.findOne({ username : "in_" + profile.id }, function(err, user){
        if(!user){  //없으면 회원가입 후 로그인 성공페이지 이동
            var regData = { //DB에 등록 및 세션에 등록될 데이터
                username :  profile._json.data.username,//"in_" + profile.id,
                password : "instagram_login",
               // username : profile._json.data.full_name
            };
            var User = new UserModel(regData);
            User.save(function(err){ //DB저장
                done(null,regData); //세션 등록
            });
        }else{ //있으면 DB에서 가져와서 세션등록
            done(null,user);
        }
    });
}
));

// http://localhost:3000/auth_instagram/instagram 접근시 instagram 넘길 url 작성해줌
router.get('/instagram', passport.authenticate('instagram', { scope: ['basic', 'public_content', 'follower_list', 'comments', 'relationships', 'likes']}) );


//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/instagram/callback',
passport.authenticate('instagram', 
    { 
        successRedirect: '/',
        failureRedirect: '/auth/instagram/fail' 
    }
)
);

//로그인 성공시 이동할 주소
router.get('/instagram/success', function(req,res){
res.send(req.user);
});

router.get('/instagram/fail', function(req,res){
res.send('instagram login fail');
});
module.exports = router;