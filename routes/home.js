var express = require('express');
var router = express.Router();
var ProductsModel = require('../models/ProductsModel');

/* GET home page. */
router.get('/', function(req,res){
    ProductsModel.find( function(err,products){ //첫번째 인자는 err, 두번째는 받을 변수명
        res.render( 'home' , 
            { products : products } // DB에서 받은 products를 products변수명으로 내보냄
        );
    });
});
router.get('/search', function(req, res){
    // 글 검색하는 부분
    var search_word = req.param('searchWord');
    var searchCondition = {$regex:search_word};

   // var page = req.param('page');
  //  if(page == null) {page = 1;}
  //  var skipSize = (page-1)*10;
 //   var limitSize = 10;
 //   var pageNum = 1;

    ProductsModel.find({$or:[{name:searchCondition},{description:searchCondition},{introOfProd:searchCondition}]}).sort({date:-1}).exec(function(err, searchContents){
        if(err) throw err;

        res.render('home', {title: "Products", products: searchContents, searchWord: search_word});
    });
});

// router.get('/orderDate', function(req, res){
//         // 최근 등록 순으로 보여 주기
//     ProductsModel.find({}).sort({created_at:-1}).exec(function(err, searchContents){            
//         if(err) throw err;         
//         res.render('home', {title: "Products", products: searchContents});
//         });
// });

// router.get('/orderPrice', function(req, res){
//     // 가격이 낮은순
// ProductsModel.find({}).sort({price:1}).exec(function(err, searchContents){            
//     if(err) throw err;         
//     res.render('home', {title: "Products", products: searchContents});
//     });
// });

router.post('/orderDate/ajax_product/date', function(req,res){
    console.log("==========ajax로 Post함수 진입========");
    ProductsModel.find({}).sort({created_at :-1}).exec(function(err, searchContents){            
        if(err) throw err;         
        res.json({
            products : searchContents,
            message : "success"
        });
    });
});

router.post('/orderPrice/ajax_product/price', function(req,res){
    console.log("==========ajax로 Post함수 진입========");
    ProductsModel.find({}).sort({price:1}).exec(function(err, searchContents){            
        if(err) throw err;         
        res.json({
            products : searchContents,
            message : "success"
        });
    });
});

module.exports = router;