var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order =  require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(error,docs){
    var productArray = [];
    var productCount = 3;
    for(var i=0; i< docs.length;i+=productCount){
      productArray.push(docs.slice(i, i + productCount))
    }
    res.render('shop/index', { title: 'Online Shopping', products: productArray, successMsg: successMsg, noMessages: !successMsg });
  });
 
});
router.get('/example', function(req, res, next){
  var successMsg = req.flash('success')[0];
  Product.find({}, {}, function(e, docs) {
    var productArray = [];
      var productCount = 3;
      
      // for(var i=0; i< docs.length;i+=productCount){
      //    productArray.push(docs.slice(i, i + productCount))
      // }
    res.render('shop/example', {products : docs, successMsg: successMsg, noMessages: !successMsg});
});
  // Product.find(function(error,docs){
  //   var productArray = [];
  //   var productCount = 3;
    
  //   for(var i=0; i< docs.length;i+=productCount){
  //     productArray.push(docs.slice(i, i + productCount))
  //   }
  //   res.render('shop/example', { title: 'Online Shopping', products: productArray, people: [{firstName: "Rahul", lastName: "Bhate"},{firstName: "Rashmi", lastName: "Basnet"},{firstName: "Veda", lastName: "Bhate"}], successMsg: successMsg, noMessages: !successMsg });
  // });
});
router.get('/example1', function(req, res, next){
    res.render('shop/example1', { title: 'Online Shopping'});
  });

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart =  new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(error, product){
    if(error){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart =  new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});
router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart =  new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', { product: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{ products: cart.generateArray(), totalPrice: cart.totalPrice})
});

router.get('/checkout', isLoggedIn, function(req,res,next){
  if(!req.session.cart){
    return res.render('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout',isLoggedIn, function (req, res, next){
  if(!req.session.cart){
    return res.render('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")(
    "sk_test_E4e0J5dFPh53uXECMVYASnSF007jxl702a"
);

stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "aud",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
}, function(err, charge) {
    if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
    }
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
    });
    order.save(function(err, result) {
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
    });
}); 
});
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
