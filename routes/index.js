
const stripe = require('stripe')('sk_test_51J16sKKJ2ijH5YDoWtycz32Jmrrir3GAqDGPRkitGyRQiw5gCVgzVs8PAhLqunx8h1f0ZeRb6NCHQKPUWwEgthPE00SPstfFKp')

var express = require('express');
var router = express.Router();
var dataBike = [
  {name:"BIKO45" ,url:"/images/bike-1.jpg" ,price:679},
  {name:"ZOOK07" ,url:"/images/bike-2.jpg" ,price:999},
  {name:"TITANS" ,url:"/images/bike-3.jpg" ,price:799},
  {name:"CEWO" ,  url:"/images/bike-4.jpg" ,price:1300},
  {name:"AMIG039",url:"/images/bike-5.jpg" ,price:479},
  {name:"LIK099" ,url:"/images/bike-6.jpg" ,price:869}];



/* GET home page. */
router.get('/home', function(req, res, next) {
  
  console.log('GET/home');
  
  
  res.render('index', { title: '', dataBike });
});

// var dataCardBike = [];

router.get('/shop', function(req, res, next){
  if (req.session.dataCardBike === undefined){
    req.session.dataCardBike = []
  };
  var alreadyExist = false;

  for(var i = 0; i< req.session.dataCardBike.length; i++){
    if(req.session.dataCardBike[i].name == req.query.name){
      req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity) + 1;
      alreadyExist = true;
    }
  }
  
  if(alreadyExist == false){
  req.session.dataCardBike.push ({
    name: req.query.name,
    url: req.query.url,
    price: req.query.price,  
    quantity: 1
  })
}

  console.log('test', alreadyExist)
  res.render('shop', { dataCardBike: req.session.dataCardBike });
});




router.get('/delete-shop', function(req, res, next) {
  dataCardBike = []
  req.session.dataCardBike.splice(req.query.position, 1)
  res.render('shop', {dataCardBike: req.session.dataCardBike});
  console.log('trash', req.session.dataCardBike.splice);
  
});



router.post('/update-shop', function (req, res, next){
  
   var position = req.body.position;
   var NouvelleQuantite = req.body.quantity;

    req.session.dataCardBike[position].quantity = NouvelleQuantite;
    console.log('update', req.session.dataCardBike)
    res.render('shop', {dataCardBike: req.session.dataCardBike})
});


// CHECKOUT

router.post('/create-checkout-session', async (req, res) => {

   stripeItems = []

    for (var bike=0; bike < req.session.dataCardBike.length; bike++){
      stripeItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: req.session.dataCardBike[bike].name,
          },
          unit_amount: Number(req.session.dataCardBike[bike].price)*100,
        },
        quantity: req.session.dataCardBike[bike].quantity,
      });
    }
   
   
    const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: stripeItems,
    mode: 'payment',
    success_url: "http://localhost:3000/confirm",
    cancel_url: "http://localhost:3000/",
  });

  res.json({ id: session.id });
});

router.get('/confirm', function(req, res, next){
  res.render('confirm')
})


module.exports = router;
