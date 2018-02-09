var express = require('express');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var router = express.Router();

module.exports = function(req, res,content){
  var transport = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
      user: '본인이메일주소@gmail.com',
      pass:'본인이메일 비밀번호'
  }
});
var mailOptions = {
    from: '본인이메일주소@gmail.com',
    to: req.body.email,
   // subject: req.body.name,
    text : content
    /*text: "보내는 사람 :" + req.body.name + 
          "전화번호 :" + req.body.name + 
          "이메일 :"+ req.body.email+ 
          "내용 :"  + req.body.description    */
  };
    console.log("회원가입 이메일 전송 To : " +  req.body.email);
    console.log("이메일 내용 : " + content );
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
}