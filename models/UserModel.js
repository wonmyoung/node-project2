var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var UserSchema = new Schema({
    email : {
        type : String,
        unique : true,
       // required: [true, '이메일은 필수입니다.']
    },
    password : {
        type : String,
        //required: [true, '패스워드는 필수입니다.']
    },
    username : String,
    phone : {
        type : String,
    },
    nickname : {
        type : String,
        unique : true
    },
    address : {
        type : String,
    },
    created_at : {
        type : Date,
        default : Date.now()
    }
});

UserSchema.plugin( autoIncrement.plugin , { model : "user", field : "id" , startAt : 1 } );
module.exports = mongoose.model('user' , UserSchema);